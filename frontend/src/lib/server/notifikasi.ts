import { db } from '$lib/server/db';
import { pengajuanHarga, pesanChat } from '$lib/server/db/schema';
import { eq, and, ne, or, countDistinct } from 'drizzle-orm';

export async function hitungPesanBelumDibaca(
	userId: string
): Promise<number> {
	const [row] = await db
		.select({
			jumlah: countDistinct(pengajuanHarga.id)
		})
		.from(pesanChat)
		.innerJoin(
			pengajuanHarga,
			eq(
				pesanChat.pengajuanHargaId,
				pengajuanHarga.id
			)
		)
		.where(
			and(
				ne(pesanChat.pengirimId, userId),
				eq(pesanChat.dibaca, false),
				or(
					eq(
						pengajuanHarga.pelangganId,
						userId
					),
					eq(
						pengajuanHarga.jastiperId,
						userId
					)
				)
			)
		);

	return Number(row?.jumlah ?? 0);
}

export async function tandaiSudahDibaca(
	pengajuanHargaId: string,
	userId: string
): Promise<void> {
	await db
		.update(pesanChat)
		.set({
			dibaca: true
		})
		.where(
			and(
				eq(
					pesanChat.pengajuanHargaId,
					pengajuanHargaId
				),
				ne(pesanChat.pengirimId, userId)
			)
		);
}