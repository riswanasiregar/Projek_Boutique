import { useState } from 'react';
import { SectionHeading } from '../../shared/utils';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="py-20" style={{ background: '#F5F7FA' }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading badge="Contact Us" title="Get in Touch"
          subtitle="Have questions or need assistance? We're here to help!" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-5">
            {[
              { icon: '📍', title: 'Visit Our Store', lines: ['Jl. Fashion Boulevard No. 88', 'Jakarta Pusat 10310, Indonesia'] },
              { icon: '📞', title: 'Call Us', lines: ['+62 812-3456-7890', 'Mon - Sat, 09:00 - 21:00 WIB'] },
              { icon: '✉️', title: 'Email Us', lines: ['hello@risstyle.com', 'info@risstyle.com'] },
              { icon: '💬', title: 'Social Media', lines: ['Instagram: @ris.style', 'WhatsApp: +62 812-3456-7890'] },
            ].map(c => (
              <div key={c.title} className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: '#fff', border: '1px solid #E6EFF5' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#E7EDFF' }}>
                  <span style={{ fontSize: '20px' }}>{c.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold mb-1" style={{ color: '#343C6A' }}>{c.title}</p>
                  {c.lines.map((l, i) => <p key={i} className="text-xs" style={{ color: '#718EBF' }}>{l}</p>)}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-8" style={{ background: '#fff', border: '1px solid #E6EFF5' }}>
            {sent ? (
              <div className="text-center py-12">
                <span className="text-4xl block mb-3">✅</span>
                <p className="text-lg font-bold mb-2" style={{ color: '#343C6A' }}>Message Sent!</p>
                <p className="text-sm" style={{ color: '#718EBF' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-6" style={{ color: '#343C6A' }}>Send Us a Message</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#343C6A' }}>Full Name</label>
                    <input type="text" placeholder="Your name" value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-5 py-3 rounded-xl text-sm outline-none"
                      style={{ border: '1.5px solid #E6EFF5', color: '#343C6A', fontFamily: '"Inter", sans-serif' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#343C6A' }}>Email</label>
                    <input type="email" placeholder="your@email.com" value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-5 py-3 rounded-xl text-sm outline-none"
                      style={{ border: '1.5px solid #E6EFF5', color: '#343C6A', fontFamily: '"Inter", sans-serif' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#343C6A' }}>Message</label>
                    <textarea rows={4} placeholder="How can we help you?" value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full px-5 py-3 rounded-xl text-sm outline-none resize-none"
                      style={{ border: '1.5px solid #E6EFF5', color: '#343C6A', fontFamily: '"Inter", sans-serif' }} />
                  </div>
                  <button
                    onClick={() => { if (form.name && form.email && form.message) { setSent(true); setForm({ name: '', email: '', message: '' }); } }}
                    className="w-full py-3.5 rounded-full text-sm font-semibold text-white transition-all"
                    style={{ background: '#2D60FF' }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
                    Send Message
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
