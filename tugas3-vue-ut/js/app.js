// Filter global Vue 2: penggantian format untuk angka, satuan, dan tanggal.
Vue.filter('rupiah', value => 'Rp ' + Number(value || 0).toLocaleString('id-ID'));
Vue.filter('buah', value => Number(value || 0).toLocaleString('id-ID') + ' buah');
Vue.filter('tanggalIndonesia', value => {
  if (!value) return '-';
  const parts = String(value).slice(0, 10).split('-');
  if (parts.length !== 3) return value;
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
});
Vue.filter('waktuIndonesia', value => String(value || '-'));

(async function bootApp() {
  try {
    if (typeof Vue === 'undefined') throw new Error('Vue.js gagal dimuat. Periksa koneksi internet.');
    await ApiService.loadTemplates();
    const initial = await ApiService.getData();
    const saved = ApiService.getSaved();
    const state = {
      ...initial,
      stok: saved && Array.isArray(saved.stok) ? saved.stok : initial.stok,
      tracking: saved && Array.isArray(saved.tracking) ? saved.tracking : initial.tracking
    };

    window.sittaApp = new Vue({
      el: '#app',
      data: { tab: 'stok', state, notice: '', lastCreatedDO: '' },
      watch: {
        // Dua watcher root ini juga menunjukkan pemantauan perubahan array secara deep.
        'state.stok': { deep: true, handler() { ApiService.save(this.state); } },
        'state.tracking': { deep: true, handler() { ApiService.save(this.state); } }
      },
      methods: {
        handleSaveStock(payload) {
          const oldCode = payload.oldCode;
          if (oldCode !== null) {
            const index = this.state.stok.findIndex(item => item.kode === oldCode);
            if (index >= 0) this.$set(this.state.stok, index, payload.item);
            this.notice = 'Data stok ' + payload.item.kode + ' berhasil diperbarui.';
          } else {
            this.state.stok.push(payload.item);
            this.notice = 'Bahan ajar ' + payload.item.kode + ' berhasil ditambahkan.';
          }
        },
        handleDeleteStock(code) {
          const index = this.state.stok.findIndex(item => item.kode === code);
          if (index >= 0) this.state.stok.splice(index, 1);
          this.notice = 'Bahan ajar ' + code + ' berhasil dihapus.';
        },
        handleCreateOrder(order) {
          this.state.tracking.push(order);
          this.lastCreatedDO = order.nomorDO;
          this.tab = 'tracking';
          this.notice = 'DO baru ' + order.nomorDO + ' berhasil dibuat.';
        },
        handleAddProgress(payload) {
          const order = this.state.tracking.find(item => item.nomorDO === payload.nomorDO);
          if (!order) return;
          order.perjalanan.push({ waktu: payload.waktu, keterangan: payload.keterangan });
          if (order.status === 'Diproses') order.status = 'Dalam Perjalanan';
          this.notice = 'Progress pengiriman untuk ' + payload.nomorDO + ' berhasil ditambahkan.';
        },
        handleUpdateStatus(payload) {
          const order = this.state.tracking.find(item => item.nomorDO === payload.nomorDO);
          if (!order) return;
          this.$set(order, 'status', payload.status);
          this.notice = 'Status ' + payload.nomorDO + ' diperbarui menjadi ' + payload.status + '.';
        },
        async resetDemo() {
          if (!window.confirm('Kembalikan stok dan tracking ke data JSON awal? Semua perubahan demo akan hilang.')) return;
          ApiService.clearSaved();
          const fresh = await ApiService.getData();
          this.state.stok = fresh.stok;
          this.state.tracking = fresh.tracking;
          this.tab = 'stok';
          this.lastCreatedDO = '';
          this.notice = 'Data awal dari JSON telah dipulihkan.';
        }
      }
    });
  } catch (error) {
    const box = document.getElementById('boot-error');
    box.hidden = false;
    box.textContent = 'Aplikasi gagal dijalankan: ' + error.message + ' Buka index.html dengan Live Server.';
    console.error(error);
  }
})();
