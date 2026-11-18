// Semua akses data ditempatkan pada satu service.
// Jalankan memakai Live Server karena fetch() tidak berjalan stabil lewat file://.
window.ApiService = {
  storageKey: 'sitta-ut-tugas3-v1',

  async getData() {
    const response = await fetch('data/dataBahanAjar.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Data JSON gagal dibaca (HTTP ' + response.status + ').');
    const data = await response.json();

    // File soal memuat nomor DO2025-0001 dua kali. Hapus duplikat pada tampilan.
    const unique = new Set();
    const normalized = [];
    (data.tracking || []).forEach(record => {
      Object.keys(record).forEach(nomorDO => {
        if (!unique.has(nomorDO)) {
          unique.add(nomorDO);
          normalized.push({ nomorDO: nomorDO, ...record[nomorDO] });
        }
      });
    });
    return { ...data, stok: data.stok || [], tracking: normalized };
  },

  async loadTemplates() {
    const names = ['stock-table', 'do-tracking', 'order-form', 'status-badge', 'app-modal'];
    const htmlParts = await Promise.all(names.map(async name => {
      const response = await fetch('templates/' + name + '.html', { cache: 'no-store' });
      if (!response.ok) throw new Error('Template ' + name + ' tidak ditemukan.');
      return await response.text();
    }));
    // Setiap berkas HTML berisi <script type="text/x-template" id="tpl-...">.
    const holder = document.createElement('div');
    holder.id = 'vue-template-storage';
    holder.style.display = 'none';
    holder.innerHTML = htmlParts.join('\n');
    document.body.appendChild(holder);
  },

  getSaved() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn('Tidak dapat membaca localStorage.', error);
      return null;
    }
  },

  save(state) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({ stok: state.stok, tracking: state.tracking }));
    } catch (error) {
      console.warn('Tidak dapat menyimpan ke localStorage.', error);
    }
  },

  clearSaved() {
    localStorage.removeItem(this.storageKey);
  },

  localDate() {
    const date = new Date();
    const pad = n => String(n).padStart(2, '0');
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  },

  localTimestamp() {
    const date = new Date();
    const pad = n => String(n).padStart(2, '0');
    return this.localDate() + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  },

  nextDO(orders) {
    const year = String(new Date().getFullYear());
    const maxSequence = orders.reduce((max, order) => {
      const match = /^DO(\d{4})-(\d+)$/.exec(order.nomorDO || '');
      return match && match[1] === year ? Math.max(max, Number(match[2])) : max;
    }, 0);
    // Empat digit dipilih agar konsisten dengan DO2025-0001 pada JSON asli.
    return 'DO' + year + '-' + String(maxSequence + 1).padStart(4, '0');
  }
};
