---
title: Deploy Laravel For Free ke Vercel + Supabase
description: Tutorial deploy aplikasi Laravel + Vite secara gratis ke Vercel menggunakan vercel-php, Supabase Postgres Session Pooler, migration/import data dari lokal, dan troubleshooting error build.
date: 2026-06-13
category: tutorial
tags:
  - laravel
  - vercel
  - supabase
  - deployment
  - postgresql
draft: false
---

Deploy Laravel ke Vercel memang tidak sesederhana deploy frontend Vite biasa. Laravel membutuhkan PHP runtime, Composer dependencies, environment variables, koneksi database, session, cache, dan routing server-side. Di tutorial ini, kita akan deploy project **Laravel** ke **Vercel** dengan database **Supabase Postgres**.

::DocCallout{type="info" title="Contoh repository"}
Kalau ingin melihat contoh project yang memakai alur seperti ini, kamu bisa cek repository [godlovesmei/PBL_Kelp3_IF2A_Pagi](https://github.com/godlovesmei/PBL_Kelp3_IF2A_Pagi). Di tutorial ini, nama folder, domain, dan environment variable tetap dibuat generik agar mudah dipakai di project lain.
::

Arsitektur yang dipakai:

| Bagian | Teknologi |
| --- | --- |
| Backend app | Laravel |
| Asset frontend | Laravel Vite |
| Hosting | Vercel |
| PHP runtime | `vercel-php` community runtime |
| Database | Supabase Postgres |
| Pooler | Supabase Session Pooler |
| Session/cache | Database |
| Import data | `psql` dari lokal |

::DocCallout{type="warning" title="Catatan penting"}
Vercel bukan hosting Laravel tradisional seperti VPS, cPanel, atau Render Docker. Laravel di Vercel berjalan lewat function/serverless runtime. Karena itu, fitur upload file lokal ke `storage/app/public` atau `public/uploads` tidak aman untuk production jika tidak memakai object storage.
::

## 1. Siapkan project Laravel

Pastikan dependency JavaScript sudah bersih memakai **NPM**. Jangan campur `npm` dan `pnpm` dalam project yang sama.

```powershell
cd C:\laragon\www\nama-project-laravel

npm install
npm run build
```

Jika build berhasil, Laravel Vite akan menghasilkan file seperti ini:

```text
public/build/manifest.json
public/build/assets/app-xxxxx.css
public/build/assets/app-xxxxx.js
```

::DocCallout{type="info" title="Kenapa bukan folder dist?"}
Project Laravel yang memakai Vite biasanya menghasilkan asset ke `public/build`, bukan `dist`. Error `No Output Directory named "dist"` muncul ketika Vercel masih mengira project ini adalah Vite frontend biasa.
::

## 2. Generate APP_KEY

Jalankan perintah berikut di lokal:

```powershell
php artisan key:generate --show
```

Simpan output yang berbentuk:

```text
base64:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Nanti value ini dipakai sebagai environment variable `APP_KEY` di Vercel.

## 3. Siapkan file `api/index.php`

Buat folder `api`, lalu buat file `api/index.php`.

```powershell
mkdir api
```

Isi file:

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}

foreach (['/tmp/views', '/tmp/cache'] as $directory) {
    if (! is_dir($directory)) {
        mkdir($directory, 0777, true);
    }
}

if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/../vendor/autoload.php';

/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
```

File ini menjadi entrypoint Laravel ketika request masuk ke Vercel Function.

## 4. Siapkan `vercel.json`

Buat file `vercel.json` di root project. Bagian pentingnya adalah:

- `buildCommand` memakai `npm run build`
- `outputDirectory` memakai `public`
- route asset diarahkan ke folder `public`
- semua route lain diarahkan ke `api/index.php`
- cache dan compiled Blade diarahkan ke `/tmp`

```json
{
  "version": 2,
  "framework": null,
  "installCommand": "npm ci",
  "buildCommand": "npm run build",
  "outputDirectory": "public",
  "functions": {
    "api/index.php": {
      "runtime": "vercel-php@0.6.2",
      "memory": 1024,
      "maxDuration": 60
    }
  },
  "routes": [
    {
      "src": "/(build|images|js|css|videos|lottie|fonts|storage)/(.*)",
      "dest": "/public/$1/$2"
    },
    {
      "src": "/(favicon.ico|robots.txt)",
      "dest": "/public/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/api/index.php"
    }
  ],
  "env": {
    "APP_ENV": "production",
    "APP_DEBUG": "false",
    "APP_CONFIG_CACHE": "/tmp/cache/config.php",
    "APP_EVENTS_CACHE": "/tmp/cache/events.php",
    "APP_PACKAGES_CACHE": "/tmp/cache/packages.php",
    "APP_ROUTES_CACHE": "/tmp/cache/routes.php",
    "APP_SERVICES_CACHE": "/tmp/cache/services.php",
    "LOG_CHANNEL": "stderr",
    "VIEW_COMPILED_PATH": "/tmp/views"
  }
}
```

::DocCallout{type="tip" title="Fix utama error Vercel"}
Jika build log Vercel menampilkan `No Output Directory named "dist" found`, tambahkan atau pastikan value ini ada di `vercel.json`:

```json
"outputDirectory": "public"
```
::

## 5. Siapkan `.vercelignore`

File `.vercelignore` mencegah file besar dan sensitif ikut terkirim ke Vercel.

```gitignore
.env
.env.backup
.env.local
.env.production

/node_modules
/vendor
/public/hot
/public/storage

/storage/*.key
/storage/app/private/*
/storage/framework/cache/*
/storage/framework/sessions/*
/storage/framework/testing/*
/storage/framework/views/*
/storage/logs/*

/database/*.sqlite
/database/*.sqlite*
/database/*.sql
/database/supabase_import.sql

/.git
/.fleet
/.idea
/.nova
/.vscode
/.zed

Dockerfile
docker/
```

::DocCallout{type="danger" title="Jangan commit secret"}
Jangan commit `.env`, database dump `.sql`, `supabase_import.sql`, password database, OAuth secret, atau key production ke GitHub.
::

## 6. Sesuaikan compiled Blade path

Karena Vercel Function hanya aman menulis file sementara ke `/tmp`, pastikan compiled Blade diarahkan ke path yang bisa ditulis.

Di `config/view.php`, pastikan bagian `compiled` membaca `VIEW_COMPILED_PATH`:

```php
'compiled' => env(
    'VIEW_COMPILED_PATH',
    realpath(storage_path('framework/views'))
),
```

Di `vercel.json`, kita sudah set:

```json
"VIEW_COMPILED_PATH": "/tmp/views"
```

## 7. Buat database di Supabase

Buat project baru di Supabase, lalu ambil connection string dari menu **Connect**.

Untuk tutorial ini, kita memakai **Session Pooler** dengan port `5432`.

Format connection string:

```text
postgresql://postgres.PROJECT_REF:PASSWORD@aws-REGION.pooler.supabase.com:5432/postgres
```

Contoh bentuknya:

```text
postgresql://postgres.xxxxxxxxxxxxxxxxxxxx:YOUR_PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

::DocCallout{type="info" title="Session Pooler vs Transaction Pooler"}
Tutorial ini memakai Session Pooler. Jika suatu saat memakai Transaction Pooler port `6543`, prepared statements harus dimatikan. Untuk Session Pooler port `5432`, `DB_EMULATE_PREPARES=false` masih aman.
::

## 8. Jalankan migration ke Supabase

Sebelum deploy Vercel, buat schema database dulu dari lokal.

Di PowerShell:

```powershell
$env:DB_CONNECTION="pgsql"
$env:DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-REGION.pooler.supabase.com:5432/postgres"
$env:DB_SSLMODE="require"
$env:DB_EMULATE_PREPARES="false"

php artisan migrate --force
```

Jika berhasil, output akan menampilkan daftar migration dengan status `DONE`.

Contoh:

```text
INFO  Preparing database.

Creating migration table ................................ DONE

INFO  Running migrations.

0001_01_01_000000_create_users_table ................... DONE
2025_03_31_193927_create_dealers_table ................. DONE
2025_04_12_163619_create_car_colors_table .............. DONE
```

::DocCallout{type="warning" title="Password authentication failed"}
Jika muncul `password authentication failed`, biasanya password di connection string masih placeholder `[YOUR-PASSWORD]`, password salah, atau karakter spesial password belum terbaca dengan benar.
::

## 9. Import data lama ke Supabase

Jika project memiliki dump lama, generate dulu file import yang sudah sesuai dengan schema Laravel:

```powershell
php scripts/prepare-supabase-import.php
```

Output:

```text
database/supabase_import.sql
```

Jangan import file `database/data.sql` secara langsung jika script sudah menyediakan file hasil transformasi. Gunakan file:

```text
database/supabase_import.sql
```

## 10. Jalankan import dengan `psql`

Jika `psql` tidak dikenali:

```powershell
where.exe psql
```

Cari juga di folder Laragon:

```powershell
Get-ChildItem -Path "C:\laragon" -Filter psql.exe -Recurse -ErrorAction SilentlyContinue | Select-Object FullName
```

Contoh hasil:

```text
C:\laragon\bin\postgresql\postgresql-14.5-1\bin\psql.exe
```

Jalankan import dengan format terpisah agar aman jika password memiliki karakter khusus:

```powershell
cd C:\laragon\www\nama-project-laravel

$env:PGPASSWORD="PASSWORD_SUPABASE_KAMU"
$env:PGSSLMODE="require"

& "C:\laragon\bin\postgresql\postgresql-14.5-1\bin\psql.exe" `
  -h "aws-REGION.pooler.supabase.com" `
  -p 5432 `
  -U "postgres.PROJECT_REF" `
  -d "postgres" `
  -f "database\supabase_import.sql"
```

Jika berhasil, biasanya output berisi banyak `COPY`, misalnya:

```text
COPY 3
COPY 12
COPY 45
```

Cek data di Supabase **Table Editor**, misalnya tabel:

- `users`
- `roles`
- `dealers`
- `customers`
- `cars`
- `car_colors`
- `orders`
- `payments`
- `brochures`
- `galleries`

::DocCallout{type="danger" title="Reset password jika pernah ter-paste"}
Jika password database pernah ter-paste di chat, terminal log publik, screenshot, atau repository, reset password database Supabase setelah import selesai.
::

## 11. Commit file deployment

Pastikan file berikut sudah ada:

```powershell
dir api\index.php
dir vercel.json
dir .vercelignore
```

Pastikan build lokal berhasil:

```powershell
npm run build
```

Cek status Git:

```powershell
git status --short
```

Commit dan push:

```powershell
git add .
git commit -m "Prepare Laravel deployment to Vercel"
git push origin master
```

Jika branch kamu `main`, gunakan:

```powershell
git push origin main
```

## 12. Buat project baru di Vercel

Di dashboard Vercel:

1. Klik **Add New Project**
2. Import repository GitHub
3. Pilih project Laravel
4. Atur build settings

Gunakan konfigurasi berikut:

| Field | Value |
| --- | --- |
| Project Name | `nama-project` |
| Framework Preset | `Other` |
| Root Directory | `./` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `public` |

::DocCallout{type="tip" title="Jangan pilih Vite murni"}
Vercel bisa otomatis mendeteksi project sebagai Vite karena ada `vite.config.js`. Untuk Laravel, gunakan `Other` dan pastikan output directory adalah `public`.
::

## 13. Isi Environment Variables di Vercel

Masuk ke:

```text
Vercel Project > Settings > Environment Variables
```

Isi minimal:

```env
APP_NAME=Nama Project
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:ISI_APP_KEY_KAMU
APP_URL=https://nama-project.vercel.app
ASSET_URL=https://nama-project.vercel.app
LOG_CHANNEL=stderr

DB_CONNECTION=pgsql
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-REGION.pooler.supabase.com:5432/postgres
DB_SSLMODE=require
DB_EMULATE_PREPARES=false

SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

CACHE_STORE=database
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=public

MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME=Nama Project
```

Kalau Google login dipakai:

```env
GOOGLE_CLIENT_ID=ISI_CLIENT_ID
GOOGLE_CLIENT_SECRET=ISI_CLIENT_SECRET
GOOGLE_REDIRECT_URI=https://nama-project.vercel.app/auth/google/callback
```

Setelah domain final berubah, update juga:

```env
APP_URL=https://DOMAIN_FINAL
ASSET_URL=https://DOMAIN_FINAL
GOOGLE_REDIRECT_URI=https://DOMAIN_FINAL/auth/google/callback
```

Lalu redeploy.

## 14. Deploy

Klik **Deploy** dari dashboard Vercel.

Jika deploy sukses, buka URL production:

```text
https://nama-project.vercel.app
```

Test halaman penting:

- `/`
- `/login`
- `/register`
- halaman fitur utama
- halaman dashboard
- fitur yang membaca data dari Supabase

## 15. Troubleshooting

### Error: No Output Directory named `dist`

Penyebab: Vercel masih memakai default output Vite.

Solusi:

```json
"outputDirectory": "public"
```

Atau dari dashboard Vercel:

```text
Output Directory = public
```

### Error: `psql` is not recognized

Penyebab: PostgreSQL client belum masuk PATH.

Solusi jika memakai Laragon:

```powershell
& "C:\laragon\bin\postgresql\postgresql-14.5-1\bin\psql.exe" --version
```

Jika berhasil, pakai path tersebut untuk import SQL.

### PowerShell `Unexpected token` saat menjalankan `psql.exe`

Penyebab: path `.exe` berada dalam tanda kutip tetapi tidak diawali call operator `&`.

Salah:

```powershell
"C:\laragon\bin\postgresql\postgresql-14.5-1\bin\psql.exe" ...
```

Benar:

```powershell
& "C:\laragon\bin\postgresql\postgresql-14.5-1\bin\psql.exe" ...
```

### Error: `password authentication failed`

Penyebab umum:

- masih memakai `[YOUR-PASSWORD]`
- password database salah
- password lama setelah reset Supabase
- connection string salah pooler
- karakter spesial dalam password tidak terbaca jika memakai URL penuh

Solusi aman:

```powershell
$env:PGPASSWORD="PASSWORD_SUPABASE_KAMU"
$env:PGSSLMODE="require"

& "C:\laragon\bin\postgresql\postgresql-14.5-1\bin\psql.exe" `
  -h "aws-REGION.pooler.supabase.com" `
  -p 5432 `
  -U "postgres.PROJECT_REF" `
  -d "postgres" `
  -f "database\supabase_import.sql"
```

### Warning Browserslist outdated

Jika muncul:

```text
Browserslist: browsers data is 14 months old
```

Itu warning, bukan error build. Build tetap aman jika `vite build` selesai dan menghasilkan file di `public/build`.

Jika ingin update:

```powershell
npx update-browserslist-db@latest
```

## 16. Catatan upload file

Vercel Function tidak cocok untuk penyimpanan file permanen di filesystem lokal. Bagian aplikasi yang biasanya terdampak:

- upload gambar produk atau konten
- logo brand atau profile
- dokumen user
- bukti pembayaran
- brochure PDF/image
- gallery image

Untuk production yang lebih aman, pindahkan upload file ke object storage, misalnya:

- Supabase Storage
- S3-compatible storage
- Cloudinary untuk gambar
- provider object storage lain

Lalu simpan URL file di database, bukan path lokal.

## 17. Ringkasan alur deploy

```text
1. Siapkan api/index.php
2. Siapkan vercel.json dengan outputDirectory public
3. Siapkan .vercelignore
4. Generate APP_KEY
5. Buat Supabase project
6. Jalankan migration dari lokal ke Supabase
7. Generate supabase_import.sql
8. Import data dengan psql
9. npm run build
10. Commit dan push ke GitHub
11. Buat project Vercel dengan preset Other
12. Isi Environment Variables
13. Deploy
14. Test halaman produksi
```

---

Dengan alur ini, project Laravel bisa berjalan di Vercel untuk kebutuhan demo/PBL, sementara database tetap dikelola oleh Supabase Postgres. Untuk production penuh, bagian file upload sebaiknya dipindahkan ke object storage agar tidak bergantung pada filesystem lokal Vercel.
