
// Aplikasi Vue.js untuk Tracking Delivery Order

new Vue({
    el: "#app",

    data: {
        // Data dari file dataBahanAjar.js
        pengirimanList: [
            ...window.dataBahanAjar.pengirimanList
        ],

        paket: window.dataBahanAjar.paket.map(
            item => ({ ...item })
        ),

        daftarBuku: window.dataBahanAjar.stok.map(
            item => ({ ...item })
        ),

        tracking: JSON.parse(
            JSON.stringify(window.dataBahanAjar.tracking)
        ),

        // Variabel pencarian
        nomorCari: "DO2025-0001",
        hasilDO: null,
        pesanCari: "",
        pesanForm: "",

        // Data formulir baru
        formDO: {
            nim: "",
            nama: "",
            pengiriman: "",
            paket: "",
            tanggalKirim: ""
        }
    },

    computed: {

        // Mendapatkan paket yang dipilih pengguna
        paketTerpilih() {
            return this.paket.find(
                item => item.kode === this.formDO.paket
            ) || null;
        },

        // Mengambil harga otomatis dari paket
        totalHarga() {
            return this.paketTerpilih
                ? this.paketTerpilih.harga
                : 0;
        }
    },

    methods: {

        // Mengubah angka menjadi rupiah
        rupiah(angka) {
            return "Rp " +
                Number(angka).toLocaleString("id-ID");
        },

        // Mendapatkan nama mata kuliah dari kode
        namaMataKuliah(kode) {
            const buku = this.daftarBuku.find(
                item => item.kode === kode
            );

            return buku
                ? buku.judul
                : "Tidak ditemukan";
        },

        // Mengambil tanggal sesuai waktu lokal
        tanggalHariIni() {
            const tanggal = new Date();

            const tahun = tanggal.getFullYear();

            const bulan = String(
                tanggal.getMonth() + 1
            ).padStart(2, "0");

            const hari = String(
                tanggal.getDate()
            ).padStart(2, "0");

            return `${tahun}-${bulan}-${hari}`;
        },

        // Mencari data berdasarkan nomor DO
        cariDO() {
            const nomor = this.nomorCari
                .trim().toUpperCase();

            const data = this.tracking[nomor];

            if (data) {

                this.hasilDO = {
                    nomor,
                    ...data
                };

                this.pesanCari = "";

            } else {

                this.hasilDO = null;
                this.pesanCari =
                    "Nomor DO tidak ditemukan.";
            }
        },

        // Membuat nomor DO otomatis
        nomorDOBaru() {
            const awalan =
                `DO${new Date().getFullYear()}-`;

            const urutan = Object.keys(this.tracking)
                .filter(nomor =>
                    nomor.startsWith(awalan)
                )
                .map(nomor =>
                    Number(nomor.slice(awalan.length))
                )
                .filter(nomor =>
                    Number.isInteger(nomor)
                );

            const berikutnya =
                Math.max(0, ...urutan) + 1;

            return awalan +
                String(berikutnya).padStart(3, "0");
        },

        // Menyimpan Delivery Order baru
        buatDO() {
            const form = this.formDO;

            // Validasi NIM dan nama
            if (!/^\d+$/.test(form.nim) ||
                !form.nama.trim()) {

                alert(
                    "NIM harus angka dan nama tidak boleh kosong."
                );
                return;
            }

            const layanan = this.pengirimanList.find(
                item => item.kode === form.pengiriman
            );

            // Validasi ekspedisi, paket, dan tanggal
            if (!layanan ||
                !this.paketTerpilih ||
                !form.tanggalKirim) {

                alert(
                    "Lengkapi ekspedisi, paket, dan tanggal kirim."
                );
                return;
            }

            // Membuat nomor DO berdasarkan tahun
            const nomor = this.nomorDOBaru();

            // Menyusun data DO yang baru
            const dataBaru = {
                nim: form.nim,
                nama: form.nama.trim(),
                status: "Pesanan Dibuat",
                ekspedisi: "JNE " + layanan.nama,
                tanggalKirim: form.tanggalKirim,
                paket: form.paket,
                total: this.totalHarga,

                perjalanan: [
                    {
                        waktu: new Date()
                            .toLocaleString("id-ID"),
                        keterangan:
                            "Pesanan berhasil dibuat"
                    }
                ]
            };

            // Menyimpan data baru pada Vue
            this.$set(
                this.tracking,
                nomor,
                dataBaru
            );

            // Menampilkan DO setelah disimpan
            this.nomorCari = nomor;
            this.cariDO();

            this.pesanForm =
                "Berhasil membuat DO baru: " + nomor;

            // Reset formulir
            this.formDO = {
                nim: "",
                nama: "",
                pengiriman: "",
                paket: "",
                tanggalKirim: this.tanggalHariIni()
            };
        }
    },

    // Menampilkan tanggal otomatis ketika halaman dibuka
    mounted() {
        this.formDO.tanggalKirim =
            this.tanggalHariIni();
    }
});
