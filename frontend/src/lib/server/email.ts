import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from '$env/static/private';

const transporter = nodemailer.createTransport({
	host: SMTP_HOST,
	port: Number(SMTP_PORT),
	secure: Number(SMTP_PORT) === 465,
	auth: { user: SMTP_USER, pass: SMTP_PASS }
});

export async function kirimKodeOtp(email: string, kode: string) {
	await transporter.sendMail({
		from: `"Nitip" <${SMTP_USER}>`,
		to: email,
		subject: 'Kode Reset Kata Sandi — Nitip',
		html: `
			<p>Halo,</p>
			<p>Kode reset kata sandi kamu:</p>
			<h2 style="letter-spacing: 4px;">${kode}</h2>
			<p>Kode ini berlaku 10 menit. Kalau kamu tidak meminta ini, abaikan saja email ini.</p>
		`
	});
}