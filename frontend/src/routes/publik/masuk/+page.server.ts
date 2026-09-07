import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();

    const email = data.get('email')?.toString().trim();
    const password = data.get('password')?.toString();

    // Validasi input
    if (!email || !password) {
      return fail(400, {
        error: 'Email dan kata sandi wajib diisi.'
      });
    }

    // Validasi format email sederhana
    if (!email.includes('@')) {
      return fail(400, {
        error: 'Format email tidak valid.'
      });
    }

    /*
      ==================================================
      TEMPAT LOGIN DATABASE
      ==================================================

      Nantinya bagian ini diganti dengan pengecekan
      user ke database PostgreSQL/MySQL kamu.

      Contoh konsep:

      const user = await db.user.findUnique({
        where: { email }
      });

      if (!user) {
        return fail(400, {
          error: 'Email atau kata sandi salah.'
        });
      }

      const passwordValid = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordValid) {
        return fail(400, {
          error: 'Email atau kata sandi salah.'
        });
      }
    */


    // Contoh sementara
    console.log('LOGIN:', {
      email,
      password
    });


    /*
      ==================================================
      SESSION
      ==================================================

      Setelah database sudah terhubung,
      buat session/token di sini.

      Contoh sederhana:

      cookies.set('session', 'SESSION_ID', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60 * 24 * 7
      });
    */


    // Untuk sementara diarahkan ke dashboard
    throw redirect(303, '/dashboard');
  }
};