// ─── Permissions & Roles ─────────────────────────────────────────────────────

export type Permission = string

export type Role = {
  id: string
  name: string
  label: string
  permissions: Permission[]
  color: string
}

export const ROLES: Role[] = [
  {
    id: 'super_admin',
    name: 'super_admin',
    label: 'Super Admin',
    color: 'bg-purple-100 text-purple-700',
    permissions: [
      'manage_users','edit_home','edit_about','edit_services',
      'edit_projects','edit_blog','edit_news',
      'view_contact_submissions','view_project_submissions','view_appointments','manage_settings',
    ],
  },
  {
    id: 'content_manager',
    name: 'content_manager',
    label: 'Content Manager',
    color: 'bg-mint-100 text-mint-700',
    permissions: [
      'edit_home','edit_about','edit_services',
      'edit_projects','edit_blog','edit_news',
    ],
  },
  {
    id: 'communications',
    name: 'communications',
    label: 'Communications',
    color: 'bg-amber-100 text-amber-700',
    permissions: [
      'view_contact_submissions',
      'view_appointments',
      'reply_messages',
    ],
  },
]

// ─── Admin Users ──────────────────────────────────────────────────────────────

export type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  lastLogin: string
  status: 'active' | 'inactive'
}

export const adminUsers: AdminUser[] = [
  { id:'1', name:'Sarah Mitchell',  email:'sarah@sparkclean.com',  role:'super_admin',     avatar:'SM', lastLogin:'2 minutes ago', status:'active' },
  { id:'2', name:'James Cooper',    email:'james@sparkclean.com',  role:'content_manager', avatar:'JC', lastLogin:'1 hour ago',     status:'active' },
  { id:'3', name:'Lisa Chen',       email:'lisa@sparkclean.com',   role:'content_manager', avatar:'LC', lastLogin:'3 days ago',     status:'active' },
  { id:'4', name:'Tom Harris',      email:'tom@sparkclean.com',    role:'super_admin',     avatar:'TH', lastLogin:'1 week ago',     status:'inactive' },
]

// ─── Contact Submissions ──────────────────────────────────────────────────────

export type ContactSubmission = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
  date: string
  status: 'new' | 'read' | 'replied'
}

export const contactSubmissions: ContactSubmission[] = [
  { id:'1', firstName:'Amanda',  lastName:'Roberts', email:'amanda@email.com',    phone:'(555) 234-5678', subject:'Request a Quote',  message:"Hi, I'm interested in getting a quote for weekly residential cleaning for my 4-bedroom home.",       date:'March 17, 2024', status:'new'     },
  { id:'2', firstName:'David',   lastName:'Kim',     email:'david.k@corp.com',    phone:'(555) 345-6789', subject:'Request a Quote',  message:"We're looking for a commercial cleaning partner for our 50-person office. Could you send pricing?",  date:'March 16, 2024', status:'read'    },
  { id:'3', firstName:'Maria',   lastName:'Torres',  email:'mtorres@email.com',   phone:'(555) 456-7890', subject:'General Inquiry',  message:'Do you offer eco-friendly cleaning options? I have young children and prefer non-toxic products.',    date:'March 15, 2024', status:'replied' },
  { id:'4', firstName:'Robert',  lastName:'Johnson', email:'rjohnson@email.com',  phone:'(555) 567-8901', subject:'Feedback',         message:'Just wanted to say the team did a fantastic job last week. The apartment looks brand new!',            date:'March 14, 2024', status:'replied' },
  { id:'5', firstName:'Emily',   lastName:'Watson',  email:'emily.w@email.com',   phone:'(555) 678-9012', subject:'Request a Quote',  message:"Moving out next month and need a thorough move-out clean for my apartment. What's your availability?", date:'March 13, 2024', status:'new'     },
  { id:'6', firstName:'Carlos',  lastName:'Mendez',  email:'carlos@biz.com',      phone:'(555) 789-0123', subject:'General Inquiry',  message:'How many cleaners typically come for a 3,000 sq ft office? And do you bring your own supplies?',        date:'March 12, 2024', status:'read'    },
]

// ─── Project Submissions ──────────────────────────────────────────────────────

export type ProjectSubmission = {
  id: string
  projectSlug: string
  projectTitle: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  date: string
  status: 'new' | 'read' | 'contacted'
}

export const projectSubmissions: ProjectSubmission[] = [
  { id:'1', projectSlug:'downtown-office-tower',  projectTitle:'Downtown Office Tower',  name:'Greg Paulson',   email:'greg@techcorp.com',     phone:'(555) 111-2222', service:'Commercial Cleaning',  message:"We have a similar office setup and would love a quote for ongoing maintenance.",              date:'March 17, 2024', status:'new'       },
  { id:'2', projectSlug:'lakeside-luxury-home',   projectTitle:'Lakeside Luxury Home',   name:'Patricia Hall',  email:'patricia@email.com',    phone:'(555) 222-3333', service:'Deep Cleaning',         message:"We just finished renovating our home and need a post-construction clean like this.",           date:'March 15, 2024', status:'contacted' },
  { id:'3', projectSlug:'city-centre-apartments', projectTitle:'City Centre Apartments', name:'Frank Owens',    email:'f.owens@props.com',     phone:'(555) 333-4444', service:'Residential Cleaning',  message:"I manage 20 apartments and need a reliable move-in/out cleaning partner.",                    date:'March 14, 2024', status:'new'       },
  { id:'4', projectSlug:'riverside-restaurant',   projectTitle:'Riverside Restaurant',   name:'Nina Park',      email:'nina@restaurant.com',   phone:'(555) 444-5555', service:'Commercial Cleaning',  message:"We run a busy restaurant and need nightly cleaning. Can you accommodate that schedule?",      date:'March 11, 2024', status:'read'      },
]

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const dashboardStats = {
  monthlyViews:        12480,
  viewsChange:         '+18%',
  totalSubmissions:    6,
  newSubmissions:      2,
  submissionsChange:   '+34%',
  totalProjects:       4,
  totalBlogPosts:      4,
  totalNewsItems:      3,
  newProjectLeads:     2,
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

export type ActivityType = 'create' | 'edit' | 'delete' | 'login' | 'reply'

export type Activity = {
  id: string
  user: string
  action: string
  target: string
  time: string
  type: ActivityType
}

export const recentActivity: Activity[] = [
  { id:'1', user:'Sarah M.',  action:'Published',  target:'Spring Cleaning Guide 2024',    time:'10 min ago',  type:'create' },
  { id:'2', user:'Lisa C.',   action:'Updated',    target:'Downtown Office Tower project', time:'1 hour ago',  type:'edit'   },
  { id:'3', user:'James C.',  action:'Created',    target:'new blog post draft',           time:'2 hours ago', type:'create' },
  { id:'4', user:'Sarah M.',  action:'Replied to', target:"Amanda Roberts' inquiry",       time:'3 hours ago', type:'reply'  },
  { id:'5', user:'Tom H.',    action:'Logged in',  target:'',                              time:'5 hours ago', type:'login'  },
  { id:'6', user:'Lisa C.',   action:'Deleted',    target:'outdated news item',            time:'1 day ago',   type:'delete' },
]

// ─── Page Content (editable) ─────────────────────────────────────────────────

export const homeContent = {
  heroTitle:    'Fresh, Clean &',
  heroGradient: 'Perfectly Yours.',
  heroSub:      'Experience the highest standard of cleanliness with our eco-friendly, meticulous residential and commercial cleaning services.',
  heroCTA:      'Book a Cleaning',
  badge:        'Premium Cleaning Services',
  whyTitle:     'The Spark Clean Difference',
  whySub:       "We don't just clean; we care for your space.",
}

export const aboutContent = {
  heading:    'About Spark Clean',
  subheading: "We're on a mission to create healthier, happier spaces through meticulous cleaning and exceptional service.",
  story1:     'Founded in 2018, Spark Clean began with a simple belief: a clean space is the foundation for a clear mind and a healthy life.',
  story2:     'We noticed a gap in the industry — many services were either affordable but unreliable, or premium but prohibitively expensive.',
  story3:     "Today, our team of dedicated professionals serves hundreds of homes and businesses, bringing our signature sparkle to every corner we touch.",
}

export const servicesContent = {
  heading:    'Our Services',
  subheading: 'Comprehensive cleaning solutions tailored to your specific needs. From daily maintenance to deep cleaning.',
}
