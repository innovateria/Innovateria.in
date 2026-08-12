
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'contacted' | 'proposal_sent' | 'won' | 'lost' | 'archived';
  notes?: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCRM {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  category: string;
  techStack: string[];
  status: 'discovery' | 'in_development' | 'beta_testing' | 'completed' | 'on_hold';
  budget: string;
  progress: number;
  startDate: string;
  deadline: string;
  image?: string;
  featured?: boolean;
  showInHeader?: boolean;
  github?: string;
  desc?: string;
  bullets?: string[];
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  projectsCount: number;
  totalSpent: string;
  status: 'active' | 'inactive' | 'lead';
  avatar?: string;
  createdAt: string;
}

export interface ServiceCMS {
  id: string;
  title: string;
  category: string;
  slug: string;
  iconName: string;
  description: string;
  features: string[];
  status: 'active' | 'draft';
  image?: string;
  longDescription?: string[];
  methodology?: { title: string; desc: string }[];
  faqs?: { q: string; a: string }[];
  techStack?: string[];
}

export interface TeamMemberCMS {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  bio: string;
  image: string;
  skills: string[];
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface FAQItemCMS {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Services' | 'Pricing' | 'Technical';
}

export interface FeatureCMS {
  id: string;
  title: string;
  category: string;
  tagline: string;
  desc: string;
  bullets: string[];
  iconName: string;
}

export interface PortfolioItemCMS {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
  desc: string;
}

export interface TimelineCMS {
  id: string;
  period: string;
  title: string;
  company?: string;
  institution?: string;
  location: string;
  type: 'education' | 'experience';
  iconName: string;
  details: string[];
}

export interface HeroStatCMS {
  label: string;
  value: string;
  desc: string;
}

export interface TechStackCMS {
  id: string;
  name: string;
  category: string;
  image: string;
  description?: string;
  status: 'active' | 'draft';
}

export interface CoreValueCMS {
  title: string;
  desc: string;
}

export interface ProcessStepCMS {
  step: string;
  title: string;
  desc: string;
}

export interface AgencySettingsCMS {
  agencyName: string;
  adminEmail: string;
  phone: string;
  address: string;
  passcode: string;
  portfolioUrl?: string;
  website?: string;
  socials: {
    github: string;
    facebook: string;
    whatsapp: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    portfolioUrl?: string;
    website?: string;
  };
}

export interface OpenSourceProjectCMS {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  githubUrl: string;
  liveDemoUrl?: string;
  stars?: number;
  forks?: number;
  featured?: boolean;
}

export interface AdminUserCMS {
  id: string;
  uid?: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLoginAt: string;
}

export interface CMSJSONDatabase {
  services: ServiceCMS[];
  team: TeamMemberCMS[];
  projects: ProjectCRM[];
  portfolio: PortfolioItemCMS[];
  openSourceProjects: OpenSourceProjectCMS[];
  features: FeatureCMS[];
  faqs: FAQItemCMS[];
  leads: Lead[];
  clients: Client[];
  timeline: TimelineCMS[];
  heroStats: HeroStatCMS[];
  techStack: TechStackCMS[];
  values: CoreValueCMS[];
  processSteps: ProcessStepCMS[];
  settings: AgencySettingsCMS;
  adminUsers?: AdminUserCMS[];
}

declare global {
  var _crmStore: (CMSJSONDatabase & { adminPasscode: string }) | undefined;
}

function getInitialDatabase(): CMSJSONDatabase {
  return {
    services: [
      {
        id: "srv-1",
        title: "Mobile App Development (iOS & Android)",
        category: "Mobile Solutions",
        slug: "mobile",
        iconName: "Smartphone",
        description: "High-performance Flutter, Native Android (Kotlin) & iOS mobile apps engineered for blazing speed, offline data sync, payment gateways, and Play Store/App Store dominance.",
        features: [
          "Native Android (Kotlin) & iOS Swift Engineering",
          "Cross-Platform Flutter & React Native Solutions",
          "Real-Time Push Notifications & In-App Messaging",
          "Secure Payment Gateways (Stripe, Razorpay, UPI)",
          "Offline Local Caching & Firebase Realtime Sync",
          "Location Tracking, Google Maps & Bluetooth APIs",
          "Full Play Store & Apple App Store Deployment"
        ],
        status: "active"
      },
      {
        id: "srv-2",
        title: "Enterprise Software & SaaS Engineering",
        category: "Software Architecture",
        slug: "software",
        iconName: "Code2",
        description: "Custom Enterprise ERPs, CRM platforms, POS billing automation, LMS portals, and high-throughput microservice backends built with Next.js, Laravel, and Cloud Infrastructure.",
        features: [
          "Custom Enterprise Resource Planning (ERP) Solutions",
          "Customer Relationship Management (CRM) Systems",
          "Point-of-Sale (POS) & Automated Billing Software",
          "School, LMS & Manufacturing Management Portals",
          "High-Throughput REST APIs & Microservices Architecture",
          "Automated Business Workflows & Analytics Dashboards",
          "Bank-Grade Encryption & Role-Based Access Control"
        ],
        status: "active"
      },
      {
        id: "srv-3",
        title: "Web Application & Full-Stack Development",
        category: "Web Engineering",
        slug: "web",
        iconName: "Globe2",
        description: "Ultra-fast responsive web applications, B2B/B2C E-Commerce portals, multi-vendor marketplaces, and Headless CMS architectures built with Next.js 14, React, Tailwind CSS, and Node.js.",
        features: [
          "Next.js 14 & React Full-Stack Web Development",
          "B2B, B2C & Multi-Vendor E-Commerce Platforms",
          "Custom Dynamic Web Portals & High-Converting Landing Pages",
          "Server-Side Rendering (SSR) & Instant Page Speed",
          "Headless CMS & Content System Integration",
          "Progressive Web App (PWA) Mobile Capabilities",
          "Responsive Glassmorphic UI/UX Engineering"
        ],
        status: "active"
      },
      {
        id: "srv-4",
        title: "SEO & Technical Search Dominance",
        category: "Growth & SEO",
        slug: "seo-services",
        iconName: "Search",
        description: "Data-driven technical SEO, Schema markup, high-intent keyword ranking, local Google Business Profile optimization, and organic traffic strategies designed to dominate search engine results.",
        features: [
          "Complete Technical SEO & Website Speed Audits",
          "On-Page Keyword Optimization & Schema Markup",
          "Google Business Profile (GBP) & Local SEO Dominance",
          "High-Intent Keyword Research & Competitor Mapping",
          "White-Hat Organic Backlink & Authority Building",
          "Google Search Console & GA4 Analytics Tracking",
          "Guaranteed Page 1 Ranking Growth Strategies"
        ],
        status: "active"
      },
      {
        id: "srv-5",
        title: "Logo & Brand Identity Engineering",
        category: "Brand Identity",
        slug: "logo",
        iconName: "Palette",
        description: "Stunning vector logos, custom brand identity systems, social media kit assets, corporate brochures, and modern UI/UX design tokens crafted to make your business memorable.",
        features: [
          "Custom Vector Logo & Brand Identity Systems",
          "UI/UX Design Systems & Interactive Prototypes",
          "Corporate Brochures, Pamphlets & Company Profiles",
          "Social Media Banners & Digital Marketing Creatives",
          "Digital Visiting Cards & Brand Guidelines",
          "High-Resolution Print & Merchandise Graphic Kits"
        ],
        status: "active"
      },
      {
        id: "srv-6",
        title: "Strategic Performance Digital Marketing",
        category: "Growth & Performance",
        slug: "digital-marketing",
        iconName: "TrendingUp",
        description: "High-ROI Pay-Per-Click (PPC) ad campaigns, Meta & LinkedIn social media marketing, WhatsApp automation, and automated conversion pipelines designed for maximum lead acquisition.",
        features: [
          "Targeted Google Ads & PPC Search Campaign Management",
          "Social Media Marketing (Meta, LinkedIn, Instagram)",
          "Conversion Rate Optimization (CRO) & Funnel Design",
          "WhatsApp Automation & Direct Customer Messaging",
          "High-Converting Sales Funnels & Lead Generation",
          "Monthly ROI & Transparent Growth Analytics Reports"
        ],
        status: "active"
      }
    ],
    team: [
      {
        id: "team-1",
        name: "Vivek Kumar (Viveka Jee)",
        role: "Founder & Lead Software Engineer",
        company: "Innovateria",
        location: "Bangalore, IN / Remote",
        bio: "Full-stack software engineer & founder specializing in Flutter, React, Next.js, Android (Java/Kotlin), and Laravel APIs. Gold Medalist at Chandigarh University & 1st Runner-Up at Rajasthan IT Day Hackathon 2023.",
        image: "/assets/img/team/vivekajee.png",
        skills: [
          "Flutter",
          "Next.js",
          "React Native",
          "Android (Java/Kotlin)",
          "Laravel",
          "Firebase",
          "MongoDB",
          "RESTful APIs",
          "Node.js",
          "PostgreSQL",
          "RazorPay",
          "PHP"
        ],
        github: "https://github.com/Vnjvibhash",
        linkedin: "https://www.linkedin.com/in/vivekajee",
        twitter: "https://twitter.com/Vnjvibhash",
        website: "https://vivekajee.com"
      }
    ],
    projects: [
      {
        id: "proj-active-1",
        title: "FinTech Pay – UPI Gateway 💳",
        clientName: "Rohan Saxena",
        clientEmail: "rohan@fintech-pay.in",
        category: "Web Application & Full-Stack Development",
        techStack: [
          "Python",
          "FastAPI",
          "UPI Intent",
          "PostgreSQL"
        ],
        status: "in_development",
        budget: "₹3,50,000",
        progress: 80,
        startDate: "2026-07-15",
        deadline: "2026-08-20",
        image: "/assets/img/services/soft.png",
        featured: true,
        github: "https://github.com/Vnjvibhash/fastapi-upi-gateway",
        desc: "High throughput backend API microservice for Razorpay, Paytm, and UPI intent flow with automated webhook callbacks.",
        bullets: [
          "Built asynchronous Python FastAPI engine",
          "Webhook signature verification & callback logs",
          "Automated PDF e-invoicing generation"
        ],
        showInHeader: true
      }
    ],
    portfolio: [],
    openSourceProjects: [],
    features: [],
    faqs: [],
    leads: [],
    clients: [],
    timeline: [],
    heroStats: [],
    techStack: [],
    values: [],
    processSteps: [],
    adminUsers: [],
    settings: {
      agencyName: "Innovateria Software Solutions",
      adminEmail: "innovateria.in@gmail.com",
      phone: "+91-7762974716",
      address: "Bangalore & Mysore, India",
      passcode: "123456",
      portfolioUrl: "https://vivekajee.com",
      website: "https://vivekajee.com",
      socials: {
        github: "https://github.com/VnjVibhash",
        facebook: "https://facebook.com/Vivekajee",
        whatsapp: "https://wa.me/917762974716",
        twitter: "https://twitter.com/Vnjvibhash",
        linkedin: "https://linkedin.com/in/Vivekajee",
        instagram: "https://instagram.com/Vivekajee"
      }
    }
  };
}

if (!global._crmStore) {
  const initial = getInitialDatabase();
  global._crmStore = {
    ...initial,
    adminPasscode: initial.settings.passcode || '123456'
  };
}

export const crmStore = global._crmStore!;

export function syncFromDisk() {
  // Pure Firestore in-memory state synchronization
}

function persistState() {
  // Pure Firestore in-memory state persistence
}

// Getters

export function sanitizeProjectCategory(category: string, techStack: string[] = []): string {
  const hasJavaOrKotlin = techStack.some(t => /java|kotlin/i.test(t));
  const hasFlutterOrRN = techStack.some(t => /flutter|react native|dart/i.test(t));
  const isMobileAppCategory = /native android|android app|app development|mobile app|cross-platform/i.test(category);
  
  if (isMobileAppCategory || hasJavaOrKotlin || hasFlutterOrRN) {
    if (hasFlutterOrRN) {
      return 'Mobile App Development (iOS & Android)';
    }
    if (hasJavaOrKotlin) {
      return 'Native Android App Development';
    }
  }
  return category;
}

export function getLeads(): Lead[] { syncFromDisk(); return Array.isArray(crmStore.leads) ? crmStore.leads : []; }
export function getProjects(): ProjectCRM[] { 
  syncFromDisk(); 
  const list = Array.isArray(crmStore.projects) ? crmStore.projects : []; 
  const sanitizedList = list.map(p => ({
    ...p,
    category: sanitizeProjectCategory(p.category, p.techStack)
  }));
  return [...sanitizedList].sort((a, b) => (b.showInHeader ? 1 : 0) - (a.showInHeader ? 1 : 0));
}
export function getProjectById(id: string): ProjectCRM | undefined { syncFromDisk(); const projects = getProjects(); return projects.find(p => p.id === id); }
export function getClients(): Client[] { syncFromDisk(); return Array.isArray(crmStore.clients) ? crmStore.clients : []; }
export function getServicesCMS(): ServiceCMS[] { syncFromDisk(); return Array.isArray(crmStore.services) ? crmStore.services : []; }
export function getServiceBySlugCMS(slug: string): ServiceCMS | undefined { syncFromDisk(); const services = getServicesCMS(); return services.find(s => s.slug === slug); }
export function getTeamCMS(): TeamMemberCMS[] { syncFromDisk(); return Array.isArray(crmStore.team) ? crmStore.team : []; }
export function getFAQsCMS(): FAQItemCMS[] { syncFromDisk(); return Array.isArray(crmStore.faqs) ? crmStore.faqs : []; }
export function getFeaturesCMS(): FeatureCMS[] { syncFromDisk(); return Array.isArray(crmStore.features) ? crmStore.features : []; }
export function getPortfolioCMS(): PortfolioItemCMS[] { syncFromDisk(); return Array.isArray(crmStore.portfolio) ? crmStore.portfolio : []; }
export function getOpenSourceProjectsCMS(): OpenSourceProjectCMS[] { 
  syncFromDisk(); 
  return Array.isArray(crmStore.openSourceProjects) ? crmStore.openSourceProjects : [];
}
export function getTimelineCMS(): TimelineCMS[] { syncFromDisk(); return Array.isArray(crmStore.timeline) ? crmStore.timeline : []; }
export function getHeroStatsCMS(): HeroStatCMS[] { syncFromDisk(); return Array.isArray(crmStore.heroStats) ? crmStore.heroStats : []; }
export function getTechStackCMS(): TechStackCMS[] { syncFromDisk(); return Array.isArray(crmStore.techStack) ? crmStore.techStack : []; }
export function getCompanyValuesCMS(): CoreValueCMS[] { syncFromDisk(); return Array.isArray(crmStore.values) ? crmStore.values : []; }
export function getProcessStepsCMS(): ProcessStepCMS[] { syncFromDisk(); return Array.isArray(crmStore.processSteps) ? crmStore.processSteps : []; }
export function getSettingsCMS(): AgencySettingsCMS { syncFromDisk(); return crmStore.settings; }

// Mutators
export function addLead(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: Lead['status'] }): Lead {
  if (!Array.isArray(crmStore.leads)) crmStore.leads = [];
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
    status: data.status || 'new',
    notes: data.notes || '',
    source: data.source || 'Website Contact Form',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  crmStore.leads.unshift(newLead);
  persistState();
  return newLead;
}

export function updateLead(id: string, updates: Partial<Lead>): Lead | null {
  if (!Array.isArray(crmStore.leads)) crmStore.leads = [];
  const index = crmStore.leads.findIndex(l => l.id === id);
  if (index === -1) return null;
  crmStore.leads[index] = { ...crmStore.leads[index], ...updates, updatedAt: new Date().toISOString() };
  persistState();
  return crmStore.leads[index];
}

export function deleteLead(id: string): boolean {
  if (!Array.isArray(crmStore.leads)) crmStore.leads = [];
  const len = crmStore.leads.length;
  crmStore.leads = crmStore.leads.filter(l => l.id !== id);
  persistState();
  return crmStore.leads.length < len;
}

export function addProject(project: Omit<ProjectCRM, 'id'>): ProjectCRM {
  if (!Array.isArray(crmStore.projects)) crmStore.projects = [];
  const newProj: ProjectCRM = { ...project, id: `proj-${Date.now()}` };
  crmStore.projects.unshift(newProj);
  persistState();
  return newProj;
}

export function updateProject(id: string, updates: Partial<ProjectCRM>): ProjectCRM | null {
  if (!Array.isArray(crmStore.projects)) crmStore.projects = [];
  const index = crmStore.projects.findIndex(p => p.id === id);
  if (index === -1) return null;
  crmStore.projects[index] = { ...crmStore.projects[index], ...updates };
  persistState();
  return crmStore.projects[index];
}

export function deleteProject(id: string): boolean {
  if (!Array.isArray(crmStore.projects)) crmStore.projects = [];
  const len = crmStore.projects.length;
  crmStore.projects = crmStore.projects.filter(p => p.id !== id);
  persistState();
  return crmStore.projects.length < len;
}

export function addClient(client: Omit<Client, 'id' | 'createdAt'>): Client {
  if (!Array.isArray(crmStore.clients)) crmStore.clients = [];
  const newClient: Client = { ...client, id: `client-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
  crmStore.clients.unshift(newClient);
  persistState();
  return newClient;
}

export function addServiceCMS(service: Omit<ServiceCMS, 'id'>): ServiceCMS {
  if (!Array.isArray(crmStore.services)) crmStore.services = [];
  const newSrv: ServiceCMS = { ...service, id: `srv-${Date.now()}` };
  crmStore.services.push(newSrv);
  persistState();
  return newSrv;
}

export function updateServiceCMS(id: string, updates: Partial<ServiceCMS>): ServiceCMS | null {
  if (!Array.isArray(crmStore.services)) crmStore.services = [];
  const idx = crmStore.services.findIndex(s => s.id === id);
  if (idx === -1) return null;
  crmStore.services[idx] = { ...crmStore.services[idx], ...updates };
  persistState();
  return crmStore.services[idx];
}

export function deleteServiceCMS(id: string): boolean {
  if (!Array.isArray(crmStore.services)) crmStore.services = [];
  const len = crmStore.services.length;
  crmStore.services = crmStore.services.filter(s => s.id !== id);
  persistState();
  return crmStore.services.length < len;
}

export function addTeamMemberCMS(member: Omit<TeamMemberCMS, 'id'>): TeamMemberCMS {
  if (!Array.isArray(crmStore.team)) crmStore.team = [];
  const newMember: TeamMemberCMS = { ...member, id: `team-${Date.now()}` };
  crmStore.team.push(newMember);
  persistState();
  return newMember;
}

export function updateTeamMemberCMS(id: string, updates: Partial<TeamMemberCMS>): TeamMemberCMS | null {
  if (!Array.isArray(crmStore.team)) crmStore.team = [];
  const idx = crmStore.team.findIndex(t => t.id === id);
  if (idx === -1) return null;
  crmStore.team[idx] = { ...crmStore.team[idx], ...updates };
  persistState();
  return crmStore.team[idx];
}

export function deleteTeamMemberCMS(id: string): boolean {
  if (!Array.isArray(crmStore.team)) crmStore.team = [];
  const len = crmStore.team.length;
  crmStore.team = crmStore.team.filter(t => t.id !== id);
  persistState();
  return crmStore.team.length < len;
}

export function addFAQCMS(faq: Omit<FAQItemCMS, 'id'>): FAQItemCMS {
  if (!Array.isArray(crmStore.faqs)) crmStore.faqs = [];
  const newFaq: FAQItemCMS = { ...faq, id: `faq-${Date.now()}` };
  crmStore.faqs.push(newFaq);
  persistState();
  return newFaq;
}

export function updateFAQCMS(id: string, updates: Partial<FAQItemCMS>): FAQItemCMS | null {
  if (!Array.isArray(crmStore.faqs)) crmStore.faqs = [];
  const idx = crmStore.faqs.findIndex(f => f.id === id);
  if (idx === -1) return null;
  crmStore.faqs[idx] = { ...crmStore.faqs[idx], ...updates };
  persistState();
  return crmStore.faqs[idx];
}

export function deleteFAQCMS(id: string): boolean {
  if (!Array.isArray(crmStore.faqs)) crmStore.faqs = [];
  const len = crmStore.faqs.length;
  crmStore.faqs = crmStore.faqs.filter(f => f.id !== id);
  persistState();
  return crmStore.faqs.length < len;
}

export function addFeatureCMS(feature: Omit<FeatureCMS, 'id'>): FeatureCMS {
  if (!Array.isArray(crmStore.features)) crmStore.features = [];
  const newFeat: FeatureCMS = { ...feature, id: `feat-${Date.now()}` };
  crmStore.features.push(newFeat);
  persistState();
  return newFeat;
}

export function updateFeatureCMS(id: string, updates: Partial<FeatureCMS>): FeatureCMS | null {
  if (!Array.isArray(crmStore.features)) crmStore.features = [];
  const idx = crmStore.features.findIndex(f => f.id === id);
  if (idx === -1) return null;
  crmStore.features[idx] = { ...crmStore.features[idx], ...updates };
  persistState();
  return crmStore.features[idx];
}

export function deleteFeatureCMS(id: string): boolean {
  if (!Array.isArray(crmStore.features)) crmStore.features = [];
  const len = crmStore.features.length;
  crmStore.features = crmStore.features.filter(f => f.id !== id);
  persistState();
  return crmStore.features.length < len;
}

export function addPortfolioCMS(item: Omit<PortfolioItemCMS, 'id'>): PortfolioItemCMS {
  if (!Array.isArray(crmStore.portfolio)) crmStore.portfolio = [];
  const newItem: PortfolioItemCMS = { ...item, id: `port-${Date.now()}` };
  crmStore.portfolio.push(newItem);
  persistState();
  return newItem;
}

export function updatePortfolioCMS(id: string, updates: Partial<PortfolioItemCMS>): PortfolioItemCMS | null {
  if (!Array.isArray(crmStore.portfolio)) crmStore.portfolio = [];
  const idx = crmStore.portfolio.findIndex(p => p.id === id);
  if (idx === -1) return null;
  crmStore.portfolio[idx] = { ...crmStore.portfolio[idx], ...updates };
  persistState();
  return crmStore.portfolio[idx];
}

export function deletePortfolioCMS(id: string): boolean {
  if (!Array.isArray(crmStore.portfolio)) crmStore.portfolio = [];
  const len = crmStore.portfolio.length;
  crmStore.portfolio = crmStore.portfolio.filter(p => p.id !== id);
  persistState();
  return crmStore.portfolio.length < len;
}

export function addTechStackCMS(item: Omit<TechStackCMS, 'id'>): TechStackCMS {
  if (!Array.isArray(crmStore.techStack)) crmStore.techStack = [];
  const newItem: TechStackCMS = { ...item, id: `tech-${Date.now()}` };
  crmStore.techStack.push(newItem);
  persistState();
  return newItem;
}

export function updateTechStackCMS(id: string, updates: Partial<TechStackCMS>): TechStackCMS | null {
  if (!Array.isArray(crmStore.techStack)) crmStore.techStack = [];
  const idx = crmStore.techStack.findIndex(t => t.id === id);
  if (idx === -1) return null;
  crmStore.techStack[idx] = { ...crmStore.techStack[idx], ...updates };
  persistState();
  return crmStore.techStack[idx];
}

export function deleteTechStackCMS(id: string): boolean {
  if (!Array.isArray(crmStore.techStack)) crmStore.techStack = [];
  const len = crmStore.techStack.length;
  crmStore.techStack = crmStore.techStack.filter(t => t.id !== id);
  persistState();
  return crmStore.techStack.length < len;
}

export function addTimelineCMS(item: Omit<TimelineCMS, 'id'>): TimelineCMS {
  if (!Array.isArray(crmStore.timeline)) crmStore.timeline = [];
  const newItem: TimelineCMS = { ...item, id: `time-${Date.now()}` };
  crmStore.timeline.push(newItem);
  persistState();
  return newItem;
}

export function updateTimelineCMS(id: string, updates: Partial<TimelineCMS>): TimelineCMS | null {
  if (!Array.isArray(crmStore.timeline)) crmStore.timeline = [];
  const idx = crmStore.timeline.findIndex(t => t.id === id);
  if (idx === -1) return null;
  crmStore.timeline[idx] = { ...crmStore.timeline[idx], ...updates };
  persistState();
  return crmStore.timeline[idx];
}

export function deleteTimelineCMS(id: string): boolean {
  if (!Array.isArray(crmStore.timeline)) crmStore.timeline = [];
  const len = crmStore.timeline.length;
  crmStore.timeline = crmStore.timeline.filter(t => t.id !== id);
  persistState();
  return crmStore.timeline.length < len;
}

export function updateSettingsCMS(updates: Partial<AgencySettingsCMS>): AgencySettingsCMS {
  crmStore.settings = { ...crmStore.settings, ...updates };
  if (updates.passcode) crmStore.adminPasscode = updates.passcode;
  persistState();
  return crmStore.settings;
}

export function addOpenSourceProjectCMS(item: Omit<OpenSourceProjectCMS, 'id'>): OpenSourceProjectCMS {
  if (!Array.isArray(crmStore.openSourceProjects)) crmStore.openSourceProjects = [];
  const newItem: OpenSourceProjectCMS = { ...item, id: `os-${Date.now()}` };
  crmStore.openSourceProjects.unshift(newItem);
  persistState();
  return newItem;
}

export function updateOpenSourceProjectCMS(id: string, updates: Partial<OpenSourceProjectCMS>): OpenSourceProjectCMS | null {
  if (!Array.isArray(crmStore.openSourceProjects)) crmStore.openSourceProjects = [];
  const idx = crmStore.openSourceProjects.findIndex(o => o.id === id);
  if (idx === -1) return null;
  crmStore.openSourceProjects[idx] = { ...crmStore.openSourceProjects[idx], ...updates };
  persistState();
  return crmStore.openSourceProjects[idx];
}

export function deleteOpenSourceProjectCMS(id: string): boolean {
  if (!Array.isArray(crmStore.openSourceProjects)) crmStore.openSourceProjects = [];
  const len = crmStore.openSourceProjects.length;
  crmStore.openSourceProjects = crmStore.openSourceProjects.filter(o => o.id !== id);
  persistState();
  return crmStore.openSourceProjects.length < len;
}

export function getCRMStats() {
  const leads = getLeads();
  const projects = getProjects();
  const clients = getClients();

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const wonLeads = leads.filter(l => l.status === 'won').length;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  const activeProjects = projects.filter(p => p.status === 'in_development' || p.status === 'beta_testing').length;

  return {
    totalLeads,
    newLeads,
    wonLeads,
    conversionRate,
    activeProjects,
    totalClients: clients.length,
    totalProjects: projects.length,
    projectedRevenue: '₹12,40,000'
  };
}

export function getAdminUsersCMS(): AdminUserCMS[] {
  syncFromDisk();
  return Array.isArray(crmStore.adminUsers) ? crmStore.adminUsers : [];
}

export function findOrRegisterAdminUser(userData: {
  uid?: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}): { user: AdminUserCMS; isAdmin: boolean } {
  syncFromDisk();
  if (!Array.isArray(crmStore.adminUsers)) {
    crmStore.adminUsers = [];
  }

  const normalizedEmail = (userData.email || '').trim().toLowerCase();
  
  // Check known superadmin emails
  const defaultAdminEmails = [
    'innovateria.in@gmail.com',
    'vivekajee@gmail.com',
    'vnjvibhash@gmail.com'
  ];

  let user = crmStore.adminUsers.find(
    u => u.email.trim().toLowerCase() === normalizedEmail
  );

  const isDefaultAdmin = defaultAdminEmails.includes(normalizedEmail);

  if (user) {
    // Update existing user login and profile info
    user.lastLoginAt = new Date().toISOString();
    if (userData.uid) user.uid = userData.uid;
    if (userData.displayName) user.displayName = userData.displayName;
    if (userData.photoURL) user.photoURL = userData.photoURL;
    if (isDefaultAdmin && user.role !== 'admin') {
      user.role = 'admin';
    }
  } else {
    // Register new user
    user = {
      id: `usr-${Date.now()}`,
      uid: userData.uid || '',
      email: userData.email,
      displayName: userData.displayName || 'Google User',
      photoURL: userData.photoURL || '',
      role: isDefaultAdmin ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    crmStore.adminUsers.push(user);
  }

  persistState();
  return {
    user,
    isAdmin: user.role === 'admin'
  };
}

export function updateAdminUserRole(emailOrId: string, role: 'admin' | 'user'): boolean {
  syncFromDisk();
  if (!Array.isArray(crmStore.adminUsers)) return false;

  const target = emailOrId.trim().toLowerCase();
  const user = crmStore.adminUsers.find(
    u => u.id === emailOrId || u.email.trim().toLowerCase() === target
  );

  if (!user) return false;

  user.role = role;
  persistState();
  return true;
}
