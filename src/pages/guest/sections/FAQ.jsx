import { useState } from 'react';
import { SectionHeading } from '../../shared/utils';

const FAQ_DATA = [
  { q: 'Bagaimana cara melakukan pemesanan?', a: 'Pilih produk yang diinginkan, tambahkan ke keranjang, lalu lanjutkan ke proses checkout dan lakukan pembayaran sesuai metode yang tersedia.' },
  { q: 'Metode pembayaran apa saja yang tersedia?', a: 'Kami menerima pembayaran melalui:\n\u2022 Transfer bank\n\u2022 E-wallet (OVO, GoPay, DANA, ShopeePay)\n\u2022 QRIS\n\u2022 Kartu debit/kredit' },
  { q: 'Berapa lama proses pengiriman?', a: 'Pesanan diproses dalam waktu 1\u20132 hari kerja setelah pembayaran dikonfirmasi. Estimasi pengiriman bergantung pada lokasi tujuan dan jasa ekspedisi yang dipilih.' },
  { q: 'Apakah saya bisa menukar atau mengembalikan barang?', a: 'Ya. Penukaran dapat dilakukan maksimal 3 hari setelah barang diterima dengan syarat:\n\u2022 Produk belum digunakan\n\u2022 Label dan kemasan masih lengkap\n\u2022 Tidak ada kerusakan akibat penggunaan' },
  { q: 'Bagaimana jika ukuran pakaian tidak sesuai?', a: 'Kami menyediakan panduan ukuran pada setiap produk. Jika ukuran tidak sesuai, pelanggan dapat mengajukan penukaran sesuai kebijakan toko.' },
  { q: 'Apakah produk yang ditampilkan sesuai dengan foto?', a: 'Kami berusaha menampilkan foto produk seakurat mungkin. Namun, perbedaan warna dapat terjadi karena pencahayaan atau pengaturan layar perangkat masing-masing.' },
  { q: 'Bagaimana cara menjadi member Ris.Style?', a: 'Pelanggan akan otomatis menjadi Bronze Member setelah mendaftar akun dan melakukan pembelian pertama. Poin akan terkumpul dari setiap transaksi untuk meningkatkan level keanggotaan.' },
  { q: 'Bagaimana sistem poin member bekerja?', a: 'Setiap pembelian Rp10.000 akan mendapatkan 1 poin. Poin dapat digunakan untuk naik tingkat member dan ditukarkan dengan berbagai keuntungan eksklusif.' },
  { q: 'Apakah ada diskon khusus untuk member?', a: 'Ya. Setiap tingkat member memperoleh keuntungan yang berbeda:\n\u2022 Bronze: Promo khusus member\n\u2022 Silver: Diskon 5%\n\u2022 Gold: Diskon 10% dan akses prioritas' },
  { q: 'Bagaimana cara menghubungi customer service?', a: 'Anda dapat menghubungi kami melalui:\n\u2022 WhatsApp: +62 xxx-xxxx-xxxx\n\u2022 Instagram: @ris.style\n\u2022 Email: hello@risstyle.com' },
  { q: 'Apakah tersedia layanan pre-order?', a: 'Ya, beberapa koleksi eksklusif tersedia melalui sistem pre-order. Estimasi waktu produksi akan dicantumkan pada halaman produk.' },
  { q: 'Apakah tersedia gift wrapping?', a: 'Ya, kami menyediakan layanan gift wrapping gratis untuk member dan pembelian tertentu.' },
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section id="faq" className="py-20" style={{ background: '#F5F7FA' }}>
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeading badge="FAQ" title="Pertanyaan yang Sering Diajukan"
          subtitle="Temukan jawaban untuk pertanyaan umum seputar pemesanan, pembayaran, dan membership Ris.Style" />

        <div className="space-y-3">
          {FAQ_DATA.map((item, i) => (
            <div key={i} className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E6EFF5' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left transition-all"
                style={{ color: openFaq === i ? '#2D60FF' : '#343C6A' }}>
                <span className="text-sm font-semibold pr-4">{i + 1}. {item.q}</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-transform"
                  style={{
                    background: openFaq === i ? '#2D60FF' : '#F5F7FA',
                    color: openFaq === i ? '#fff' : '#718EBF',
                    transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s, background 0.2s',
                  }}>▼</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5" style={{ borderTop: '1px solid #E6EFF5' }}>
                  <p className="text-sm leading-relaxed pt-4" style={{ color: '#718EBF', whiteSpace: 'pre-line' }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
