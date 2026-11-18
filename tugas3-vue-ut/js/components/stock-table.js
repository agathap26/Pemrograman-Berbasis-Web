Vue.component('ba-stock-table', {
  template: '#tpl-stock',
  props: {
    items: { type: Array, required: true },
    upbjjList: { type: Array, required: true },
    kategoriList: { type: Array, required: true }
  },
  data() {
    return {
      search: '', area: '', kategori: '', onlyNeed: false, sortBy: 'judul',
      showEditor: false, editingCode: null, pendingDelete: null,
      formError: '', form: this.blankForm()
    };
  },
  computed: {
    areaCategories() {
      if (!this.area) return [];
      return this.kategoriList.filter(category => this.items.some(item =>
        item.upbjj === this.area && item.kategori === category));
    },
    filteredItems() {
      // computed meng-cache hasil dan hanya menghitung ulang jika dependensi berubah.
      const query = this.search.toLowerCase().trim();
      const result = this.items.filter(item => {
        const matchesText = !query ||
          [item.kode, item.judul, item.lokasiRak].some(value =>
            String(value || '').toLowerCase().includes(query));
        return matchesText &&
          (!this.area || item.upbjj === this.area) &&
          (!this.kategori || item.kategori === this.kategori) &&
          (!this.onlyNeed || item.qty === 0 || item.qty < item.safety);
      });
      return result.slice().sort((a, b) => {
        switch (this.sortBy) {
          case 'qty-asc': return a.qty - b.qty;
          case 'qty-desc': return b.qty - a.qty;
          case 'harga-asc': return a.harga - b.harga;
          case 'harga-desc': return b.harga - a.harga;
          default: return a.judul.localeCompare(b.judul, 'id');
        }
      });
    },
    countSafe() { return this.items.filter(item => item.qty > 0 && item.qty >= item.safety).length; },
    countLow() { return this.items.filter(item => item.qty > 0 && item.qty < item.safety).length; },
    countEmpty() { return this.items.filter(item => item.qty === 0).length; }
  },
  watch: {
    // Watcher #1: pilihan kategori di-reset saat UT-Daerah berganti.
    area() { this.kategori = ''; },
    // Watcher #2: pesan validasi dikosongkan saat editor ditutup.
    showEditor(open) { if (!open) this.formError = ''; }
  },
  methods: {
    blankForm() {
      return { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '',
        harga: 0, qty: 0, safety: 0, catatanHTML: '' };
    },
    resetFilters() {
      this.search = ''; this.area = ''; this.kategori = '';
      this.onlyNeed = false; this.sortBy = 'judul';
    },
    newItem() {
      this.editingCode = null;
      this.form = this.blankForm();
      this.formError = '';
      this.showEditor = true;
      this.$nextTick(() => this.$refs.codeInput && this.$refs.codeInput.focus());
    },
    editItem(item) {
      this.editingCode = item.kode;
      this.form = { ...item };
      this.formError = '';
      this.showEditor = true;
      this.$nextTick(() => this.$refs.titleInput && this.$refs.titleInput.focus());
    },
    closeEditor() { this.showEditor = false; },
    saveItem() {
      const item = {
        ...this.form, kode: String(this.form.kode).trim().toUpperCase(),
        judul: String(this.form.judul).trim(),
        lokasiRak: String(this.form.lokasiRak).trim(),
        harga: Number(this.form.harga), qty: Number(this.form.qty), safety: Number(this.form.safety),
        catatanHTML: String(this.form.catatanHTML || '').trim()
      };
      const numbers = ['harga', 'qty', 'safety'];
      if (!item.kode || !item.judul || !item.kategori || !item.upbjj || !item.lokasiRak) {
        this.formError = 'Kode, judul, kategori, UT-Daerah, dan lokasi rak wajib diisi.';
        return;
      }
      if (numbers.some(key => !Number.isFinite(item[key]) || item[key] < 0) ||
          !Number.isInteger(item.qty) || !Number.isInteger(item.safety)) {
        this.formError = 'Harga harus angka tidak negatif; qty dan safety harus bilangan bulat tidak negatif.';
        return;
      }
      if (!this.editingCode && this.items.some(existing => existing.kode === item.kode)) {
        this.formError = 'Kode mata kuliah sudah terdaftar. Gunakan kode lain.';
        return;
      }
      this.$emit('save-item', { item, oldCode: this.editingCode });
      this.closeEditor();
    },
    confirmDelete(item) { this.pendingDelete = item; },
    performDelete() {
      if (this.pendingDelete) {
        this.$emit('delete-item', this.pendingDelete.kode);
        if (this.editingCode === this.pendingDelete.kode) this.closeEditor();
      }
      this.pendingDelete = null;
    }
  }
});
