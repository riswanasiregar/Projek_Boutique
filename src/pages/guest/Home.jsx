import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

import Hero from './sections/Hero';
import About from './sections/About';
import Categories from './sections/Categories';
import Products from './sections/Products';
import Testimonials from './sections/Testimonials';
import Membership from './sections/Membership';
import Rewards from './sections/Rewards';
import FAQ from './sections/FAQ';
import Contact from './sections/Contact';
import CTA from './sections/CTA';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeCategory, setCategory] = useState('All');
  const [selectedProduct, setSelected] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => { if (!error && data) setProducts(data); setLoadingProducts(false); });
    supabase.from('feedbacks').select('*').eq('status', 'Published').order('created_at', { ascending: false })
      .then(({ data, error }) => { if (!error && data) setFeedbacks(data); setLoadingFeedbacks(false); });
  }, []);

  function handleCategoryClick(catName) {
    setCategory(catName);
    document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <Hero productCount={products.length} reviewCount={feedbacks.length} />
      <About />
      <Categories products={products} onCategoryClick={handleCategoryClick} />
      <Products
        products={products}
        activeCategory={activeCategory}
        setCategory={setCategory}
        loading={loadingProducts}
        selectedProduct={selectedProduct}
        setSelected={setSelected}
      />
      <Testimonials feedbacks={feedbacks} loading={loadingFeedbacks} />
      <Membership />
      <Rewards />
      <FAQ />
      <Contact />
      <CTA />
    </>
  );
}
