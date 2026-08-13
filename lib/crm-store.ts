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
  socials?: {
    github?: string;
    facebook?: string;
    whatsapp?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
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
  email: string;
  name: string;
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

export const DEFAULT_TECH_STACK: TechStackCMS[] = [];

declare global {
  var _crmStore: (CMSJSONDatabase & { adminPasscode: string }) | undefined;
}

function getInitialDatabase(): CMSJSONDatabase {
  return {
    services: [],
    team: [],
    projects: [],
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
      address: "Bangalore & Mysore, India / Remote",
      passcode: "123456",
      socials: {
        github: "https://github.com/VnjVibhash",
        facebook: "https://facebook.com/Vivekajee",
        whatsapp: "https://wa.me/917762974716",
        twitter: "https://twitter.com/Vnjvibhash",
        linkedin: "https://linkedin.com/in/Vivekajee",
        instagram: "https://instagram.com/Vivekajee",
        portfolioUrl: "https://vivekajee.com",
        website: "https://vivekajee.com"
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
  // Pure Firestore state synchronization
}

function persistState() {
  // Pure Firestore state persistence
}

// Getters & Utilities

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

export function addProject(data: Omit<ProjectCRM, 'id'>): ProjectCRM {
  if (!Array.isArray(crmStore.projects)) crmStore.projects = [];
  const newProj: ProjectCRM = {
    ...data,
    id: `proj-${Date.now()}`
  };
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

export function addClient(data: Omit<Client, 'id' | 'createdAt'>): Client {
  if (!Array.isArray(crmStore.clients)) crmStore.clients = [];
  const newClient: Client = {
    ...data,
    id: `cli-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  crmStore.clients.unshift(newClient);
  persistState();
  return newClient;
}

export function addServiceCMS(data: Omit<ServiceCMS, 'id'>): ServiceCMS {
  if (!Array.isArray(crmStore.services)) crmStore.services = [];
  const newSrv: ServiceCMS = {
    ...data,
    id: `srv-${Date.now()}`
  };
  crmStore.services.unshift(newSrv);
  persistState();
  return newSrv;
}

export function updateServiceCMS(id: string, updates: Partial<ServiceCMS>): ServiceCMS | null {
  if (!Array.isArray(crmStore.services)) crmStore.services = [];
  const index = crmStore.services.findIndex(s => s.id === id);
  if (index === -1) return null;
  crmStore.services[index] = { ...crmStore.services[index], ...updates };
  persistState();
  return crmStore.services[index];
}

export function deleteServiceCMS(id: string): boolean {
  if (!Array.isArray(crmStore.services)) crmStore.services = [];
  const len = crmStore.services.length;
  crmStore.services = crmStore.services.filter(s => s.id !== id);
  persistState();
  return crmStore.services.length < len;
}

export function addTeamMemberCMS(data: Omit<TeamMemberCMS, 'id'>): TeamMemberCMS {
  if (!Array.isArray(crmStore.team)) crmStore.team = [];
  const newMember: TeamMemberCMS = {
    ...data,
    id: `team-${Date.now()}`
  };
  crmStore.team.push(newMember);
  persistState();
  return newMember;
}

export function updateTeamMemberCMS(id: string, updates: Partial<TeamMemberCMS>): TeamMemberCMS | null {
  if (!Array.isArray(crmStore.team)) crmStore.team = [];
  const index = crmStore.team.findIndex(m => m.id === id);
  if (index === -1) return null;
  crmStore.team[index] = { ...crmStore.team[index], ...updates };
  persistState();
  return crmStore.team[index];
}

export function deleteTeamMemberCMS(id: string): boolean {
  if (!Array.isArray(crmStore.team)) crmStore.team = [];
  const len = crmStore.team.length;
  crmStore.team = crmStore.team.filter(m => m.id !== id);
  persistState();
  return crmStore.team.length < len;
}

export function addFAQCMS(data: Omit<FAQItemCMS, 'id'>): FAQItemCMS {
  if (!Array.isArray(crmStore.faqs)) crmStore.faqs = [];
  const newFaq: FAQItemCMS = {
    ...data,
    id: `faq-${Date.now()}`
  };
  crmStore.faqs.push(newFaq);
  persistState();
  return newFaq;
}

export function updateFAQCMS(id: string, updates: Partial<FAQItemCMS>): FAQItemCMS | null {
  if (!Array.isArray(crmStore.faqs)) crmStore.faqs = [];
  const index = crmStore.faqs.findIndex(f => f.id === id);
  if (index === -1) return null;
  crmStore.faqs[index] = { ...crmStore.faqs[index], ...updates };
  persistState();
  return crmStore.faqs[index];
}

export function deleteFAQCMS(id: string): boolean {
  if (!Array.isArray(crmStore.faqs)) crmStore.faqs = [];
  const len = crmStore.faqs.length;
  crmStore.faqs = crmStore.faqs.filter(f => f.id !== id);
  persistState();
  return crmStore.faqs.length < len;
}

export function addFeatureCMS(data: Omit<FeatureCMS, 'id'>): FeatureCMS {
  if (!Array.isArray(crmStore.features)) crmStore.features = [];
  const newFeat: FeatureCMS = {
    ...data,
    id: `feat-${Date.now()}`
  };
  crmStore.features.push(newFeat);
  persistState();
  return newFeat;
}

export function updateFeatureCMS(id: string, updates: Partial<FeatureCMS>): FeatureCMS | null {
  if (!Array.isArray(crmStore.features)) crmStore.features = [];
  const index = crmStore.features.findIndex(f => f.id === id);
  if (index === -1) return null;
  crmStore.features[index] = { ...crmStore.features[index], ...updates };
  persistState();
  return crmStore.features[index];
}

export function deleteFeatureCMS(id: string): boolean {
  if (!Array.isArray(crmStore.features)) crmStore.features = [];
  const len = crmStore.features.length;
  crmStore.features = crmStore.features.filter(f => f.id !== id);
  persistState();
  return crmStore.features.length < len;
}

export function addPortfolioCMS(data: Omit<PortfolioItemCMS, 'id'>): PortfolioItemCMS {
  if (!Array.isArray(crmStore.portfolio)) crmStore.portfolio = [];
  const newItem: PortfolioItemCMS = {
    ...data,
    id: `port-${Date.now()}`
  };
  crmStore.portfolio.push(newItem);
  persistState();
  return newItem;
}

export function updatePortfolioCMS(id: string, updates: Partial<PortfolioItemCMS>): PortfolioItemCMS | null {
  if (!Array.isArray(crmStore.portfolio)) crmStore.portfolio = [];
  const index = crmStore.portfolio.findIndex(p => p.id === id);
  if (index === -1) return null;
  crmStore.portfolio[index] = { ...crmStore.portfolio[index], ...updates };
  persistState();
  return crmStore.portfolio[index];
}

export function deletePortfolioCMS(id: string): boolean {
  if (!Array.isArray(crmStore.portfolio)) crmStore.portfolio = [];
  const len = crmStore.portfolio.length;
  crmStore.portfolio = crmStore.portfolio.filter(p => p.id !== id);
  persistState();
  return crmStore.portfolio.length < len;
}

export function addOpenSourceProjectCMS(data: Omit<OpenSourceProjectCMS, 'id'>): OpenSourceProjectCMS {
  if (!Array.isArray(crmStore.openSourceProjects)) crmStore.openSourceProjects = [];
  const newItem: OpenSourceProjectCMS = {
    ...data,
    id: `os-${Date.now()}`
  };
  crmStore.openSourceProjects.push(newItem);
  persistState();
  return newItem;
}

export function updateOpenSourceProjectCMS(id: string, updates: Partial<OpenSourceProjectCMS>): OpenSourceProjectCMS | null {
  if (!Array.isArray(crmStore.openSourceProjects)) crmStore.openSourceProjects = [];
  const index = crmStore.openSourceProjects.findIndex(p => p.id === id);
  if (index === -1) return null;
  crmStore.openSourceProjects[index] = { ...crmStore.openSourceProjects[index], ...updates };
  persistState();
  return crmStore.openSourceProjects[index];
}

export function deleteOpenSourceProjectCMS(id: string): boolean {
  if (!Array.isArray(crmStore.openSourceProjects)) crmStore.openSourceProjects = [];
  const len = crmStore.openSourceProjects.length;
  crmStore.openSourceProjects = crmStore.openSourceProjects.filter(p => p.id !== id);
  persistState();
  return crmStore.openSourceProjects.length < len;
}

export function addTimelineCMS(data: Omit<TimelineCMS, 'id'>): TimelineCMS {
  if (!Array.isArray(crmStore.timeline)) crmStore.timeline = [];
  const newMilestone: TimelineCMS = {
    ...data,
    id: `time-${Date.now()}`
  };
  crmStore.timeline.push(newMilestone);
  persistState();
  return newMilestone;
}

export function updateTimelineCMS(id: string, updates: Partial<TimelineCMS>): TimelineCMS | null {
  if (!Array.isArray(crmStore.timeline)) crmStore.timeline = [];
  const index = crmStore.timeline.findIndex(t => t.id === id);
  if (index === -1) return null;
  crmStore.timeline[index] = { ...crmStore.timeline[index], ...updates };
  persistState();
  return crmStore.timeline[index];
}

export function deleteTimelineCMS(id: string): boolean {
  if (!Array.isArray(crmStore.timeline)) crmStore.timeline = [];
  const len = crmStore.timeline.length;
  crmStore.timeline = crmStore.timeline.filter(t => t.id !== id);
  persistState();
  return crmStore.timeline.length < len;
}

export function addTechStackCMS(data: Omit<TechStackCMS, 'id'>): TechStackCMS {
  if (!Array.isArray(crmStore.techStack)) crmStore.techStack = [];
  const newTech: TechStackCMS = {
    ...data,
    id: `tech-${Date.now()}`
  };
  crmStore.techStack.push(newTech);
  persistState();
  return newTech;
}

export function updateTechStackCMS(id: string, updates: Partial<TechStackCMS>): TechStackCMS | null {
  if (!Array.isArray(crmStore.techStack)) crmStore.techStack = [];
  const index = crmStore.techStack.findIndex(t => t.id === id);
  if (index === -1) return null;
  crmStore.techStack[index] = { ...crmStore.techStack[index], ...updates };
  persistState();
  return crmStore.techStack[index];
}

export function deleteTechStackCMS(id: string): boolean {
  if (!Array.isArray(crmStore.techStack)) crmStore.techStack = [];
  const len = crmStore.techStack.length;
  crmStore.techStack = crmStore.techStack.filter(t => t.id !== id);
  persistState();
  return crmStore.techStack.length < len;
}

export function updateSettingsCMS(updates: Partial<AgencySettingsCMS>): AgencySettingsCMS {
  crmStore.settings = {
    ...crmStore.settings,
    ...updates,
    socials: {
      ...crmStore.settings.socials,
      ...updates.socials
    }
  };
  persistState();
  return crmStore.settings;
}

export function getAdminUsersCMS(): AdminUserCMS[] {
  syncFromDisk();
  return Array.isArray(crmStore.adminUsers) ? crmStore.adminUsers : [];
}

export function updateAdminUserRole(emailOrId: string, role: 'admin' | 'user'): boolean {
  if (!Array.isArray(crmStore.adminUsers)) crmStore.adminUsers = [];
  const index = crmStore.adminUsers.findIndex(u => u.id === emailOrId || u.email === emailOrId);
  if (index !== -1) {
    crmStore.adminUsers[index].role = role;
    persistState();
    return true;
  }
  return false;
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
