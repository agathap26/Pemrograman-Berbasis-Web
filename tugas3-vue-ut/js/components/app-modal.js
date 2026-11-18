Vue.component('app-modal', {
  template: '#tpl-modal',
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: 'Konfirmasi' },
    message: { type: String, default: '' }
  },
  methods: {
    cancel() { this.$emit('cancel'); },
    confirm() { this.$emit('confirm'); }
  }
});
