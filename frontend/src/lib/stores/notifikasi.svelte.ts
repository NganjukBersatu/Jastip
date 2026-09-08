let jumlahBelumDibaca = $state(0);
let daftarToast = $state<{ id: string; teks: string }[]>([]);

let sudahMulaiPolling = false;
let sudahCekPertama = false;

export function notifikasiState() {
	return {
		get jumlah() {
			return jumlahBelumDibaca;
		},
		get toast() {
			return daftarToast;
		}
	};
}

export function tampilkanToast(teks: string) {
	const id = crypto.randomUUID();
	daftarToast = [...daftarToast, { id, teks }];
	setTimeout(() => tutupToast(id), 4000);
}

export function tutupToast(id: string) {
	daftarToast = daftarToast.filter((t) => t.id !== id);
}

export function mulaiPollingNotifikasi() {
	if (sudahMulaiPolling) return;
	sudahMulaiPolling = true;

	async function cek() {
		try {
			const res = await fetch('/api/notifikasi/unread');
			if (!res.ok) return;
			const { jumlah } = await res.json();

			if (sudahCekPertama && jumlah > jumlahBelumDibaca) {
				tampilkanToast('Ada pesan baru masuk.');
			}

			jumlahBelumDibaca = jumlah;
			sudahCekPertama = true;
		} catch {
			// diamkan, coba lagi di polling berikutnya
		}
	}

	cek();
	setInterval(cek, 8000);
}