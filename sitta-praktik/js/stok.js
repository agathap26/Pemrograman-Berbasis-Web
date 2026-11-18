
// Mengambil elemen tabel stok dari HTML
const tabelStok = document.getElementById("tabelStok");

// Mengambil form untuk menambahkan bahan ajar
const formStok = document.getElementById("formStok");


// Fungsi untuk menampilkan seluruh data bahan ajar
function tampilkanStok() {

    // Mengosongkan tabel sebelum menampilkan data
    tabelStok.innerHTML = "";

    // Membaca setiap buku dari data dosen
    dataBahanAjar.forEach(function(buku) {

        // Membuat baris baru pada tabel
        const baris = document.createElement("tr");

        // Membuat kolom untuk gambar sampul buku
        const kolomCover = document.createElement("td");

        // Memeriksa apakah buku memiliki gambar
        if (buku.cover) {

            // Membuat elemen gambar
            const gambar = document.createElement("img");

            // Mengambil lokasi gambar dari data.js
            gambar.src = buku.cover;

            // Memberikan keterangan pada gambar
            gambar.alt = "Cover " + buku.namaBarang;

            // Mengatur lebar gambar
            gambar.width = 80;

            // Menambahkan gambar ke kolom
            kolomCover.appendChild(gambar);

        } else {

            // Menampilkan keterangan jika belum ada gambar
            kolomCover.textContent = "Belum ada gambar";
        }

        // Memasukkan kolom gambar ke baris tabel
        baris.appendChild(kolomCover);

        // Mengambil informasi bahan ajar
        const informasi = [
            buku.kodeLokasi,
            buku.kodeBarang,
            buku.namaBarang,
            buku.jenisBarang,
            buku.edisi,
            buku.stok
        ];

        // Membuat kolom untuk setiap informasi buku
        informasi.forEach(function(data) {

            // Membuat kolom tabel baru
            const kolom = document.createElement("td");

            // Mengisi kolom dengan informasi buku
            kolom.textContent = data;

            // Memasukkan kolom ke dalam baris
            baris.appendChild(kolom);
        });

        // Menambahkan baris ke tabel stok
        tabelStok.appendChild(baris);
    });
}


// Menjalankan fungsi ketika halaman dibuka
tampilkanStok();


// Mengatur fungsi form tambah bahan ajar
formStok.addEventListener("submit", function(event) {

    // Mencegah halaman refresh saat form dikirim
    event.preventDefault();

    // Mengambil data yang dimasukkan pengguna
    const kodeLokasi = document.getElementById("kodeLokasi").value.trim();
    const kodeBarang = document.getElementById("kodeBarang").value.trim();
    const namaBarang = document.getElementById("namaBarang").value.trim();
    const jenisBarang = document.getElementById("jenisBarang").value;
    const edisi = Number(document.getElementById("edisi").value);
    const stok = Number(document.getElementById("jumlahStok").value);

    // Memeriksa apakah kode barang sudah digunakan
    const sudahAda = dataBahanAjar.some(function(buku) {
        return buku.kodeBarang.toLowerCase() === kodeBarang.toLowerCase();
    });

    // Menampilkan peringatan jika kode barang duplikat
    if (sudahAda) {
        alert("Kode barang sudah terdaftar!");
        return;
    }

    // Memeriksa apakah edisi dan stok merupakan angka valid
    if (!Number.isInteger(edisi) || edisi < 1 ||
        !Number.isInteger(stok) || stok < 0) {

        alert("Edisi atau jumlah stok tidak valid!");
        return;
    }

    // Membuat objek data bahan ajar baru
    const bukuBaru = {
        kodeLokasi: kodeLokasi,
        kodeBarang: kodeBarang,
        namaBarang: namaBarang,
        jenisBarang: jenisBarang,
        edisi: edisi,
        stok: stok,
        cover: ""
    };

    // Menambahkan buku baru ke data bahan ajar
    dataBahanAjar.push(bukuBaru);

    // Memperbarui tampilan tabel menggunakan DOM
    tampilkanStok();

    // Menampilkan pesan jika data berhasil ditambahkan
    alert("Data bahan ajar berhasil ditambahkan!");

    // Mengosongkan form setelah berhasil ditambahkan
    formStok.reset();
});
