// ─── Types ───────────────────────────────────────────────────────────────────

export interface Service {
  id: string
  title: string
  description: string
  features: string[]
  priceNote: string
}

export interface Project {
  slug: string
  title: string
  category: string
  location: string
  clientType: string
  completionDate: string
  image: string
  summary: string
  details: string
  beforeAfterNotes: string
  gallery: string[]
}

export interface BlogPost {
  slug: string
  title: string
  category: string
  excerpt: string
  content: string
  author: string
  date: string
  image: string
}

export interface NewsItem {
  slug: string
  title: string
  date: string
  summary: string
  content: string
  image: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
}

// ─── Services ─────────────────────────────────────────────────────────────────

export const services: Service[] = [
  {
    id: 'residential',
    title: 'Residential Cleaning',
    description:
      'Comprehensive home cleaning tailored to your lifestyle. We handle everything from routine maintenance to seasonal deep cleans.',
    priceNote: 'From $120 / visit',
    features: [
      'Kitchen & bathroom sanitization',
      'Dusting & vacuuming all rooms',
      'Floor mopping & polishing',
      'Window & mirror cleaning',
      'Trash removal',
      'Eco-friendly products available',
    ],
  },
  {
    id: 'commercial',
    title: 'Commercial Office Cleaning',
    description:
      'Keep your workplace spotless and productive. We offer flexible scheduling — daily, weekly, or monthly — with minimal disruption to your business.',
    priceNote: 'Custom pricing',
    features: [
      'Workstation & desk cleaning',
      'Restroom deep sanitization',
      'Common area maintenance',
      'Trash & recycling management',
      'Floor care & carpet cleaning',
      'After-hours service available',
    ],
  },
  {
    id: 'deep-cleaning',
    title: 'Deep Cleaning',
    description:
      'Our most thorough service — perfect for move-ins, move-outs, post-renovation, or when you just need a complete reset.',
    priceNote: 'From $280 / session',
    features: [
      'Inside oven & refrigerator',
      'Cabinet interiors & shelving',
      'Grout scrubbing & tile polishing',
      'Baseboard & trim detailing',
      'Light fixture cleaning',
      'Behind & under appliances',
    ],
  },
  {
    id: 'move-in-out',
    title: 'Move-In / Move-Out',
    description:
      'Start fresh or leave a lasting impression. Our move cleaning service ensures properties are spotless for the next chapter.',
    priceNote: 'From $200 / session',
    features: [
      'Full property top-to-bottom clean',
      'Appliance interior cleaning',
      'Wall spot cleaning',
      'Window sill & track cleaning',
      'Carpet vacuuming & treatment',
      'Garage sweep',
    ],
  },
]

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    slug: 'downtown-office-tower',
    title: 'Downtown Office Tower',
    category: 'Commercial',
    location: 'Downtown, ST',
    clientType: 'Corporate Office',
    completionDate: 'March 2024',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    summary: 'Full-floor deep clean and ongoing maintenance contract for a 12-story office building.',
    details:
      'This project involved a complete deep clean of all 12 floors, including executive suites, open-plan work areas, conference rooms, and restrooms. We implemented a customized ongoing maintenance schedule that keeps the building in pristine condition year-round.',
    beforeAfterNotes:
      'Before: High-traffic areas showed significant wear, carpets were stained, and restrooms needed grout restoration. After: Every surface restored to like-new condition; carpets cleaned and treated; restrooms fully sanitized and re-grouted.',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    slug: 'lakeside-luxury-home',
    title: 'Lakeside Luxury Home',
    category: 'Residential',
    location: 'Lakeside, ST',
    clientType: 'Private Residence',
    completionDate: 'January 2024',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
    summary: 'Post-renovation deep clean for a 6-bedroom lakeside property.',
    details:
      "Following a 9-month renovation, this stunning 6-bedroom home required a thorough post-construction clean. Our team removed all construction dust, treated every surface, and prepared the home for the family's move-in day.",
    beforeAfterNotes:
      'Before: Construction dust on every surface, paint splatter on floors, and debris throughout. After: Every room move-in ready, floors gleaming, windows crystal clear.',
    gallery: [
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    slug: 'riverside-restaurant',
    title: 'Riverside Restaurant',
    category: 'Commercial',
    location: 'Riverside, ST',
    clientType: 'Food & Beverage',
    completionDate: 'February 2024',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    summary: 'Weekly deep cleaning contract for a busy waterfront restaurant.',
    details:
      'We provide weekly deep cleaning for this award-winning 120-seat restaurant. Our team works overnight to ensure zero disruption to service while maintaining the highest standards of hygiene required for food service environments.',
    beforeAfterNotes:
      'Before: Kitchen grease buildup, dining area requiring thorough sanitization. After: Full health-code compliance, kitchen surfaces degreased and sanitized, dining area spotless.',
    gallery: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    slug: 'city-centre-apartments',
    title: 'City Centre Apartments',
    category: 'Residential',
    location: 'City Centre, ST',
    clientType: 'Property Management',
    completionDate: 'April 2024',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    summary: 'Move-in/move-out cleaning for a 40-unit apartment complex.',
    details:
      'Ongoing move-in/move-out cleaning partnership with a premier property management company. We turn around units quickly and to a consistent standard, helping minimize vacancy periods between tenants.',
    beforeAfterNotes:
      'Before: Units in varying states of cleanliness after tenant departure. After: Every unit brought to a consistent, hotel-standard level of cleanliness ready for new occupants.',
    gallery: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    ],
  },
]

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export const blogPosts: BlogPost[] = [
  {
    slug: 'ultimate-spring-cleaning-guide',
    title: 'The Ultimate Spring Cleaning Guide for 2024',
    category: 'How-To Guides',
    excerpt:
      "Spring cleaning doesn't have to be overwhelming. Our room-by-room checklist makes it easy to tackle every corner of your home.",
    content:
      'Spring is the perfect time to refresh your living space. Start by decluttering each room before you clean — removing items you no longer need makes the process much faster and more effective. Work from top to bottom in each room, starting with ceiling fans and light fixtures before moving to furniture and finally floors.',
    author: 'Sarah Mitchell',
    date: 'March 15, 2024',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'eco-friendly-cleaning-products',
    title: '10 Eco-Friendly Cleaning Products That Actually Work',
    category: 'Green Cleaning',
    excerpt:
      "You don't have to choose between clean and green. These eco-certified products deliver powerful results without harsh chemicals.",
    content:
      'Switching to eco-friendly cleaning products is one of the best decisions you can make for your family and the environment. Many people assume green products are less effective, but modern formulations are just as powerful as traditional chemical cleaners.',
    author: 'James Cooper',
    date: 'February 28, 2024',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'office-cleaning-productivity',
    title: 'How a Clean Office Boosts Employee Productivity',
    category: 'Commercial Cleaning',
    excerpt:
      "Research shows a direct link between workplace cleanliness and employee focus, morale, and output. Here's what the data says.",
    content:
      "A clean workspace isn't just about appearances — it directly impacts how your team performs. Studies have shown that employees in clean, organized offices report higher levels of focus, lower stress, and greater job satisfaction.",
    author: 'Lisa Chen',
    date: 'February 10, 2024',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'deep-clean-kitchen-guide',
    title: 'How to Deep Clean Your Kitchen Like a Pro',
    category: 'How-To Guides',
    excerpt:
      'Your kitchen works hard every day. Follow our professional deep-clean routine to keep it hygienic and gleaming year-round.',
    content:
      'The kitchen is one of the most used — and most neglected — rooms in the home when it comes to deep cleaning. Beyond the daily wipe-down, a regular deep clean prevents grease buildup, eliminates hidden bacteria, and keeps appliances running efficiently.',
    author: 'Sarah Mitchell',
    date: 'January 22, 2024',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
  },
]

// ─── News Items ───────────────────────────────────────────────────────────────

export const newsItems: NewsItem[] = [
  {
    slug: 'spark-clean-expands-to-new-city',
    title: 'Spark Clean Expands to Riverside — New Location Now Open',
    date: 'April 1, 2024',
    summary:
      "We're thrilled to announce the opening of our newest service location in Riverside, bringing our premium cleaning services to even more homes and businesses.",
    content:
      'After months of planning and preparation, Spark Clean is proud to officially launch our Riverside operations. This expansion means that residents and businesses in the greater Riverside area can now access our full range of residential, commercial, and deep cleaning services. Our new local team is fully trained, background-checked, and ready to bring the Spark Clean standard to your space.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'eco-certification-announcement',
    title: 'Spark Clean Achieves Green Business Certification',
    date: 'March 10, 2024',
    summary:
      'We are proud to announce that Spark Clean has officially received Green Business Certification, recognizing our commitment to sustainable and eco-friendly cleaning practices.',
    content:
      'Sustainability has always been at the heart of what we do. This certification validates our ongoing commitment to using biodegradable cleaning products, minimizing water waste, and reducing our carbon footprint across all operations. We will continue to invest in green innovations that protect both your home and the planet.',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'community-clean-up-campaign',
    title: 'Spark Clean Sponsors Local Community Clean-Up Campaign',
    date: 'February 14, 2024',
    summary:
      'Giving back to the community we serve. Spark Clean sponsored and participated in the Annual Downtown Clean-Up Day, contributing over 200 volunteer hours.',
    content:
      'We believe a clean community starts beyond the front door. This February, our team joined hundreds of local volunteers for the Annual Downtown Clean-Up Day, contributing supplies, equipment, and over 200 combined volunteer hours. It was an incredible day of teamwork, and we are proud to support the city we call home.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
  },
]

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Amanda R.',
    role: 'Homeowner',
    content:
      "Spark Clean completely transformed my home. The team was professional, thorough, and friendly. I've tried three other services and none come close to this level of quality.",
    rating: 5,
  },
  {
    id: '2',
    name: 'David K.',
    role: 'Office Manager',
    content:
      "We use Spark Clean for our 50-person office. The difference in our team's morale and focus since we started has been remarkable. Highly reliable and always consistent.",
    rating: 5,
  },
  {
    id: '3',
    name: 'Maria T.',
    role: 'Property Manager',
    content:
      'Managing 40 apartments, I need a cleaning partner I can trust completely. Spark Clean turns units around quickly and to an exceptional standard every single time.',
    rating: 5,
  },
]
