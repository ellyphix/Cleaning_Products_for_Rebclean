import { FormEvent, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  Check,
  Droplets,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Sparkles,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Product = {
  name: string;
  category: string;
  description: string;
  size: string;
  image: string;
  tone: string;
};

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const whatsappNumber = '254791088212';
const whatsappUrl = (message: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

const products: Product[] = [
  { name: 'Hand Wash', category: 'Hand care', description: 'A fresh everyday clean for sinks at home, work and everywhere in between.', size: 'Size to be confirmed', image: '/products/rebclean-hand-wash.png', tone: 'aqua' },
  { name: 'Hand Sanitizer', category: 'Hand care', description: 'A convenient clean for your daily routine. Product details are being confirmed.', size: 'Size to be confirmed', image: '/products/rebclean-hand-sanitizer.png', tone: 'blue' },
  { name: 'Dishwashing Liquid', category: 'Kitchen care', description: 'Made for the everyday washing-up routine, from quick rinses to a full sink.', size: 'Size to be confirmed', image: '/products/rebclean-dishwashing-liquid.png', tone: 'teal' },
  { name: 'Multi-purpose Cleaner', category: 'Home care', description: 'A flexible cleaning essential for the surfaces and spaces that matter most.', size: 'Size to be confirmed', image: '/products/rebclean-multi-purpose-cleaner.png', tone: 'green' },
  { name: 'Laundry Detergent', category: 'Laundry care', description: 'An everyday laundry companion for homes and workplaces. Details to be confirmed.', size: 'Size to be confirmed', image: '/products/rebclean-laundry-detergent.png', tone: 'deep' },
  { name: 'Toilet Cleaner', category: 'Home care', description: 'A focused cleaning essential for keeping washrooms feeling fresh and cared for.', size: 'Size to be confirmed', image: '/products/rebclean-toilet-cleaner.png', tone: 'coral' },
];

const navItems = [
  ['Home', '/'],
  ['Products', '/products'],
  ['Uses & Solutions', '/uses'],
  ['About', '/about'],
  ['Wholesale', '/wholesale'],
  ['Contact', '/contact'],
];

function Logo({ badge = false, primary = false }: { badge?: boolean; primary?: boolean }) {
  const className = badge ? 'logo logo-badge' : primary ? 'logo logo-primary' : 'logo';
  const src = badge ? '/rebclean-badge-logo-transparent.png' : '/rebclean-primary-logo-transparent.png';
  return <img className={className} src={src} alt={badge ? 'Rebclean product badge' : 'Rebclean Solutions'} />;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const path = window.location.pathname;
  const isHome = path === '/';
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const updateScrollState = () => setIsScrolled(window.scrollY > 24);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, [isHome]);

  const headerClassName = ['site-header', isHome && 'site-header-home', isHome && isScrolled && 'is-scrolled', menuOpen && 'menu-open'].filter(Boolean).join(' ');

  return (
    <header className={headerClassName}>
      <a href="/" aria-label="Rebclean Solutions home"><Logo primary /></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.map(([label, href]) => <a className={path === href ? 'active' : ''} href={href} key={href}>{label}</a>)}
      </nav>
      <a className="header-chat" href={whatsappUrl('Hello Rebclean Solutions, I\'d like to learn more about your products.')} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Chat with us</a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map(([label, href]) => <a className={path === href ? 'active' : ''} href={href} key={href} onClick={() => setMenuOpen(false)}>{label}<ArrowRight size={16} /></a>)}<a className="mobile-whatsapp" href={whatsappUrl('Hello Rebclean Solutions, I\'d like to learn more about your products.')} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Chat on WhatsApp</a></nav>}
    </header>
  );
}

function Footer() {
  return <footer className="site-footer"><div className="footer-main"><div><Logo badge /><p>Clean living, made affordable.<br />Cleaning essentials for homes and workplaces.</p></div><div><p className="footer-label">Explore</p>{navItems.slice(1, 4).map(([label, href]) => <a href={href} key={href}>{label}</a>)}</div><div><p className="footer-label">Connect</p><a href={whatsappUrl('Hello Rebclean Solutions, I\'d like to learn more about your products.')} target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp</a><a href="tel:+254791088212"><Phone size={15} /> +254 791 088212</a></div></div><div className="footer-bottom"><span>© 2026 Rebclean Solutions</span><span>Made for everyday clean.</span></div></footer>;
}

function WhatsAppFloat() { return window.location.pathname === '/' ? null : <a className="whatsapp-float" href={whatsappUrl('Hello Rebclean Solutions, I\'d like to learn more about your products.')} target="_blank" rel="noreferrer" aria-label="Chat with Rebclean Solutions on WhatsApp"><MessageCircle /></a>; }

function PageShell({ children }: { children: ReactNode }) { useEffect(() => { window.scrollTo(0, 0); }, []); return <><Header /><main>{children}</main><Footer /><WhatsAppFloat /></>; }

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <div className="section-intro"><span className="eyebrow"><span />{eyebrow}</span><h2>{title}</h2><p>{text}</p></div>; }

function ButtonLink({ href, children }: { href: string; children: ReactNode }) { return <a className="button" href={href}>{children}<ArrowRight size={17} /></a>; }

function HomePage() {
  const heroProducts = [
    { name: 'Aqua hand wash', image: '/products/rebclean-hand-wash.png', size: 'hand-wash' },
    { name: 'Hand sanitizer', image: '/products/rebclean-hand-sanitizer.png', size: 'sanitizer' },
    { name: 'Aqua dishwashing liquid', image: '/products/rebclean-dishwashing-liquid.png', size: 'dishwashing' },
    { name: 'White 5-litre multi-purpose cleaner', image: '/products/rebclean-multi-purpose-cleaner.png', size: 'multi-purpose' },
    { name: 'Blue 5-litre laundry detergent', image: '/products/rebclean-laundry-detergent.png', size: 'laundry' },
    { name: 'Pink toilet cleaner with red cap', image: '/products/rebclean-toilet-cleaner.png', size: 'toilet-cleaner' },
  ];

  return <PageShell><section className="hero" aria-label="Rebclean Solutions cleaning products"><div className="hero-copy"><h1 aria-label="Rebclean Solutions"><span>Rebclean</span><span>Solutions</span></h1><p className="hero-tagline">Clean Living. Made Affordable.</p><div className="hero-mobile-actions"><a className="hero-mobile-cta hero-mobile-cta-primary" href="/products">View Products <ArrowRight size={20} /></a><a className="hero-mobile-cta hero-mobile-cta-secondary" href={whatsappUrl('Hello Rebclean Solutions, I\'d like to learn more about your products.')} target="_blank" rel="noreferrer"><MessageCircle size={20} /> Chat with us</a></div></div><div className="hero-products" aria-label="Rebclean cleaning products">{heroProducts.map((product) => <div className={`hero-product hero-product-${product.size}`} key={product.size}><img src={product.image} alt={product.name} /><img className="hero-reflection" src={product.image} alt="" aria-hidden="true" /></div>)}</div></section><section className="home-range section-wrap"><SectionIntro eyebrow="The everyday range" title="A cleaner feeling, in every corner." text="From the kitchen sink to the laundry room, Rebclean brings simple, dependable cleaning into the moments that make up your day." /><div className="range-grid">{products.map((product, index) => <article className={`range-card range-product-card range-${index % 3 + 1}`} key={product.name}><div className="range-product-image"><img src={product.image} alt={product.name} loading="lazy" /></div><div className="range-product-copy"><div className="range-number">0{index + 1}</div><div><span>{product.category}</span><h3>{product.name}</h3><a href="/products">Discover range <ArrowRight size={14} /></a></div></div></article>)}</div></section><section className="home-partner"><div className="partner-watermark"><Leaf /></div><div><span className="eyebrow"><span />For retailers & bulk buyers</span><h2>Bring a better clean<br /><em>to more people.</em></h2><p>Interested in stocking Rebclean or buying for your workplace? Letâ€™s start a conversation.</p><ButtonLink href="/wholesale">Explore partnerships</ButtonLink></div><div className="partner-mark"><Logo badge /></div></section><section className="home-contact section-wrap"><div><span className="eyebrow"><span />Letâ€™s talk</span><h2>Questions? Weâ€™re<br /><em>just a message away.</em></h2></div><a className="contact-orb" href={whatsappUrl('Hello Rebclean Solutions, I\'d like to learn more about your products.')} target="_blank" rel="noreferrer"><MessageCircle /><span>Chat with Rebclean<br />on WhatsApp</span><ArrowRight /></a></section></PageShell>;
}
function ProductCard({ product, onOpen }: { product: Product; onOpen: (product: Product) => void }) { return <article className="product-card"><button className={`product-image tone-${product.tone}`} onClick={() => onOpen(product)} aria-label={`View ${product.name}`}><img src={product.image} alt="" loading="lazy" /><span className="product-chip">{product.category}</span><span className="view-product">View details <ArrowRight size={14} /></span></button><div className="product-card-copy"><div><h3>{product.name}</h3><p>{product.description}</p></div><span className="product-size">{product.size}</span><a href={whatsappUrl(`Hello Rebclean Solutions, I'd like to enquire about the ${product.name}.`)} target="_blank" rel="noreferrer" className="product-enquire"><MessageCircle size={15} /> Enquire</a></div></article>; }

function ProductsPage() {
  const [filter, setFilter] = useState('All products'); const [selected, setSelected] = useState<Product | null>(null); const categories = ['All products', ...Array.from(new Set(products.map((product) => product.category)))]; const visibleProducts = useMemo(() => filter === 'All products' ? products : products.filter((product) => product.category === filter), [filter]);
  return <PageShell><section className="page-hero"><div><span className="eyebrow"><span />Our collection</span><h1>Made for the<br /><em>everyday clean.</em></h1><p>A considered range of cleaning essentials for the places you call home, work and everywhere in between.</p></div><div className="page-hero-art"><Sparkles /><span>06<br /><small>everyday essentials</small></span></div></section><section className="catalogue section-wrap"><div className="catalogue-head"><div><span className="eyebrow"><span />Explore the range</span><h2>Find your clean.</h2></div><div className="filter-list" role="group" aria-label="Filter products">{categories.map((category) => <button className={filter === category ? 'selected' : ''} onClick={() => setFilter(category)} key={category}>{category}</button>)}</div></div><div className="product-grid">{visibleProducts.map((product) => <ProductCard product={product} onOpen={setSelected} key={product.name} />)}</div></section>{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="product-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close product details" onClick={() => setSelected(null)}><X /></button><div className={`modal-image tone-${selected.tone}`}><img src={selected.image} alt={`${selected.name} product range`} /></div><div className="modal-copy"><span className="eyebrow"><span />{selected.category}</span><h2>{selected.name}</h2><p>{selected.description}</p><div className="detail-row"><span>Product size</span><strong>{selected.size}</strong></div><div className="placeholder-note"><Sparkles size={16} /> Product information is being confirmed. Enquire for current details.</div><a className="button" href={whatsappUrl(`Hello Rebclean Solutions, I'd like to enquire about the ${selected.name}.`)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Enquire on WhatsApp</a></div></div></div>}</PageShell>;
}

const solutions = [{ title: 'Handwashing', text: 'Simple care for the moments when clean hands are part of the routine.', product: 'Hand Wash', icon: Droplets, tone: 'solution-aqua' }, { title: 'Laundry', text: 'Everyday laundry care for the clothes, fabrics and spaces you live in.', product: 'Laundry Detergent', icon: Sparkles, tone: 'solution-blue' }, { title: 'Dishwashing', text: 'A more considered clean for the heart of the home: the kitchen.', product: 'Dishwashing Liquid', icon: Droplets, tone: 'solution-teal' }, { title: 'Household cleaning', text: 'Keep the spaces around you feeling cared for, fresh and ready.', product: 'Multi-purpose Cleaner', icon: Leaf, tone: 'solution-green' }];
function UsesPage() { return <PageShell><section className="page-hero uses-hero"><div><span className="eyebrow"><span />Uses & solutions</span><h1>Whatever the day<br /><em>brings home.</em></h1><p>Good cleaning starts with knowing what your space needs. Explore simple solutions for the routines that matter.</p></div><div className="uses-stamp"><Droplets /><span>Find<br />your<br />clean</span></div></section><section className="solutions section-wrap"><SectionIntro eyebrow="Made to fit your routine" title="One brand. Many everyday moments." text="Explore the Rebclean collection by the way you live, work and care for your spaces." /><div className="solutions-grid">{solutions.map(({ title, text, product, icon: Icon, tone }, index) => <article className={`solution-card ${tone}`} key={title}><div className="solution-top"><span>0{index + 1}</span><Icon /></div><h3>{title}</h3><p>{text}</p><a href={`/products#${product.toLowerCase().replace(/ /g, '-')}`}>Explore {product} <ArrowRight size={15} /></a></article>)}</div></section><section className="use-quote"><div className="quote-line" /><p>“Why struggle with stubborn dirt when cleanliness can be affordable?”</p><span>— Rebclean Solutions</span></section></PageShell>; }

function AboutPage() { return <PageShell><section className="about-intro"><div className="about-copy"><span className="eyebrow"><span />About Rebclean</span><h1>Clean should feel<br /><em>within reach.</em></h1><p>Rebclean Solutions exists to make everyday cleanliness feel less complicated and more accessible — for homes, workplaces and the people who bring them to life.</p></div><div className="about-logo"><Logo badge /><div className="orbit orbit-a" /><div className="orbit orbit-b" /></div></section><section className="about-story section-wrap"><div className="story-image"><img src="/WhatsApp_Image_2026-10-16_at_2.46.50_AM.jpeg" alt="Rebclean product containers ready for distribution" /></div><div><span className="eyebrow"><span />Our starting point</span><h2>A practical kind of<br /><em>clean.</em></h2><p>We’re building a Kenyan cleaning products brand around a straightforward idea: quality everyday essentials should be accessible to more people.</p><p>Our story is still unfolding. What stays constant is the intention — products that fit real routines, honest conversations and a cleaner tomorrow.</p><div className="story-sign"><Leaf size={19} /><span>Affordable cleanliness<br /><small>for homes & workplaces</small></span></div></div></section><section className="values"><SectionIntro eyebrow="What guides us" title="Small details. Big difference." text="Three simple principles shape the Rebclean experience." /><div className="values-grid"><div><span>01</span><h3>Accessible</h3><p>Clean living should not feel out of reach.</p></div><div><span>02</span><h3>Dependable</h3><p>Clear, considered essentials for everyday use.</p></div><div><span>03</span><h3>Human</h3><p>Friendly service, from first question to final clean.</p></div></div></section></PageShell>; }

function EnquiryForm({ wholesale = false }: { wholesale?: boolean }) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState('');
  const [submittedName, setSubmittedName] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setError('');
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const message = String(form.get('message') || '').trim();
    if (!name || !email || !message || !email.includes('@') || !email.includes('.')) {
      setError('Please complete your name, a valid email and your message.');
      setStatus('error');
      return;
    }
    const table = wholesale ? 'wholesale_enquiries' : 'contact_messages';
    const payload = wholesale
      ? { name, email, phone: String(form.get('phone') || '').trim(), business_name: String(form.get('business_name') || '').trim(), message }
      : { name, email, subject: String(form.get('subject') || '').trim(), message };
    const { error: insertError } = await supabase.from(table).insert(payload);
    if (insertError) {
      setError('We couldn’t send that just now. Please try WhatsApp instead.');
      setStatus('error');
      return;
    }
    setSubmittedName(name);
    setStatus('success');
    event.currentTarget.reset();
  }

  if (status === 'success') {
    return (
      <div className="form-success"><div><Check /></div><span className="eyebrow"><span />Message received</span><h3>Thanks, {submittedName.split(' ')[0]}.</h3><p>We’ll get back to you as soon as possible. If it’s urgent, you can also reach us directly on WhatsApp.</p><a className="button" href={whatsappUrl(wholesale ? 'Hello Rebclean Solutions, I am interested in wholesale and partnerships.' : "Hello Rebclean Solutions, I’d like to learn more about your products.")} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Chat on WhatsApp</a><button className="form-reset" onClick={() => setStatus('idle')}>Send another message</button></div>
    );
  }

  return <form className="enquiry-form" onSubmit={submit} noValidate><div className="form-grid"><label>Your name<input name="name" required placeholder="Jane Doe" /></label><label>Email address<input name="email" type="email" required placeholder="jane@example.com" /></label>{wholesale && <><label>Business name<input name="business_name" placeholder="Your business" /></label><label>Phone number<input name="phone" type="tel" placeholder="+254 ..." /></label></>}</div>{!wholesale && <label>Subject<input name="subject" placeholder="How can we help?" /></label>}<label>Your message<textarea name="message" required rows={5} placeholder={wholesale ? 'Tell us a little about your business or requirements...' : 'Tell us what you need...'} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending...' : wholesale ? 'Send partnership enquiry' : 'Send message'}<ArrowRight size={17} /></button><p className="form-footnote">By sending this message, you’re starting a conversation with Rebclean Solutions.</p></form>;
}

function WholesalePage() { return <PageShell><section className="page-hero wholesale-hero"><div><span className="eyebrow"><span />Wholesale & partnerships</span><h1>Let’s make clean<br /><em>move further.</em></h1><p>For retailers, cleaning businesses and teams looking to bring Rebclean into more everyday spaces.</p><a className="button" href={whatsappUrl('Hello Rebclean Solutions, I am interested in wholesale and partnerships.')} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Start on WhatsApp</a></div><div className="wholesale-art"><div className="art-circle" /><span>For<br />bigger<br /><em>clean.</em></span></div></section><section className="wholesale-content section-wrap"><div className="wholesale-aside"><span className="eyebrow"><span />Partner with us</span><h2>Good things<br /><em>start here.</em></h2><p>Share a little about what you’re looking for. Our team will follow up with the right next step.</p><div className="aside-line"><MessageCircle size={17} /><span>Prefer a quick conversation?<br /><a href={whatsappUrl('Hello Rebclean Solutions, I am interested in wholesale and partnerships.')} target="_blank" rel="noreferrer">Message us directly</a></span></div></div><div className="form-card"><EnquiryForm wholesale /></div></section></PageShell>; }

function ContactPage() { return <PageShell><section className="contact-hero"><div><span className="eyebrow"><span />Contact Rebclean</span><h1>We’re here for<br /><em>the clean stuff.</em></h1><p>Have a product question, a partnership idea or simply want to say hello? We’d love to hear from you.</p></div><div className="contact-details"><a href={whatsappUrl('Hello Rebclean Solutions, I\'d like to learn more about your products.')} target="_blank" rel="noreferrer"><MessageCircle /><span><small>WhatsApp</small>+254 791 088212</span><ArrowRight /></a><a href="tel:+254791088212"><Phone /><span><small>Telephone</small>+254 791 088212</span><ArrowRight /></a></div></section><section className="contact-form-section section-wrap"><div className="contact-form-heading"><span className="eyebrow"><span />Send a message</span><h2>Let’s start<br /><em>a conversation.</em></h2><div className="contact-note"><Mail size={17} /><span>Business email and location will be shared here once confirmed.</span></div><div className="contact-note"><MapPin size={17} /><span>Serving homes and workplaces across Kenya.</span></div></div><div className="form-card"><EnquiryForm /></div></section></PageShell>; }

function NotFoundPage() { return <PageShell><section className="not-found"><Droplets /><span className="eyebrow"><span />404</span><h1>That page is<br /><em>out of reach.</em></h1><ButtonLink href="/">Back home</ButtonLink></section></PageShell>; }

function App() { const path = window.location.pathname.replace(/\/$/, '') || '/'; if (path === '/') return <HomePage />; if (path === '/products') return <ProductsPage />; if (path === '/uses') return <UsesPage />; if (path === '/about') return <AboutPage />; if (path === '/wholesale') return <WholesalePage />; if (path === '/contact') return <ContactPage />; return <NotFoundPage />; }

export default App;
