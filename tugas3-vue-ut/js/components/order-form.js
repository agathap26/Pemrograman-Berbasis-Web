Vue.component('order-form', {
  template: '#tpl-order',
  props: {
    orders: { type: Array, required: true },
    paketList: { type: Array, required: true },
    stokList: { type: Array, required: true },
    pengirimanList: { type: Array, required: true }
  },
  data() {
    return { form: { nim: '', nama: '', ekspedisiKode: '', paket: '', tanggalKirim: ApiService.localDate() },
      formError: '' };
  },
  computed: {
    generatedDO() { return ApiService.nextDO(this.orders); },
    selectedPackage() {
      return this.paketList.find(item => item.kode === this.form.paket) || null;
    },
    packageDetails() {
      if (!this.selectedPackage) return [];
      return this.selectedPackage.isi.map(code => {
        const item = this.stokList.find(stock => stock.kode === code);
        return { kode: code, judul: item ? item.judul : 'Judul tidak ada di stok' };
      });
    },
    totalPrice() { return this.selectedPackage ? Number(this.selectedPackage.harga) : 0; }
  },
  watch: {
    'form.paket'() { this.formError = ''; }
  },
  methods: {
    expeditionLabel(service) {
      return service.kode === 'REG' ? 'JNE Regular' :
        service.kode === 'EXP' ? 'JNE Express' : service.nama;
    },
    submitOrder() {
      const nim = this.form.nim.trim();
      const nama = this.form.nama.trim();
      if (!/^\d{8,12}$/.test(nim)) {
        this.formError = 'NIM harus terdiri dari 8 sampai 12 angka.'; return;
      }
      if (nama.length < 3) {
        this.formError = 'Nama minimal 3 karakter.'; return;
      }
      const service = this.pengirimanList.find(item => item.kode === this.form.ekspedisiKode);
      if (!service || !this.selectedPackage || !/^\d{4}-\d{2}-\d{2}$/.test(this.form.tanggalKirim)) {
        this.formError = 'Pilih ekspedisi dan paket, serta isi tanggal kirim.'; return;
      }
      const parsed = new Date(this.form.tanggalKirim + 'T12:00:00');
      if (Number.isNaN(parsed.getTime()) ||
          [parsed.getFullYear(), String(parsed.getMonth()+1).padStart(2,'0'), String(parsed.getDate()).padStart(2,'0')].join('-') !== this.form.tanggalKirim) {
        this.formError = 'Tanggal kirim tidak valid.'; return;
      }
      const nomorDO = this.generatedDO;
      const order = {
        nomorDO, nim, nama, status: 'Diproses',
        ekspedisi: this.expeditionLabel(service),
        tanggalKirim: this.form.tanggalKirim,
        paket: this.selectedPackage.kode, total: this.totalPrice,
        perjalanan: [{ waktu: ApiService.localTimestamp(), keterangan: 'Pesanan dibuat di SITTA UT' }]
      };
      this.$emit('created', order);
      this.form = { nim: '', nama: '', ekspedisiKode: '', paket: '', tanggalKirim: ApiService.localDate() };
      this.formError = '';
    }
  }
});
