# DOKUMENTASI OSIM

Website dokumentasi kegiatan OSIM dengan section Umum/Panitia dan dashboard PDD.

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Seed credentials:

- Panitia: password `panitia123`
- PDD: username `pdd`, password `pdd12345`
- Admin: username `Dekdok58`, password `1958_mtuu`

Halaman pilihan admin tersedia di `/admin`, login admin berada di `/admin/login`, lalu dashboard pengelola berada di `/admin/dashboard`.
