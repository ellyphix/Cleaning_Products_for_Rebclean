import { FormEvent, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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
  { name: 'Hand Wash', category: 'Hand care', description: 'A fresh everyday clean for sinks at home, work and everywhere in between.', size: 'Size to be confirmed', image: '/optimized/rebclean-hand-wash.webp', tone: 'aqua' },
  { name: 'Hand Sanitizer', category: 'Hand care', description: 'A convenient clean for your daily routine. Product details are being confirmed.', size: 'Size to be confirmed', image: '/optimized/rebclean-hand-sanitizer.webp', tone: 'blue' },
  { name: 'Dishwashing Liquid', category: 'Kitchen care', description: 'Made for the everyday washing-up routine, from quick rinses to a full sink.', size: 'Size to be confirmed', image: '/optimized/rebclean-dishwashing-liquid.webp', tone: 'teal' },
  { name: 'Multi-purpose Cleaner', category: 'Home care', description: 'A flexible cleaning essential for the surfaces and spaces that matter most.', size: 'Size to be confirmed', image: '/optimized/rebclean-multi-purpose-cleaner.webp', tone: 'green' },
  { name: 'Laundry Detergent', category: 'Laundry care', description: 'An everyday laundry companion for homes and workplaces. Details to be confirmed.', size: 'Size to be confirmed', image: '/optimized/rebclean-laundry-detergent.webp', tone: 'deep' },
  { name: 'Toilet Cleaner', category: 'Home care', description: 'A focused cleaning essential for keeping washrooms feeling fresh and cared for.', size: 'Size to be confirmed', image: '/optimized/rebclean-toilet-cleaner.webp', tone: 'coral' },
];

const navItems = [
  ['Home', '/'],
  ['Products', '/products'],
  ['Uses & Solutions', '/uses'],
  ['About', '/about'],
  ['Wholesale', '/wholesale'],
  ['Contact', '/contact'],
];

function currentRoutePath() {
  return window.location.pathname.replace(/\/$/, '') || '/';
}

function useRoutePath() {
  const [path, setPath] = useState(currentRoutePath);

  useEffect(() => {
    const updatePath = () => setPath(currentRoutePath());
    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  return path;
}

function handleInternalNavigation(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (!(event.target instanceof Element)) return;

  const link = event.target.closest<HTMLAnchorElement>('a[href]');
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

  const destination = new URL(link.href, window.location.href);
  if (destination.origin !== window.location.origin || !['http:', 'https:'].includes(destination.protocol)) return;

  event.preventDefault();
  const current = new URL(window.location.href);
  if (destination.href !== current.href) {
    window.history.pushState(null, '', `${destination.pathname}${destination.search}${destination.hash}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  if (destination.pathname === current.pathname && destination.search === current.search) {
    if (destination.hash) {
      window.requestAnimationFrame(() => document.getElementById(decodeURIComponent(destination.hash.slice(1)))?.scrollIntoView({ block: 'center' }));
    } else {
      window.scrollTo(0, 0);
    }
  }
}

function Logo({ badge = false, primary = false }: { badge?: boolean; primary?: boolean }) {
  const className = badge ? 'logo logo-badge' : primary ? 'logo logo-primary' : 'logo';
  const src = badge ? '/optimized/rebclean-badge-logo-transparent.webp' : '/rebclean-primary-logo-clean.png';
  return <img className={className} src={src} alt={badge ? 'Rebclean product badge' : 'Rebclean Solutions'} />;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const path = useRoutePath();
  const isHome = path === '/';
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const updateScrollState = () => setIsScrolled(window.scrollY > 24);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, [isHome]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (menuRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  const headerClassName = ['site-header', isHome && 'site-header-home', isHome && isScrolled && 'is-scrolled', menuOpen && 'menu-open'].filter(Boolean).join(' ');

  return (
    <header className={headerClassName}>
      <a href="/" aria-label="Rebclean Solutions home"><Logo primary /></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.map(([label, href]) => <a className={path === href || (href === '/uses' && path.startsWith('/uses/')) ? 'active' : ''} href={href} key={href}>{label}</a>)}
      </nav>
      <a className="header-chat" href={whatsappUrl('Hello Rebclean Solutions, I\'d like to learn more about your products.')} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Chat with us</a>
      <button ref={toggleRef} className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      {menuOpen && <nav ref={menuRef} className="mobile-nav" aria-label="Mobile navigation">{navItems.map(([label, href]) => <a className={path === href || (href === '/uses' && path.startsWith('/uses/')) ? 'active' : ''} href={href} key={href} onClick={() => setMenuOpen(false)}>{label}<ArrowRight size={16} /></a>)}<a className="mobile-whatsapp" href={whatsappUrl('Hello Rebclean Solutions, I\'d like to learn more about your products.')} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Chat on WhatsApp</a></nav>}
    </header>
  );
}

function Footer() {
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><Logo badge /><p>Clean living, made affordable.<br />Cleaning essentials for homes and workplaces.</p></div><div className="footer-explore"><p className="footer-label">Explore</p>{navItems.slice(1, 4).map(([label, href]) => <a href={href} key={href}>{label}</a>)}</div><div className="footer-connect"><p className="footer-label">Connect</p><a href={whatsappUrl('Hello Rebclean Solutions, I\'d like to learn more about your products.')} target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp</a><a href="tel:+254791088212"><Phone size={15} /> +254 791 088212</a></div><div className="footer-legal"><p className="footer-label">Legal</p><a href="/terms-and-conditions">Terms &amp; Conditions</a><a href="/privacy-policy">Privacy Policy</a><a href="/contact">Contact Us</a></div></div><div className="footer-bottom"><span>© 2026 Rebclean Solutions</span><span>Made for everyday clean.</span></div></footer>;
}

function WhatsAppFloat() { return window.location.pathname === '/' ? null : <a className="whatsapp-float" href={whatsappUrl('Hello Rebclean Solutions, I\'d like to learn more about your products.')} target="_blank" rel="noreferrer" aria-label="Chat with Rebclean Solutions on WhatsApp"><MessageCircle /></a>; }

function PageShell({ children }: { children: ReactNode }) { const path = useRoutePath(); useEffect(() => { const hash = window.location.hash.slice(1); if (hash) { window.requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash))?.scrollIntoView({ block: 'center' })); } else { window.scrollTo(0, 0); } }, [path]); return <><Header /><main>{children}</main><Footer /><WhatsAppFloat /></>; }

function SectionIntro({ eyebrow, title, text, headingLevel = 2 }: { eyebrow: string; title: string; text: string; headingLevel?: 1 | 2 }) { const Heading = headingLevel === 1 ? 'h1' : 'h2'; return <div className="section-intro"><span className="eyebrow"><span />{eyebrow}</span><Heading>{title}</Heading><p>{text}</p></div>; }

function ButtonLink({ href, children }: { href: string; children: ReactNode }) { return <a className="button" href={href}>{children}<ArrowRight size={17} /></a>; }

function HomePage() {
  const heroProducts = [
    { name: 'Aqua hand wash', image: '/optimized/rebclean-hand-wash.webp', size: 'hand-wash' },
    { name: 'Hand sanitizer', image: '/optimized/rebclean-hand-sanitizer.webp', size: 'sanitizer' },
    { name: 'Aqua dishwashing liquid', image: '/optimized/rebclean-dishwashing-liquid.webp', size: 'dishwashing' },
    { name: 'White 5-litre multi-purpose cleaner', image: '/optimized/rebclean-multi-purpose-cleaner.webp', size: 'multi-purpose' },
    { name: 'Blue 5-litre laundry detergent', image: '/optimized/rebclean-laundry-detergent.webp', size: 'laundry' },
    { name: 'Pink toilet cleaner with red cap', image: '/optimized/rebclean-toilet-cleaner.webp', size: 'toilet-cleaner' },
  ];

  return <PageShell><section className="hero" aria-label="Rebclean Solutions cleaning products"><div className="hero-copy"><h1 aria-label="Rebclean Solutions"><span>Rebclean</span><span>Solutions</span></h1><p className="hero-tagline">Clean Living. Made Affordable.</p><div className="hero-mobile-actions"><a className="hero-mobile-cta hero-mobile-cta-primary" href="/products">View Products <ArrowRight size={20} /></a><a className="hero-mobile-cta hero-mobile-cta-secondary" href={whatsappUrl('Hello Rebclean Solutions, I\'d like to learn more about your products.')} target="_blank" rel="noreferrer"><MessageCircle size={20} /> Chat with us</a></div></div><div className="hero-products" aria-label="Rebclean cleaning products">{heroProducts.map((product) => <div className={`hero-product hero-product-${product.size}`} key={product.size}><img src={product.image} alt={product.name} /><img className="hero-reflection" src={product.image} alt="" aria-hidden="true" /></div>)}</div></section><section className="home-range section-wrap"><SectionIntro eyebrow="The everyday range" title="A cleaner feeling, in every corner." text="From the kitchen sink to the laundry room, Rebclean brings simple, dependable cleaning into the moments that make up your day." /><div className="range-grid">{products.map((product, index) => <article className={`range-card range-product-card range-${index % 3 + 1}`} key={product.name}><div className="range-product-image"><img src={product.image} alt={product.name} loading="lazy" /></div><div className="range-product-copy"><div className="range-number">0{index + 1}</div><div><span>{product.category}</span><h3>{product.name}</h3><a href="/products">Discover range <ArrowRight size={14} /></a></div></div></article>)}</div></section><section className="home-partner"><div className="partner-watermark"><Leaf /></div><div><span className="eyebrow"><span />For retailers & bulk buyers</span><h2>Bring a better clean<br /><em>to more people.</em></h2><p>Interested in stocking Rebclean or buying for your workplace? Let’s start a conversation.</p><ButtonLink href="/wholesale">Explore partnerships</ButtonLink></div><div className="partner-mark"><Logo badge /></div></section><section className="home-contact section-wrap"><div><span className="eyebrow"><span />Let’s talk</span><h2>Questions? We’re<br /><em>just a message away.</em></h2></div><a className="contact-orb" href={whatsappUrl('Hello Rebclean Solutions, I\'d like to learn more about your products.')} target="_blank" rel="noreferrer"><MessageCircle /><span>Chat with Rebclean<br />on WhatsApp</span><ArrowRight /></a></section></PageShell>;
}
const productAnchor = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function ProductCard({ product, onOpen }: { product: Product; onOpen: (product: Product) => void }) { return <article id={productAnchor(product.name)} className="product-card"><button className={`product-image tone-${product.tone}`} onClick={() => onOpen(product)} aria-label={`View ${product.name}`}><img src={product.image} alt="" loading="lazy" /><span className="product-chip">{product.category}</span><span className="view-product">View details <ArrowRight size={14} /></span></button><div className="product-card-copy"><div><h3>{product.name}</h3><p>{product.description}</p></div><span className="product-size">{product.size}</span><a href={whatsappUrl(`Hello Rebclean Solutions, I'd like to enquire about the ${product.name}.`)} target="_blank" rel="noreferrer" className="product-enquire"><MessageCircle size={15} /> Enquire</a></div></article>; }

function ProductsPage() {
  const [filter, setFilter] = useState('All products'); const [selected, setSelected] = useState<Product | null>(null); const categories = ['All products', ...Array.from(new Set(products.map((product) => product.category)))]; const visibleProducts = useMemo(() => filter === 'All products' ? products : products.filter((product) => product.category === filter), [filter]);
  return <PageShell><section className="page-hero products-page-hero"><div><span className="eyebrow"><span />Our collection</span><h1>Made for the<br /><em>everyday clean.</em></h1><p>A considered range of cleaning essentials for the places you call home, work and everywhere in between.</p></div><div className="products-hero-visual"><img src="/optimized/rebclean-home-lifestyle.webp" alt="Woman holding Rebclean Hand Wash" /></div></section><section className="catalogue products-catalogue section-wrap"><div className="catalogue-head"><div><span className="eyebrow"><span />Explore the range</span><h2>Find your clean.</h2></div><div className="filter-list" role="group" aria-label="Filter products">{categories.map((category) => <button className={filter === category ? 'selected' : ''} onClick={() => setFilter(category)} key={category}>{category}</button>)}</div></div><div className="product-grid">{visibleProducts.map((product) => <ProductCard product={product} onOpen={setSelected} key={product.name} />)}</div></section>{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="product-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close product details" onClick={() => setSelected(null)}><X /></button><div className={`modal-image tone-${selected.tone}`}><img src={selected.image} alt={`${selected.name} product range`} /></div><div className="modal-copy"><span className="eyebrow"><span />{selected.category}</span><h2>{selected.name}</h2><p>{selected.description}</p><div className="detail-row"><span>Product size</span><strong>{selected.size}</strong></div><div className="placeholder-note"><Sparkles size={16} /> Product information is being confirmed. Enquire for current details.</div><a className="button" href={whatsappUrl(`Hello Rebclean Solutions, I'd like to enquire about the ${selected.name}.`)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Enquire on WhatsApp</a></div></div></div>}</PageShell>;
}

const solutions = [{ slug: 'handwashing', title: 'Handwashing', text: 'Simple care for the moments when clean hands are part of the routine.', product: 'Hand Wash', icon: Droplets, tone: 'solution-aqua' }, { slug: 'laundry', title: 'Laundry', text: 'Everyday laundry care for the clothes, fabrics and spaces you live in.', product: 'Laundry Detergent', icon: Sparkles, tone: 'solution-blue' }, { slug: 'dishwashing', title: 'Dishwashing', text: 'A more considered clean for the heart of the home: the kitchen.', product: 'Dishwashing Liquid', icon: Droplets, tone: 'solution-teal' }, { slug: 'household-cleaning', title: 'Household cleaning', text: 'Keep the spaces around you feeling cared for, fresh and ready.', product: 'Multi-purpose Cleaner', icon: Leaf, tone: 'solution-green' }];

type UseGuide = { title: string; intro: string; image: string; product: string; productAnchor: string; keyPoints: string[]; sections: { heading: string; text: string; steps?: string[] }[] };
const useGuides: Record<string, UseGuide> = {
  handwashing: {
    title: 'Handwashing',
    intro: 'A simple handwashing routine can fit naturally into everyday moments at home, at work and wherever the day takes you.',
    image: '/optimized/handwashing.webp', product: 'Hand Wash', productAnchor: 'hand-wash',
    keyPoints: ['Wash with soap and clean running water when available.', 'Make handwashing part of key moments, such as before preparing food and after using the toilet.', 'Follow the directions and safety information on the product label.'],
    sections: [
      { heading: 'Why it matters', text: 'Hands meet many surfaces throughout the day. Regular handwashing with soap and water is an important part of everyday hygiene. The CDC recommends washing at key moments, including before preparing food and after using the toilet.' },
      { heading: 'A simple handwashing routine', text: 'Use this familiar five-step routine with soap and clean running water:', steps: ['Wet hands, turn off the tap, and apply soap.', 'Rub hands together to lather, including the backs of hands, between fingers and under nails.', 'Scrub for at least 20 seconds.', 'Rinse well under clean running water.', 'Dry with a clean towel or air dryer.'] },
    ],
  },
  laundry: {
    title: 'Laundry care',
    intro: 'A few simple checks before each load can help make laundry feel more manageable and care for the clothes you wear every day.',
    image: '/optimized/laundry.webp', product: 'Laundry Detergent', productAnchor: 'laundry-detergent',
    keyPoints: ['Check garment care labels before washing.', 'Sort items by colour, fabric and care needs.', 'Use detergent and washing instructions as directed on their labels.'],
    sections: [
      { heading: 'Before the wash', text: 'Check pockets, close fasteners where appropriate and look over garment care labels. Separate items into loads that share similar colours and care requirements.' },
      { heading: 'During the wash', text: 'Choose a cycle and water temperature that suit the garments in the load. Follow the detergent label for the amount to use and any product-specific directions.' },
      { heading: 'After washing', text: 'Dry and store laundry according to garment care labels. Keep detergent in its original container, closed and out of reach of children.' },
    ],
  },
  dishwashing: {
    title: 'Dishwashing',
    intro: 'A steady dishwashing routine helps keep the kitchen moving, from a quick rinse after a meal to a full sink at the end of the day.',
    image: '/optimized/dishwashing.webp', product: 'Dishwashing Liquid', productAnchor: 'dishwashing-liquid',
    keyPoints: ['Clear leftover food from dishes before washing.', 'Use dishwashing liquid according to its product label.', 'Rinse washed items and let them dry on a clean rack or towel.'],
    sections: [
      { heading: 'Prepare the sink', text: 'Scrape leftover food into the bin or compost, then arrange dishes so they are easy to wash and rinse. Follow any care instructions for delicate cookware and utensils.' },
      { heading: 'Wash, rinse and dry', text: 'Use the amount and directions shown on the dishwashing liquid label. Rinse dishes thoroughly with clean water and allow them to air-dry on a clean rack or dry them with a clean towel.' },
      { heading: 'Keep the routine practical', text: 'Washing dishes soon after use can make food residue easier to remove. Store cleaning products in their original containers and follow their safety directions.' },
    ],
  },
  'household-cleaning': {
    title: 'Household cleaning',
    intro: 'A flexible cleaning routine starts with knowing the surface, choosing an appropriate product and following its directions.',
    image: '/optimized/household-cleaning.webp', product: 'Multi-purpose Cleaner', productAnchor: 'multi-purpose-cleaner',
    keyPoints: ['Check that a cleaner is suitable for the surface before using it.', 'Follow the directions and safety instructions on the product label.', 'Never mix cleaning products unless the label specifically directs you to do so.'],
    sections: [
      { heading: 'Start with the surface', text: 'Different materials can need different care. Read the surface and product instructions first, and test an inconspicuous area when you are unsure about compatibility.' },
      { heading: 'Build a simple routine', text: 'Work through rooms or tasks in a practical order, using suitable cloths and products for each surface. Follow label directions for application, contact time, rinsing and ventilation where applicable.' },
      { heading: 'Store products safely', text: 'Keep products in their original, labelled containers, securely closed and out of reach of children. Do not transfer cleaners into food or drink containers.' },
    ],
  },
};

function UsesPage() { return <PageShell><section className="solutions uses-solutions section-wrap"><SectionIntro eyebrow="Made to fit your routine" title="One brand. Many everyday moments." text="Explore the Rebclean collection by the way you live, work and care for your spaces." headingLevel={1} /><div className="solutions-grid">{solutions.map(({ slug, title, text, icon: Icon, tone }, index) => <a className={`solution-card ${tone}`} href={`/uses/${slug}`} key={slug}><div className="solution-top"><span>0{index + 1}</span><Icon /></div><h3>{title}</h3><p>{text}</p><span className="solution-card-link">Read more <ArrowRight size={15} /></span></a>)}</div></section><section className="use-quote"><div className="quote-line" /><p>“Why struggle with stubborn dirt when cleanliness can be affordable?”</p><span>— Rebclean Solutions</span></section></PageShell>; }

function UseGuidePage({ guide }: { guide: UseGuide }) {
  return <PageShell><section className="use-guide-hero"><div className="use-guide-heading"><a className="use-guide-back" href="/uses"><ArrowRight size={17} strokeWidth={3} /> All uses & solutions</a><span className="eyebrow"><span />Everyday cleaning guide</span><h1>{guide.title}</h1><p>{guide.intro}</p></div><div className="use-guide-image"><img src={guide.image} alt={guide.product} /></div></section><section className="use-guide-content section-wrap"><div className="use-guide-key-points"><span className="eyebrow"><span />At a glance</span><h2>Key points</h2><ul>{guide.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul></div><div className="use-guide-articles">{guide.sections.map((section) => <article key={section.heading}><h2>{section.heading}</h2><p>{section.text}</p>{section.steps && <ol>{section.steps.map((step) => <li key={step}>{step}</li>)}</ol>}</article>)}</div><aside className="use-guide-product"><div><span className="eyebrow"><span />From the Rebclean range</span><h2>{guide.product}</h2><p>Check the current product label for details, directions and safety information.</p></div><a className="button" href={`/products#${guide.productAnchor}`}>Find {guide.product} <ArrowRight size={16} /></a></aside>{guide.title === 'Handwashing' && <p className="use-guide-source">Handwashing guidance adapted in our own words from the <a href="https://www.cdc.gov/clean-hands/about/index.html" target="_blank" rel="noreferrer">CDC About Handwashing guide</a>.</p>}</section></PageShell>;
}

function AboutPage() { return <PageShell><section className="about-intro"><div className="about-copy"><span className="eyebrow"><span />About Rebclean</span><h1>Clean should feel<br /><em>within reach.</em></h1><p>Rebclean Solutions exists to make everyday cleanliness feel less complicated and more accessible — for homes, workplaces and the people who bring them to life.</p></div><div className="about-logo"><Logo badge /><div className="orbit orbit-a" /><div className="orbit orbit-b" /></div></section><section className="about-story section-wrap"><div className="story-image"><img src="/rebclean-about-story.webp" alt="Three women folding fresh laundry together in a bright home" loading="lazy" /></div><div><span className="eyebrow"><span />Our starting point</span><h2>A practical kind of<br /><em>clean.</em></h2><p>We’re building a Kenyan cleaning products brand around a straightforward idea: quality everyday essentials should be accessible to more people.</p><p>Our story is still unfolding. What stays constant is the intention — products that fit real routines, honest conversations and a cleaner tomorrow.</p><div className="story-sign"><Leaf size={19} /><span>Affordable cleanliness<br /><small>for homes & workplaces</small></span></div></div></section><section className="values"><SectionIntro eyebrow="What guides us" title="Small details. Big difference." text="Three simple principles shape the Rebclean experience." /><div className="values-grid"><div><span>01</span><h3>Accessible</h3><p>Clean living should not feel out of reach.</p></div><div><span>02</span><h3>Dependable</h3><p>Clear, considered essentials for everyday use.</p></div><div><span>03</span><h3>Human</h3><p>Friendly service, from first question to final clean.</p></div></div></section></PageShell>; }

function EnquiryForm({ wholesale = false }: { wholesale?: boolean }) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [submittedWhatsAppMessage, setSubmittedWhatsAppMessage] = useState('');
  const isSubmitting = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting.current) return;

    setError('');
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const message = String(form.get('message') || '').trim();
    const subject = String(form.get('subject') || '').trim();
    const businessName = String(form.get('business_name') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (
      !name || name.length > 100 || !emailIsValid || email.length > 254 ||
      !message || message.length > 4000 || subject.length > 150 ||
      businessName.length > 200 || phone.length > 32
    ) {
      setError('Please check your details. Enter your name, a valid email and a message, and keep each field within its limit.');
      setStatus('error');
      return;
    }

    const table = wholesale ? 'wholesale_enquiries' : 'contact_messages';
    const payload = wholesale
      ? { name, email, phone, business_name: businessName, message }
      : { name, email, subject, message };
    const whatsappMessage = [
      `Hello Rebclean Solutions, I have submitted a ${wholesale ? 'wholesale and partnership' : 'contact'} enquiry through your website.`,
      `Name: ${name}`,
      `Email: ${email}`,
      ...(wholesale
        ? [`Business name: ${businessName || 'Not provided'}`, `Phone: ${phone || 'Not provided'}`]
        : [`Subject: ${subject || 'Not provided'}`]),
      'Enquiry:',
      message,
    ].join('\n');

    isSubmitting.current = true;
    setStatus('sending');
    // Reserve a tab during the form gesture so browsers do not block WhatsApp
    // after the asynchronous database request completes.
    let whatsappWindow: Window | null = null;
    try {
      whatsappWindow = window.open('about:blank', '_blank');
      if (whatsappWindow) {
        whatsappWindow.opener = null;
        whatsappWindow.document.title = 'Preparing WhatsApp message';
      }
    } catch {
      // The success screen below still provides a direct WhatsApp link.
    }

    try {
      const { error: insertError } = await supabase.from(table).insert(payload);
      if (insertError) throw insertError;

      setSubmittedWhatsAppMessage(whatsappMessage);
      setSubmittedName(name);
      setStatus('success');
      formElement.reset();
      if (whatsappWindow && !whatsappWindow.closed) {
        try {
          whatsappWindow.location.replace(whatsappUrl(whatsappMessage));
        } catch {
          // Keep the success screen's WhatsApp link available as a fallback.
        }
      }
    } catch {
      if (whatsappWindow && !whatsappWindow.closed) whatsappWindow.close();
      setError('We couldn’t confirm that your enquiry was saved. Please try again in a moment or contact us directly.');
      setStatus('error');
    } finally {
      isSubmitting.current = false;
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success"><div><Check /></div><span className="eyebrow"><span />Message received</span><h3>Thanks, {submittedName.split(' ')[0]}.</h3><p>We’ll get back to you as soon as possible. Your enquiry has been saved. WhatsApp will open with your details ready for you to send.</p><a className="button" href={whatsappUrl(submittedWhatsAppMessage)} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Open WhatsApp to send</a><button className="form-reset" onClick={() => { setStatus('idle'); setSubmittedWhatsAppMessage(''); }}>Send another message</button></div>
    );
  }

  return <form className="enquiry-form" onSubmit={submit} noValidate><div className="form-grid"><label>Your name<input name="name" required maxLength={100} placeholder="Jane Doe" /></label><label>Email address<input name="email" type="email" required maxLength={254} placeholder="jane@example.com" /></label>{wholesale && <><label>Business name<input name="business_name" maxLength={200} placeholder="Your business" /></label><label>Phone number<input name="phone" type="tel" maxLength={32} placeholder="+254 ..." /></label></>}</div>{!wholesale && <label>Subject<input name="subject" maxLength={150} placeholder="How can we help?" /></label>}<label>Your message<textarea name="message" required maxLength={4000} rows={5} placeholder={wholesale ? 'Tell us a little about your business or requirements...' : 'Tell us what you need...'} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending...' : wholesale ? 'Send partnership enquiry' : 'Send message'}<ArrowRight size={17} /></button><p className="form-footnote">Submitting this form lets Rebclean Solutions use your details to respond to your enquiry. See our <a href="/privacy-policy">Privacy Policy</a> for details.</p></form>;
}
function WholesalePage() { return <PageShell><section className="page-hero wholesale-hero"><div><span className="eyebrow"><span />Wholesale & partnerships</span><h1>Let’s make clean<br /><em>move further.</em></h1><p>For retailers, cleaning businesses and teams looking to bring Rebclean into more everyday spaces.</p><a className="button" href={whatsappUrl('Hello Rebclean Solutions, I am interested in wholesale and partnerships.')} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Start on WhatsApp</a></div><div className="wholesale-art"><div className="art-circle" /><span>For<br />bigger<br /><em>clean.</em></span></div></section><section className="wholesale-content section-wrap"><div className="wholesale-aside"><span className="eyebrow"><span />Partner with us</span><h2>Good things<br /><em>start here.</em></h2><p>Share a little about what you’re looking for. Our team will follow up with the right next step.</p><div className="aside-line"><MessageCircle size={17} /><span>Prefer a quick conversation?<br /><a href={whatsappUrl('Hello Rebclean Solutions, I am interested in wholesale and partnerships.')} target="_blank" rel="noreferrer">Message us directly</a></span></div></div><div className="form-card"><EnquiryForm wholesale /></div></section></PageShell>; }

function ContactPage() { return <PageShell><section className="contact-hero"><div><span className="eyebrow"><span />Contact Rebclean</span><h1>We’re here for<br /><em>the clean stuff.</em></h1><p>Have a product question, a partnership idea or simply want to say hello? We’d love to hear from you.</p></div><div className="contact-details"><a href={whatsappUrl('Hello Rebclean Solutions, I\'d like to learn more about your products.')} target="_blank" rel="noreferrer"><MessageCircle /><span><small>WhatsApp</small>+254 791 088212</span><ArrowRight /></a><a href="tel:+254791088212"><Phone /><span><small>Telephone</small>+254 791 088212</span><ArrowRight /></a></div></section><section className="contact-form-section section-wrap"><div className="contact-form-heading"><span className="eyebrow"><span />Send a message</span><h2>Let’s start<br /><em>a conversation.</em></h2><div className="contact-note"><Mail size={17} /><span>Business email and location will be shared here once confirmed.</span></div><div className="contact-note"><MapPin size={17} /><span>Serving homes and workplaces across Kenya.</span></div></div><div className="form-card"><EnquiryForm /></div></section></PageShell>; }

function PolicyPageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <section className="policy-hero"><span className="eyebrow"><span />{eyebrow}</span><h1>{title}</h1><p>{intro}</p><span className="policy-updated">Draft for review · 18 October 2026</span></section>;
}

function TermsPage() {
  return <PageShell><PolicyPageHeader eyebrow="Customer information" title="Terms & Conditions" intro="These terms explain how product enquiries and purchases through Rebclean Solutions are handled. They are written for customers in Kenya and should be read with the details confirmed for each order." /><article className="policy-content"><aside className="policy-review-note"><strong>Business details to confirm before publication</strong><p>Confirm the legal name of the seller, the currency and tax treatment used in quotations, available payment methods, delivery areas and charges, and the customer support contact details. This website currently has no cart or online checkout; orders are discussed directly with Rebclean.</p></aside>
    <section><h2>1. About these terms</h2><p>“Rebclean”, “we”, “us” and “our” refer to Rebclean Solutions, the name displayed on this website. The legal person or business entity that will contract with customers must be confirmed and identified before these terms are published as final. These terms apply to use of this website, product enquiries, consumer orders and wholesale enquiries, subject to any written order confirmation or separate wholesale agreement.</p><p>Nothing in these terms limits a right or remedy that cannot lawfully be limited, including applicable rights under the Consumer Protection Act, 2012 and the Sale of Goods Act (Cap. 31).</p></section>
    <section><h2>2. Product information and safe use</h2><p>Product names, images and descriptions on the website help customers identify the range. Product sizes, availability, ingredients, directions, warnings and other specifications should be checked against the current product label and confirmed with us before purchase where they matter to your decision. We will correct material errors and will not intentionally make false or misleading claims about a product. Where a product is subject to a mandatory Kenya Standard or certification requirement, applicable requirements under the <a href="https://new.kenyalaw.org/akn/ke/act/1973/17/eng%402024-12-27/source" target="_blank" rel="noreferrer">Standards Act (Cap. 496)</a> and relevant standards apply; this website does not claim a particular certification.</p><p>Use cleaning products only as directed on their packaging. Keep them away from children and follow any product-specific safety instructions.</p></section>
    <section><h2>3. Enquiries and placing an order</h2><p>A website enquiry, WhatsApp message or request for a wholesale quote is not by itself an accepted order. Before you decide to buy, we will confirm the product, quantity, total price and any additional charges, payment arrangements, delivery method and estimated timing through the agreed communication channel. Please check those details and raise any corrections before accepting.</p><p>An order is accepted when Rebclean confirms acceptance of the agreed order details. We will provide or make available a durable written record of the agreement as required by law. For internet agreements, the Consumer Protection Act, 2012 addresses pre-contract information, an opportunity to accept or decline and correct errors, delivery of a copy of the agreement, and cancellation in specified circumstances (sections 31–33). The Act's rules apply according to the type of agreement and are not replaced by this summary.</p></section>
    <section><h2>4. Prices and payment</h2><p>Prices and any delivery or other charges will be stated and confirmed before you accept an order. The quotation will identify the currency and any applicable taxes or fees. No payment method is represented as available until it is stated in the order confirmation. The website does not currently take card or other payments through an online checkout. Do not send payment credentials through the enquiry forms.</p><p>Pay only using the payment details confirmed for your order. If a charge is unclear, contact us through the <a href="/contact">Contact Us page</a> before paying. Any refund due will be arranged using a method agreed with you and within the time required by applicable law; we do not state a fixed processing period here.</p></section>
    <section><h2>5. Delivery</h2><p>Delivery availability, destination, fee, carrier or collection arrangement, and estimated delivery date will be agreed and confirmed before the order is accepted. These details are not yet published as general promises on this website. We will communicate a material delivery delay and discuss an appropriate next step. This section does not remove any rights a customer may have if goods are not delivered as agreed or required by law.</p></section>
    <section><h2>6. Changes, cancellations and returns</h2><p>If you want to change or cancel an order, contact us as soon as possible using the details in your order confirmation or the <a href="/contact">Contact Us page</a>. We will confirm whether an order can be changed or stopped and explain any action already taken. Statutory cancellation rights continue to apply, including applicable rights for internet agreements under sections 31–33 of the Consumer Protection Act, 2012.</p><p>There is no blanket exclusion of returns or consumer remedies. If an item is unwanted, incorrect, damaged, unsafe, defective or does not match its description, contact us before sending it back so we can give safe return instructions. We will assess the issue and provide any remedy required by law or agreed for the order. A request for photographs or packaging information may help us investigate, but it does not take away a legal right.</p></section>
    <section><h2>7. Damaged, defective or incorrect products</h2><p>Please tell us promptly after discovering a problem and include your order reference, a description of what happened and photographs if available. Keep the product and packaging while we review the issue, and do not continue using a product that appears damaged or unsafe. We will discuss an appropriate remedy, which may include replacement, repair where suitable, a refund or another remedy required by applicable law. Your statutory rights are not limited by this process.</p></section>
    <section><h2>8. Complaints and wholesale enquiries</h2><p>For a complaint about an order, delivery, product or service, contact us through the <a href="/contact">Contact Us page</a>, call <a href="tel:+254791088212">+254 791 088212</a>, or message us on <a href="https://wa.me/254791088212" target="_blank" rel="noreferrer">WhatsApp</a>. Please include your order or enquiry reference where available. We will review the information and respond through an appropriate channel.</p><p>Wholesale and bulk-buying enquiries are subject to a separate quotation covering products, quantities, price, payment, delivery and any agreed business terms. No wholesale supply is committed until those details are accepted in writing. Consumer protections apply where the law treats the buyer as a consumer.</p></section>
    <section><h2>9. Applicable law and legal references</h2><p>These terms are intended to operate under Kenyan law, without excluding a mandatory right or remedy. Relevant legislation includes the <a href="https://new.kenyalaw.org/akn/ke/act/2012/46/eng%402022-12-31/publication" target="_blank" rel="noreferrer">Consumer Protection Act, 2012</a> (including internet agreements and consumer representations), the <a href="https://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/SaleofGoodsAct_Cap31.pdf" target="_blank" rel="noreferrer">Sale of Goods Act (Cap. 31)</a> (including terms about description, quality and fitness where applicable), and the <a href="https://new.kenyalaw.org/akn/ke/act/2010/12/eng%402022-12-31/publication" target="_blank" rel="noreferrer">Competition Act (Cap. 504)</a> provisions concerning false or misleading representations.</p></section>
    <section><h2>10. Updates and contact</h2><p>We may update these terms when our services or legal requirements change. The date at the top indicates the draft date; a revised date will be shown when an updated version is published. For questions about these terms, use the <a href="/contact">Contact Us page</a>.</p></section>
  </article></PageShell>;
}

function PrivacyPage() {
  return <PageShell><PolicyPageHeader eyebrow="Your information" title="Privacy Policy" intro="This notice describes the personal information handled through the Rebclean Solutions website and enquiries, and the choices and rights available to you under Kenyan data protection law." /><article className="policy-content"><aside className="policy-review-note"><strong>Privacy details to confirm before publication</strong><p>Confirm the seller/controller’s legal identity and privacy contact, Supabase hosting region and processor terms, any hosting logs or cookies, the retention schedule and deletion process, security/access controls, and the organisation’s ODPC registration or exemption status. Review this notice if marketing, analytics, accounts or online payments are added.</p></aside>
    <section><h2>1. Who is responsible for your information?</h2><p>This website is presented as Rebclean Solutions. The legal person or business entity that determines why and how website enquiry information is used is the data controller; its exact legal name and a dedicated privacy contact must be confirmed before this draft is published as final. Until then, privacy questions or requests can be sent through the <a href="/contact">Contact Us page</a> or by calling <a href="tel:+254791088212">+254 791 088212</a>.</p><p>This notice is based on the website’s current features. It should be updated if the controller, services, providers or information practices change.</p></section>
    <section><h2>2. Information collected</h2><ul><li>When you use the contact form: your name, email address, message, and any subject you choose to provide.</li><li>When you use the wholesale enquiry form: your name, email address, message, and any business name or phone number you choose to provide.</li><li>If you contact us by phone or WhatsApp: the contact details and message contents you choose to share through those services.</li><li>Website and database providers may generate technical records needed to deliver, secure and troubleshoot the site. The specific logs, cookies and other technical data collected must be confirmed before publication.</li></ul><p>The website currently has no customer account, cart or online payment checkout. Do not include payment card details, passwords or sensitive personal information in an enquiry.</p></section>
    <section><h2>3. Why we use information</h2><p>We use enquiry details to respond to questions, discuss product availability and quotations, consider wholesale requests, communicate about an order if one is agreed, keep appropriate business records, and protect or troubleshoot the website. We will use personal information only for specified, lawful purposes and in a way that is relevant and proportionate, as required by the Data Protection Act, 2019.</p><p>Depending on the interaction, processing may be necessary to take steps you request before entering a contract, perform an agreed contract, meet a legal obligation, pursue a legitimate interest such as responding to a customer enquiry or protecting the service, or act on consent where consent is the appropriate basis. If we later introduce optional marketing, we will explain it separately and provide a way to withdraw consent.</p></section>
    <section><h2>4. How information is stored and protected</h2><p>Website form submissions are sent to a Supabase database used by this project to store contact and wholesale enquiries. We aim to use reasonable technical and organisational safeguards and limit access to people who need the information for the purposes above. No website or transmission method can be represented as risk-free. The database hosting region, support access, processor agreement, backup arrangements and internal access controls must be verified before this notice is finalised.</p></section>
    <section><h2>5. Sharing and transfers</h2><p>We may make relevant information available to service providers that host or support the website and enquiry database, and to delivery or payment providers if needed for an order and disclosed to you. We may also disclose information where required by law or necessary to establish, exercise or defend legal claims. We do not describe these providers as confirmed until their identities and arrangements have been reviewed.</p><p>If a provider processes information outside Kenya, the applicable cross-border transfer safeguards under the Data Protection Act, 2019 and its regulations must be assessed and used. The current database region and any international access or transfers are to be confirmed. When you choose WhatsApp or another external contact service, that provider processes information under its own privacy terms.</p></section>
    <section><h2>6. How long information is kept</h2><p>We keep personal information only for as long as it is needed for the purpose for which it was collected, to complete an enquiry or transaction, meet applicable record-keeping duties, resolve a dispute, or protect legal rights. When it is no longer needed, it should be securely deleted or irreversibly anonymised, subject to any lawful retention requirement. A specific retention schedule for enquiry records, orders, backups and technical logs has not yet been confirmed and must be set before publication.</p></section>
    <section><h2>7. Your data protection rights</h2><p>Subject to the Data Protection Act, 2019 and any applicable limits, you may ask to be informed about use of your information, access it, object to processing, request correction of inaccurate information, and request erasure where the law provides that right. Where processing relies on consent, you may withdraw consent; withdrawal does not make earlier lawful processing unlawful. The Act also provides other rights in specified circumstances, including data portability.</p><p>To make a request, use the <a href="/contact">Contact Us page</a> and state that it is a privacy request. We may need to verify your identity before acting. You can also complain to the <a href="https://www.odpc.go.ke/" target="_blank" rel="noreferrer">Office of the Data Protection Commissioner (ODPC)</a> if you believe your information has been mishandled.</p></section>
    <section><h2>8. Children</h2><p>This website is intended for people making household or business product enquiries, not for children to submit personal information. A parent or guardian who believes a child has sent us personal information may contact us through the Contact Us page.</p></section>
    <section><h2>9. Legal references</h2><p>This notice is informed by the <a href="https://new.kenyalaw.org/akn/ke/act/2019/24/eng%402022-12-31/publication" target="_blank" rel="noreferrer">Data Protection Act, 2019</a>, including its principles, rights of data subjects, collection and notification requirements, and lawful processing provisions, and the <a href="https://www.odpc.go.ke/wp-content/uploads/2024/03/THE-DATA-PROTECTION-GENERAL-REGULATIONS-2021-1.pdf" target="_blank" rel="noreferrer">Data Protection (General) Regulations, 2021</a>. The ODPC publishes the Act and related regulations in its <a href="https://www.odpc.go.ke/data-protection-laws-kenya/" target="_blank" rel="noreferrer">regulatory framework</a>.</p></section>
    <section><h2>10. Changes and contact</h2><p>We may update this notice when our practices or legal requirements change. The date at the top indicates the draft date; we will update it when a revised notice is published. For privacy questions or requests, use the <a href="/contact">Contact Us page</a>.</p></section>
  </article></PageShell>;
}

function NotFoundPage() { return <PageShell><section className="not-found"><Droplets /><span className="eyebrow"><span />404</span><h1>That page is<br /><em>out of reach.</em></h1><ButtonLink href="/">Back home</ButtonLink></section></PageShell>; }

const routeMetadata: Record<string, { title: string; description: string }> = {
  '/': { title: 'Rebclean Solutions | Clean Living. Made Affordable.', description: 'Everyday cleaning essentials for homes and workplaces from Rebclean Solutions.' },
  '/products': { title: 'Cleaning Products for Everyday Use | Rebclean Solutions', description: 'Explore Rebclean hand care, kitchen, home and laundry cleaning essentials.' },
  '/uses': { title: 'Everyday Cleaning Uses & Solutions | Rebclean Solutions', description: 'Explore simple cleaning routines for handwashing, laundry, dishwashing and household care.' },
  '/about': { title: 'About Rebclean Solutions | Everyday Clean', description: 'Learn about Rebclean Solutions and our approach to accessible everyday cleaning essentials.' },
  '/wholesale': { title: 'Wholesale & Partnerships | Rebclean Solutions', description: 'Contact Rebclean Solutions about wholesale, retail and bulk-buying enquiries.' },
  '/contact': { title: 'Contact Rebclean Solutions', description: 'Get in touch with Rebclean Solutions about products, orders and partnerships.' },
  '/terms-and-conditions': { title: 'Terms & Conditions | Rebclean Solutions', description: 'Read the draft terms for Rebclean Solutions product enquiries and orders in Kenya.' },
  '/privacy-policy': { title: 'Privacy Policy | Rebclean Solutions', description: 'Learn how Rebclean Solutions handles website enquiries and personal information.' },
};

function App() {
  useEffect(() => { window.dispatchEvent(new Event('rebclean:app-ready')); document.addEventListener('click', handleInternalNavigation); return () => document.removeEventListener('click', handleInternalNavigation); }, []);
  const path = useRoutePath();
  const guideSlug = path.startsWith('/uses/') ? path.slice('/uses/'.length) : '';
  const guide = useGuides[guideSlug];
  const metadata = useMemo(
    () => guide
      ? { title: `${guide.title} | Rebclean Cleaning Guide`, description: guide.intro }
      : routeMetadata[path] || { title: 'Page Not Found | Rebclean Solutions', description: 'The requested Rebclean Solutions page could not be found.' },
    [guide, path],
  );

  useEffect(() => {
    document.title = metadata.title;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', metadata.description);
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', metadata.title);
    document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', metadata.description);
    document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', metadata.title);
    document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', metadata.description);

    const canonicalUrl = new URL(path, window.location.origin).href;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = canonicalUrl;

    let openGraphUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (!openGraphUrl) {
      openGraphUrl = document.createElement('meta');
      openGraphUrl.setAttribute('property', 'og:url');
      document.head.append(openGraphUrl);
    }
    openGraphUrl.content = canonicalUrl;
    document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.setAttribute('content', new URL('/Rebclean_Cleaning_Products_Brand_Showcase.png', window.location.origin).href);
    document.querySelector<HTMLMetaElement>('meta[name="twitter:image"]')?.setAttribute('content', new URL('/Rebclean_Cleaning_Products_Brand_Showcase.png', window.location.origin).href);
  }, [metadata, path]);

  if (guide) return <UseGuidePage guide={guide} />;
  if (path === '/') return <HomePage />;
  if (path === '/products') return <ProductsPage />;
  if (path === '/uses') return <UsesPage />;
  if (path === '/about') return <AboutPage />;
  if (path === '/wholesale') return <WholesalePage />;
  if (path === '/contact') return <ContactPage />;
  if (path === '/terms-and-conditions') return <TermsPage />;
  if (path === '/privacy-policy') return <PrivacyPage />;
  return <NotFoundPage />;
}

export default App;
