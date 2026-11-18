
// Aplikasi Vue.js untuk halaman Stok Bahan Ajar

new Vue({
    el: "#app",

    data: {
        // Mengambil data dari dataBahanAjar.js
        upbjjList: [...window.dataBahanAjar.upbjjList],
        kategoriList: [...window.dataBahanAjar.kategoriList],

        stok: window.dataBahanAjar.stok.map(
            buku => ({ ...buku })
        ),

        // Variabel filter
        filterUpbjj: "",
        filterKategori: "",
        filterReorder: false,
        sortBy: "judul",

        // Variabel untuk formulir
        modeEdit: false,
        pesan: "",

        formBuku: {
            kode: "",
            judul: "",
            kategori: "",
            upbjj: "",
            lokasiRak: "",
            harga: 0,
            qty: 0,
            safety: 0,
            catatanHTML: ""
        }
    },

    computed: {

        // Menampilkan kategori sesuai daerah yang dipilih
        kategoriTersedia() {
            return this.kategoriList.filter(kategori =>
                this.stok.some(buku =>
                    buku.upbjj === this.filterUpbjj &&
                    buku.kategori === kategori
                )
            );
        },

        // Filter dan pengurutan stok
        stokTersaring() {
            const hasil = this.stok.filter(buku => {

                const cocokDaerah =
                    !this.filterUpbjj ||
                    buku.upbjj === this.filterUpbjj;

                const cocokKategori =
                    !this.filterKategori ||
                    buku.kategori === this.filterKategori;

                const perluReorder =
                    !this.filterReorder ||
                    buku.qty < buku.safety ||
                    buku.qty === 0;

                return cocokDaerah &&
                       cocokKategori &&
                       perluReorder;
            });

            return hasil.sort((a, b) =>
                this.sortBy === "judul"
                    ? a.judul.localeCompare(b.judul)
                    : a[this.sortBy] - b[this.sortBy]
            );
        }
    },

    watch: {

        // Watcher 1: memantau perubahan UT Daerah
        filterUpbjj() {
            this.filterKategori = "";
        },

        // Watcher 2: memantau perubahan filter reorder
        filterReorder(aktif) {
            if (aktif) {
                this.sortBy = "qty";
            }
        }
    },

    methods: {

        // Mengubah harga ke format rupiah
        rupiah(angka) {
            return "Rp " +
                Number(angka).toLocaleString("id-ID");
        },

        // Menentukan warna status stok
        kelasStatus(buku) {
            if (buku.qty === 0) {
                return "kosong";
            }

            if (buku.qty < buku.safety) {
                return "menipis";
            }

            return "aman";
        },

        // Reset semua filter
        resetFilter() {
            this.filterUpbjj = "";
            this.filterKategori = "";
            this.filterReorder = false;
            this.sortBy = "judul";
        },

        // Mengambil data yang akan diedit
        editStok(buku) {
            this.modeEdit = true;
            this.formBuku = { ...buku };
            this.pesan = "";
        },

        // Menyimpan bahan ajar baru atau hasil edit
        simpanBuku() {
            const buku = { ...this.formBuku };

            buku.kode = String(buku.kode)
                .trim().toUpperCase();

            buku.judul = String(buku.judul).trim();

            buku.lokasiRak = String(buku.lokasiRak).trim();

            buku.catatanHTML =
                String(buku.catatanHTML || "").trim();

            // Validasi kolom wajib
            if (!buku.kode ||
                !buku.judul ||
                !buku.kategori ||
                !buku.upbjj ||
                !buku.lokasiRak) {

                alert("Lengkapi seluruh kolom wajib.");
                return;
            }

            // Validasi harga, stok, dan safety
            const angkaValid = [
                buku.harga,
                buku.qty,
                buku.safety
            ].every(nilai =>
                Number.isInteger(nilai) && nilai >= 0
            );

            if (!angkaValid) {
                alert(
                    "Harga, stok, dan safety stock harus bilangan bulat minimal 0."
                );
                return;
            }

            const index = this.stok.findIndex(
                item => item.kode === buku.kode
            );

            // Jika sedang melakukan edit
            if (this.modeEdit) {

                if (index === -1) {
                    alert("Data yang diedit tidak ditemukan.");
                    return;
                }

                this.stok.splice(index, 1, buku);

                this.pesan =
                    "Data " + buku.kode + " berhasil diperbarui.";

            } else {

                // Mencegah kode mata kuliah yang sama
                if (index !== -1) {
                    alert("Kode mata kuliah sudah digunakan.");
                    return;
                }

                this.stok.push(buku);

                this.pesan =
                    "Data " + buku.kode + " berhasil ditambahkan.";
            }

            this.batalEdit(false);
        },

        // Mengosongkan formulir
        batalEdit(hapusPesan = true) {
            this.modeEdit = false;

            this.formBuku = {
                kode: "",
                judul: "",
                kategori: "",
                upbjj: "",
                lokasiRak: "",
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ""
            };

            if (hapusPesan) {
                this.pesan = "";
            }
        }
    }
});
