
// Mengambil form Tracking dari halaman HTML
document.getElementById("formTracking").addEventListener("submit", function(event) {

    // Mencegah halaman refresh ketika tombol Cari ditekan
    event.preventDefault();

    // Mengambil nomor DO yang dimasukkan pengguna
    const nomorDO = document.getElementById("nomorDO").value.trim();

    // Mengambil tempat untuk menampilkan hasil pencarian
    const hasil = document.getElementById("hasilTracking");

    // Menghapus hasil pencarian sebelumnya
    hasil.innerHTML = "";

    // Mencari data pengiriman berdasarkan nomor DO
    const pengiriman = dataTracking[nomorDO];

    // Memeriksa apakah nomor DO ditemukan
    if (pengiriman) {

        // Menampilkan judul hasil pencarian
        const judul = document.createElement("h2");
        judul.textContent = "Detail Pengiriman";
        hasil.appendChild(judul);

        // Menyiapkan informasi pengiriman
        const informasi = [
            ["Nomor DO", nomorDO],
            ["Nama Mahasiswa", pengiriman.nama],
            ["Status Pengiriman", pengiriman.status],
            ["Ekspedisi", pengiriman.ekspedisi],
            ["Tanggal Kirim", pengiriman.tanggalKirim],
            ["Kode Paket", pengiriman.paket],
            ["Total Pembayaran", pengiriman.total]
        ];

        // Menampilkan setiap informasi pengiriman
        informasi.forEach(function(item) {

            // Membuat paragraf baru
            const paragraf = document.createElement("p");

            // Memasukkan informasi ke dalam paragraf
            paragraf.textContent = item[0] + ": " + item[1];

            // Menambahkan paragraf ke halaman
            hasil.appendChild(paragraf);
        });

        // Menampilkan judul riwayat perjalanan
        const judulRiwayat = document.createElement("h3");
        judulRiwayat.textContent = "Riwayat Perjalanan";
        hasil.appendChild(judulRiwayat);

        // Membuat daftar riwayat perjalanan
        const daftar = document.createElement("ul");

        // Membaca setiap perjalanan dari data dosen
        pengiriman.perjalanan.forEach(function(tahap) {

            // Membuat baris daftar perjalanan
            const baris = document.createElement("li");

            // Menampilkan waktu dan keterangan perjalanan
            baris.textContent = tahap.waktu + " - " + tahap.keterangan;

            // Menambahkan baris ke daftar
            daftar.appendChild(baris);
        });

        // Menampilkan daftar perjalanan pada halaman
        hasil.appendChild(daftar);

    } else {

        // Menampilkan pesan jika nomor DO tidak ditemukan
        hasil.textContent = "Nomor Delivery Order tidak ditemukan.";
    }
});
