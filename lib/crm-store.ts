import fs from 'fs';
import path from 'path';

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
  socials: {
    github: string;
    facebook: string;
    whatsapp: string;
    twitter: string;
    linkedin: string;
    instagram: string;
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
}

const JSON_FILE_PATH = path.join(process.cwd(), 'data', 'cms-data.json');

function loadJSONData(): CMSJSONDatabase {
  try {
    if (fs.existsSync(JSON_FILE_PATH)) {
      const raw = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
      if (raw && raw.trim().length > 0) {
        const parsed = JSON.parse(raw);
        return {
          services: Array.isArray(parsed.services) ? parsed.services : [],
          team: Array.isArray(parsed.team) ? parsed.team : [],
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          portfolio: Array.isArray(parsed.portfolio) ? parsed.portfolio : [],
          openSourceProjects: Array.isArray(parsed.openSourceProjects) ? parsed.openSourceProjects : [],
          features: Array.isArray(parsed.features) ? parsed.features : [],
          faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
          leads: Array.isArray(parsed.leads) ? parsed.leads : [],
          clients: Array.isArray(parsed.clients) ? parsed.clients : [],
          timeline: Array.isArray(parsed.timeline) ? parsed.timeline : [],
          heroStats: Array.isArray(parsed.heroStats) ? parsed.heroStats : [],
          techStack: Array.isArray(parsed.techStack) ? parsed.techStack : [],
          values: Array.isArray(parsed.values) ? parsed.values : [],
          processSteps: Array.isArray(parsed.processSteps) ? parsed.processSteps : [],
          settings: parsed.settings || {
            agencyName: 'Innovateria Software Solutions',
            adminEmail: 'innovateria.in@gmail.com',
            phone: '+91-7762974716',
            address: 'Bangalore & Mysore, India',
            passcode: '123456',
            socials: {
              github: 'https://github.com/VnjVibhash',
              facebook: 'https://facebook.com/Vivekajee',
              whatsapp: 'https://wa.me/917762974716',
              twitter: 'https://twitter.com/Vnjvibhash',
              linkedin: 'https://linkedin.com/in/Vivekajee',
              instagram: 'https://instagram.com/Vivekajee'
            }
          }
        };
      }
    }
  } catch (err) {
    console.error('Error reading data/cms-data.json:', err);
  }

  // Fallback to in-memory store if available
  if (global._crmStore) {
    return {
      services: global._crmStore.services || [],
      team: global._crmStore.team || [],
      projects: global._crmStore.projects || [],
      portfolio: global._crmStore.portfolio || [],
      openSourceProjects: global._crmStore.openSourceProjects || [],
      features: global._crmStore.features || [],
      faqs: global._crmStore.faqs || [],
      leads: global._crmStore.leads || [],
      clients: global._crmStore.clients || [],
      timeline: global._crmStore.timeline || [],
      heroStats: global._crmStore.heroStats || [],
      techStack: global._crmStore.techStack || [],
      values: global._crmStore.values || [],
      processSteps: global._crmStore.processSteps || [],
      settings: global._crmStore.settings
    };
  }

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
    settings: {
      agencyName: 'Innovateria Software Solutions',
      adminEmail: 'innovateria.in@gmail.com',
      phone: '+91-7762974716',
      address: 'Bangalore & Mysore, India',
      passcode: '123456',
      socials: {
        github: 'https://github.com/VnjVibhash',
        facebook: 'https://facebook.com/Vivekajee',
        whatsapp: 'https://wa.me/917762974716',
        twitter: 'https://twitter.com/Vnjvibhash',
        linkedin: 'https://linkedin.com/in/Vivekajee',
        instagram: 'https://instagram.com/Vivekajee'
      }
    }
  };
}

function saveJSONData(data: CMSJSONDatabase) {
  try {
    const dir = path.dirname(JSON_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempFilePath = `${JSON_FILE_PATH}.tmp`;
    fs.writeFileSync(tempFilePath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFilePath, JSON_FILE_PATH);
  } catch (err) {
    console.error('Error writing to data/cms-data.json:', err);
  }
}

declare global {
  var _crmStore: (CMSJSONDatabase & { adminPasscode: string }) | undefined;
}

if (!global._crmStore) {
  const diskData = loadJSONData();
  global._crmStore = {
    ...diskData,
    services: Array.isArray(diskData.services) ? diskData.services : [],
    team: Array.isArray(diskData.team) ? diskData.team : [],
    projects: Array.isArray(diskData.projects) ? diskData.projects : [],
    portfolio: Array.isArray(diskData.portfolio) ? diskData.portfolio : [],
    openSourceProjects: Array.isArray(diskData.openSourceProjects) ? diskData.openSourceProjects : [],
    features: Array.isArray(diskData.features) ? diskData.features : [],
    faqs: Array.isArray(diskData.faqs) ? diskData.faqs : [],
    leads: Array.isArray(diskData.leads) ? diskData.leads : [],
    clients: Array.isArray(diskData.clients) ? diskData.clients : [],
    timeline: Array.isArray(diskData.timeline) ? diskData.timeline : [],
    heroStats: Array.isArray(diskData.heroStats) ? diskData.heroStats : [],
    techStack: Array.isArray(diskData.techStack) ? diskData.techStack : [],
    values: Array.isArray(diskData.values) ? diskData.values : [],
    processSteps: Array.isArray(diskData.processSteps) ? diskData.processSteps : [],
    adminPasscode: diskData.settings?.passcode || '123456'
  };
}

export const crmStore = global._crmStore;

function persistState() {
  saveJSONData({
    services: crmStore.services || [],
    team: crmStore.team || [],
    projects: crmStore.projects || [],
    portfolio: crmStore.portfolio || [],
    openSourceProjects: crmStore.openSourceProjects || [],
    features: crmStore.features || [],
    faqs: crmStore.faqs || [],
    leads: crmStore.leads || [],
    clients: crmStore.clients || [],
    timeline: crmStore.timeline || [],
    heroStats: crmStore.heroStats || [],
    techStack: crmStore.techStack || [],
    values: crmStore.values || [],
    processSteps: crmStore.processSteps || [],
    settings: crmStore.settings
  });
}

// Getters
function syncFromDisk() {
  const disk = loadJSONData();
  if (disk.services && disk.services.length > 0) crmStore.services = disk.services;
  if (disk.team && disk.team.length > 0) crmStore.team = disk.team;
  if (disk.projects && disk.projects.length > 0) crmStore.projects = disk.projects;
  if (disk.portfolio && disk.portfolio.length > 0) crmStore.portfolio = disk.portfolio;
  if (disk.openSourceProjects && Array.isArray(disk.openSourceProjects)) crmStore.openSourceProjects = disk.openSourceProjects;
  if (disk.features && disk.features.length > 0) crmStore.features = disk.features;
  if (disk.faqs && disk.faqs.length > 0) crmStore.faqs = disk.faqs;
  if (disk.leads && Array.isArray(disk.leads)) crmStore.leads = disk.leads;
  if (disk.clients && Array.isArray(disk.clients)) crmStore.clients = disk.clients;
  if (disk.timeline && disk.timeline.length > 0) crmStore.timeline = disk.timeline;
  if (disk.heroStats && disk.heroStats.length > 0) crmStore.heroStats = disk.heroStats;
  if (disk.techStack && disk.techStack.length > 0) crmStore.techStack = disk.techStack;
  if (disk.values && disk.values.length > 0) crmStore.values = disk.values;
  if (disk.processSteps && disk.processSteps.length > 0) crmStore.processSteps = disk.processSteps;
  if (disk.settings) crmStore.settings = disk.settings;
}

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
