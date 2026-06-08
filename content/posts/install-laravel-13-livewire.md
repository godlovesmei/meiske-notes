---
title: Cara Install Laravel 13 dengan Starter Kit Livewire di Linux
description: Panduan lengkap menginstall Laravel 13 di Linux menggunakan PHP 8.4, Composer, Node.js, dan starter kit Livewire dengan autentikasi siap pakai.
date: 2026-06-09
category: tutorial
tags:
  - laravel
  - php
  - livewire
  - linux
draft: false
---

Laravel adalah salah satu framework PHP yang banyak digunakan untuk membangun aplikasi web modern. Pada Laravel 13, kita bisa langsung menggunakan starter kit agar proses setup awal menjadi lebih cepat, terutama jika ingin menambahkan fitur autentikasi seperti login, register, dan dashboard.

Pada tutorial ini, kita akan menginstall Laravel 13 di Linux menggunakan PHP 8.4, Composer, Node.js, NPM, dan starter kit Livewire.

## 1. Cek Kebutuhan Awal

Sebelum menginstall Laravel, pastikan beberapa dependency utama sudah tersedia. Jalankan command berikut:

```bash
php -v
composer -V
node -v
npm -v
```

::DocCallout{type="info" title="Belum terinstall?"}
Jika PHP atau Composer belum terinstall, ikuti langkah 2–5 di bawah. Jika sudah tersedia semua, lompat langsung ke langkah 6.
::

## 2. Install Dependency Dasar

Jalankan command berikut untuk menginstall dependency dasar yang dibutuhkan:

```bash
sudo apt update
sudo apt install software-properties-common ca-certificates lsb-release apt-transport-https curl unzip git -y
```

Command di atas akan menginstall beberapa package penting seperti `curl`, `unzip`, dan `git` yang dibutuhkan saat proses instalasi Laravel.

## 3. Tambahkan Repository PHP

Karena kita akan menggunakan PHP 8.4, tambahkan repository PHP dari Ondřej Surý:

```bash
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
```

::DocCallout{type="tip" title="Mengapa repository ini?"}
Repository resmi Ubuntu hanya menyediakan PHP versi lama. Repository dari Ondřej Surý adalah sumber tepercaya yang selalu menyediakan versi PHP terbaru, termasuk PHP 8.4 dan seluruh extension-nya.
::

## 4. Install PHP 8.4 dan Extension Laravel

Setelah repository berhasil ditambahkan, install PHP 8.4 beserta extension yang umum digunakan oleh Laravel:

```bash
sudo apt install php8.4-cli php8.4-common php8.4-mbstring php8.4-xml php8.4-curl php8.4-zip php8.4-sqlite3 php8.4-mysql php8.4-bcmath php8.4-intl php8.4-gd -y
```

Setelah selesai, cek versi PHP:

```bash
php -v
```

Jika berhasil, terminal akan menampilkan versi PHP 8.4.

## 5. Install Composer

Composer adalah dependency manager untuk PHP. Install Composer menggunakan installer resmi:

```bash
cd ~
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
sudo mv composer.phar /usr/local/bin/composer
rm composer-setup.php
```

Setelah itu, reset cache command terminal:

```bash
hash -r
```

Lalu cek versi Composer:

```bash
composer -V
```

Jika berhasil, terminal akan menampilkan versi Composer yang sudah terinstall.

## 6. Install Laravel Installer

Setelah Composer berhasil terinstall, install Laravel Installer secara global:

```bash
composer global require laravel/installer
```

Agar command `laravel` bisa digunakan dari terminal, tambahkan Composer global bin ke PATH:

```bash
echo 'export PATH="$HOME/.config/composer/vendor/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Cek apakah Laravel Installer sudah terinstall:

```bash
laravel --version
```

## 7. Buat Project Laravel 13

Sekarang buat project Laravel baru:

```bash
laravel new my-app
```

Saat proses instalasi, Laravel akan menampilkan beberapa pilihan. Pilih starter kit:

```text
Livewire
```

Kemudian pilih database. Untuk development lokal, SQLite adalah pilihan yang paling sederhana:

```text
SQLite
```

::DocCallout{type="tip" title="SQLite untuk development"}
SQLite tidak membutuhkan server database terpisah — semua data tersimpan dalam satu file `.sqlite`. Ini pilihan tercepat untuk memulai development lokal.
::

Setelah proses selesai, masuk ke folder project:

```bash
cd my-app
```

## 8. Install Frontend Dependency

Laravel menggunakan Vite untuk frontend asset bundling. Install dependency frontend dengan NPM:

```bash
npm install
```

Lalu build asset:

```bash
npm run build
```

Untuk mode development dengan hot-reload, gunakan:

```bash
npm run dev
```

## 9. Jalankan Migration

Jalankan migration untuk membuat struktur tabel database:

```bash
php artisan migrate
```

::DocCallout{type="info" title="File database otomatis"}
Jika menggunakan SQLite, Laravel akan otomatis membuat file `database/database.sqlite` jika belum ada.
::

## 10. Jalankan Laravel

Untuk menjalankan project Laravel beserta queue worker dan Vite dev server sekaligus, gunakan:

```bash
composer run dev
```

Setelah server berjalan, buka browser dan akses:

```text
http://localhost:8000
```

Jika berhasil, aplikasi Laravel 13 dengan starter kit Livewire sudah bisa digunakan lengkap dengan halaman login, register, dan dashboard.

## Troubleshooting

### Composer Mengarah ke Lokasi Lama

Jika setelah menginstall Composer muncul error seperti ini:

```bash
-bash: /usr/bin/composer: No such file or directory
```

Jalankan:

```bash
hash -r
```

Lalu cek ulang:

```bash
composer -V
```

Error tersebut biasanya terjadi karena terminal masih mengingat lokasi binary Composer yang lama di cache.

### Permission Composer

Jika Composer belum bisa dijalankan, pastikan file Composer memiliki permission executable:

```bash
sudo chmod +x /usr/local/bin/composer
composer -V
```

::DocCallout{type="warning" title="Periksa PATH"}
Jika command `laravel` masih tidak dikenali setelah langkah 6, tutup terminal lalu buka kembali, atau jalankan `source ~/.bashrc` untuk memuat ulang konfigurasi PATH.
::

## Kesimpulan

Pada tutorial ini, kita sudah menginstall Laravel 13 di Linux menggunakan PHP 8.4, Composer, Node.js, NPM, dan starter kit Livewire. Dengan starter kit Livewire, kita bisa langsung mendapatkan struktur awal aplikasi Laravel yang sudah dilengkapi autentikasi dan frontend reactive berbasis PHP/Blade — tanpa perlu konfigurasi manual dari awal.
