Vue.component('do-tracking', {
  template: '#tpl-tracking',
  props: {
    orders: { type: Array, required: true },
    paketList: { type: Array, required: true },
    focusDo: { type: String, default: '' }
  },
  data() {
    return {
      searchField: 'nomorDO', query: '', submittedQuery: '',
      selectedDO: this.focusDo || (this.orders[0] && this.orders[0].nomorDO) || '',
      newProgress: '', progressError: '', newStatus: ''
    };
  },
  computed: {
    matchingOrders() {
      const query = this.submittedQuery.trim().toLowerCase();
      if (!query) return this.orders;
      return this.orders.filter(order => String(order[this.searchField] || '').toLowerCase().includes(query));
    },
    selectedOrder() {
      return this.orders.find(order => order.nomorDO === this.selectedDO) || null;
    },
    selectedMeta() {
      if (!this.selectedOrder) return {};
      return { NIM: this.selectedOrder.nim, Nama: this.selectedOrder.nama,
        Ekspedisi: this.selectedOrder.ekspedisi };
    }
  },
  watch: {
    // Pilihan DO mengikuti hasil pencarian.
    matchingOrders(matches) {
      if (!matches.some(o => o.nomorDO === this.selectedDO)) {
        this.selectedDO = matches.length ? matches[0].nomorDO : '';
      }
    },
    selectedDO() { this.newProgress = ''; this.progressError = ''; }
  },
  methods: {
    submitSearch() { this.submittedQuery = this.query; },
    clearSearch() { this.query = ''; this.submittedQuery = ''; this.progressError = ''; },
    packageName(code) {
      const selected = this.paketList.find(item => item.kode === code);
      return selected ? selected.nama : code;
    },
    addProgress() {
      const note = this.newProgress.trim();
      if (!this.selectedOrder) { this.progressError = 'Pilih nomor DO terlebih dahulu.'; return; }
      if (note.length < 3) { this.progressError = 'Keterangan perjalanan minimal 3 karakter.'; return; }
      this.$emit('add-progress', {
        nomorDO: this.selectedOrder.nomorDO,
        waktu: ApiService.localTimestamp(), keterangan: note
      });
      this.newProgress = '';
      this.progressError = '';
    },
    updateStatus(event) {
      if (this.selectedOrder) {
        this.$emit('update-status', { nomorDO: this.selectedOrder.nomorDO, status: event.target.value });
      }
    }
  }
});
