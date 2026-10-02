import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const MAKS_FILE = 3;
export const MAKS_UKURAN = 2 * 1024 * 1024; // 2 MB

// disimpan di luar folder static supaya tidak bisa dibuka publik
const FOLDER = path.join(process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads'), 'aduan');

type Jenis = { mime: string; ext: string };

// deteksi jenis dari isi file, bukan dari nama / tipe yang dikirim browser
function deteksiJenis(b: Uint8Array): Jenis | null {
	if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { mime: 'image/jpeg', ext: 'jpg' };
	if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)
		return { mime: 'image/png', ext: 'png' };
	if (
		b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
		b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
	)
		return { mime: 'image/webp', ext: 'webp' };
	return null;
}

export type BuktiSiap = { buffer: Buffer; mime: string; ext: string; namaAsli: string };

export async function periksaBukti(
	files: File[]
): Promise<{ error: string } | { siap: BuktiSiap[] }> {
	if (files.length > MAKS_FILE) return { error: `Maksimal ${MAKS_FILE} foto bukti.` };
	const siap: BuktiSiap[] = [];
	for (const f of files) {
		if (f.size > MAKS_UKURAN) return { error: `Foto "${f.name}" lebih dari 2 MB.` };
		const buffer = Buffer.from(await f.arrayBuffer());
		const jenis = deteksiJenis(buffer);
		if (!jenis) return { error: `"${f.name}" bukan foto JPG, PNG, atau WEBP.` };
		siap.push({ buffer, ...jenis, namaAsli: f.name.slice(0, 100) });
	}
	return { siap };
}

// kalau nanti mau pindah ke penyimpanan lain (mis. cloud), ganti dua fungsi di bawah ini saja
export async function simpanBukti(b: BuktiSiap): Promise<string> {
	await mkdir(FOLDER, { recursive: true });
	const namaFile = `${crypto.randomUUID()}.${b.ext}`;
	await writeFile(path.join(FOLDER, namaFile), b.buffer);
	return namaFile;
}

export async function bacaBukti(namaFile: string): Promise<Buffer> {
	if (!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(namaFile)) throw new Error('Nama file tidak valid');
	return readFile(path.join(FOLDER, namaFile));
}