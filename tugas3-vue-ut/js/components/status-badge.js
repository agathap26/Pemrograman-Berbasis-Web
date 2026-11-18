Vue.component('status-badge', {
  template: '#tpl-badge',
  props: {
    qty: { type: Number, required: true },
    safety: { type: Number, required: true },
    catatanHtml: { type: String, default: '' }
  },
  data() {
    return { hovered: false };
  },
  computed: {
    safeNote() {
      // Ijinkan hanya tag sederhana yang ada pada dummy JSON; atribut dibuang.
      return String(this.catatanHtml || 'Tidak ada catatan')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/&lt;(\/?)(em|strong|u|i|b)&gt;/gi, '<$1$2>');
    }
  }
});
