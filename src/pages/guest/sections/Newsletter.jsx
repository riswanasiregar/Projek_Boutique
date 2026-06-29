import { useState } from 'react';
import { SectionHeading } from '../../shared/utils';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <section id="newsletter" className="py-20" style={{ background: '#fff' }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <SectionHeading badge="Newsletter" title="Stay in the Loop"
          subtitle="Subscribe to get the latest collections, exclusive offers, and style tips delivered to your inbox" />

        <div className="rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, #E7EDFF 0%, #F5F7FA 100%)', border: '1px solid #E6EFF5' }}>
          {sent ? (
            <div className="py-4">
              <span className="text-4xl block mb-3">✉️</span>
              <p className="text-lg font-bold mb-2" style={{ color: '#343C6A' }}>Thank You!</p>
              <p className="text-sm" style={{ color: '#718EBF' }}>You've been subscribed. Watch your inbox for exclusive updates!</p>
            </div>
          ) : (
            <>
              <p className="text-sm mb-6" style={{ color: '#718EBF' }}>
                Join 5,000+ fashion lovers and be the first to know about new arrivals and member-only deals.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input type="email" placeholder="Enter your email address" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none"
                  style={{ border: '1.5px solid #E6EFF5', color: '#343C6A', fontFamily: '"Inter", sans-serif' }} />
                <button onClick={() => { if (email.includes('@')) { setSent(true); setEmail(''); } }}
                  className="px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-all"
                  style={{ background: '#2D60FF' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
                  Subscribe
                </button>
              </div>
              <p className="text-xs mt-4" style={{ color: '#B1B1B1' }}>We respect your privacy. Unsubscribe anytime.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
