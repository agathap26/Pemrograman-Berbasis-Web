
// Mengambil informasi jam saat ini dari komputer
const jam = new Date().getHours();

// Menyiapkan variabel untuk ucapan salam
let salam = "";

// Menentukan salam berdasarkan waktu
if (jam >= 5 && jam < 11) {
    salam = "Selamat Pagi";
} else if (jam >= 11 && jam < 15) {
    salam = "Selamat Siang";
} else if (jam >= 15 && jam < 18) {
    salam = "Selamat Sore";
} else {
    salam = "Selamat Malam";
}

// Menampilkan salam pada dashboard
document.getElementById("salam").textContent = salam;


// Mengambil nama pengguna yang disimpan saat Login
const nama = sessionStorage.getItem("namaPengguna");

// Memeriksa apakah pengguna sudah Login
if (nama) {

    // Menampilkan nama pengguna
    document.getElementById("namaPengguna").textContent =
        "Halo, " + nama + "!";

} else {

    // Mengarahkan pengguna ke Login jika belum masuk
    window.location.href = "index.html";
}


// Mengambil tempat untuk menampilkan laporan
const hasil = document.getElementById("hasilMenu");


// Fungsi untuk membuat tabel menggunakan JavaScript DOM
function buatTabel(judulKolom, dataBaris) {

    // Membuat elemen tabel
    const tabel = document.createElement("table");

    // Membuat bagian kepala tabel
    const thead = document.createElement("thead");
    const barisJudul = document.createElement("tr");

    // Membuat judul setiap kolom
    judulKolom.forEach(function(judul) {
        const th = document.createElement("th");
        th.textContent = judul;
        barisJudul.appendChild(th);
    });

    thead.appendChild(barisJudul);
    tabel.appendChild(thead);

    // Membuat bagian isi tabel
    const tbody = document.createElement("tbody");

    // Menampilkan setiap baris data
    dataBaris.forEach(function(data) {
        const tr = document.createElement("tr");

        data.forEach(function(nilai) {
            const td = document.createElement("td");
            td.textContent = nilai;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    // Menambahkan isi tabel
    tabel.appendChild(tbody);

    // Menampilkan tabel pada dashboard
    hasil.appendChild(tabel);
}


// Fungsi untuk menampilkan judul laporan
function tampilkanJudul(judul) {

    // Menghapus tampilan laporan sebelumnya
    hasil.innerHTML = "";

    // Membuat elemen judul
    const h3 = document.createElement("h3");
    h3.textContent = judul;

    // Menampilkan judul pada dashboard
    hasil.appendChild(h3);
}


// Mengatur pilihan menu Laporan
document.getElementById("menuLaporan").addEventListener("change", function() {

    // Mengambil pilihan menu dari pengguna
    const pilihan = this.value;

    if (pilihan === "monitoring") {

        // Menampilkan laporan monitoring pengiriman
        tampilkanJudul("Monitoring Progress DO Bahan Ajar");

        // Mengambil data pengiriman dari data.js
        const data = Object.keys(dataTracking).map(function(nomorDO) {
            const pengiriman = dataTracking[nomorDO];

            return [
                nomorDO,
                pengiriman.nama,
                pengiriman.status,
                pengiriman.ekspedisi,
                pengiriman.tanggalKirim
            ];
        });

        // Membuat tabel monitoring DO
        buatTabel(
            ["Nomor DO", "Nama", "Status", "Ekspedisi", "Tanggal Kirim"],
            data
        );

    } else if (pilihan === "rekap") {

        // Menampilkan laporan rekap bahan ajar
        tampilkanJudul("Rekap Bahan Ajar");

        // Mengambil data buku dari data.js
        const data = dataBahanAjar.map(function(buku) {
            return [
                buku.kodeBarang,
                buku.namaBarang,
                buku.edisi,
                buku.stok
            ];
        });

        // Membuat tabel rekap bahan ajar
        buatTabel(
            ["Kode Barang", "Nama Barang", "Edisi", "Stok"],
            data
        );

    } else {

        // Mengosongkan laporan jika tidak ada pilihan
        hasil.innerHTML = "";
    }
});


// Mengatur tombol Histori Transaksi
document.getElementById("btnHistori").addEventListener("click", function() {

    // Menampilkan judul histori transaksi
    tampilkanJudul("Histori Transaksi Bahan Ajar");

    // Mengambil data transaksi dari data.js
    const data = Object.keys(dataTracking).map(function(nomorDO) {
        const transaksi = dataTracking[nomorDO];

        return [
            nomorDO,
            transaksi.nama,
            transaksi.paket,
            transaksi.total,
            transaksi.status
        ];
    });

    // Menampilkan tabel histori transaksi
    buatTabel(
        ["Nomor DO", "Nama", "Kode Paket", "Total", "Status"],
        data
    );
});


// Mengatur tombol Logout
document.getElementById("logout").addEventListener("click", function() {

    // Menghapus nama pengguna dari penyimpanan sesi
    sessionStorage.removeItem("namaPengguna");
});
