import { 
  getFirestoreDb, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  collection, 
  serverTimestamp 
} from '@/lib/firebase';
import { onSnapshot } from 'firebase/firestore';
import { 
  ServiceCMS, 
  ProjectCRM, 
  Lead, 
  Client, 
  TeamMemberCMS, 
  FAQItemCMS, 
  FeatureCMS, 
  PortfolioItemCMS, 
  TimelineCMS, 
  HeroStatCMS, 
  TechStackCMS, 
  CoreValueCMS, 
  ProcessStepCMS, 
  AgencySettingsCMS, 
  OpenSourceProjectCMS,
  AdminUserCMS
} from '@/lib/crm-store';

/**
 * Generic Firestore collection fetcher using getDocs snapshot
 */
export async function fetchFirestoreCollection<T>(collectionName: string): Promise<T[]> {
  try {
    const db = getFirestoreDb();
    if (!db) return [];

    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef).catch(() => null);
    if (!snapshot || snapshot.empty) return [];

    const items: T[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        ...data
      } as T);
    });

    return items;
  } catch (error) {
    console.warn(`Firestore read error on '${collectionName}':`, error);
    return [];
  }
}

/**
 * Generic Firestore document fetcher using getDoc snapshot
 */
export async function fetchFirestoreDoc<T>(collectionName: string, docId: string): Promise<T | null> {
  try {
    const db = getFirestoreDb();
    if (!db) return null;

    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef).catch(() => null);
    if (!snap || !snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data()
    } as T;
  } catch (error) {
    console.warn(`Firestore read doc error on '${collectionName}/${docId}':`, error);
    return null;
  }
}

/**
 * Generic Firestore document creator/updater
 */
export async function saveFirestoreDoc<T extends Record<string, any>>(
  collectionName: string, 
  docId: string, 
  data: T
): Promise<T> {
  const db = getFirestoreDb();
  if (!db) throw new Error('Firestore not initialized');

  const docRef = doc(db, collectionName, docId);
  const payload = {
    ...data,
    id: docId,
    _updatedAt: serverTimestamp()
  };

  await setDoc(docRef, payload, { merge: true });
  return payload as T;
}

/**
 * Generic Firestore document deleter
 */
export async function deleteFirestoreDocument(collectionName: string, docId: string): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const { deleteDoc } = await import('firebase/firestore');
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Firestore delete error on '${collectionName}/${docId}':`, error);
    return false;
  }
}

/**
 * Real-time Firestore collection snapshot listener
 */
export function subscribeFirestoreCollection<T>(
  collectionName: string,
  callback: (items: T[]) => void
): () => void {
  const db = getFirestoreDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  try {
    const colRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items: T[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as T);
        });
        callback(items);
      },
      (error) => {
        console.warn(`Firestore snapshot subscription error on '${collectionName}':`, error);
        callback([]);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn(`Firestore snapshot setup error on '${collectionName}':`, error);
    callback([]);
    return () => {};
  }
}

/**
 * Real-time Firestore document snapshot listener
 */
export function subscribeFirestoreDoc<T>(
  collectionName: string,
  docId: string,
  callback: (item: T | null) => void
): () => void {
  const db = getFirestoreDb();
  if (!db) {
    callback(null);
    return () => {};
  }

  try {
    const docRef = doc(db, collectionName, docId);
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (!snap.exists()) {
          callback(null);
          return;
        }
        callback({ id: snap.id, ...snap.data() } as T);
      },
      (error) => {
        console.warn(`Firestore doc snapshot error on '${collectionName}/${docId}':`, error);
        callback(null);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn(`Firestore doc snapshot setup error on '${collectionName}/${docId}':`, error);
    callback(null);
    return () => {};
  }
}

/* ============================================================================
   DIRECT CLOUD FIRESTORE SNAPSHOT & COLLECTION FETCHERS (PURE FIRESTORE)
   ============================================================================ */

export async function getFirestoreServices(): Promise<ServiceCMS[]> {
  return await fetchFirestoreCollection<ServiceCMS>('services');
}

export async function getFirestoreProjects(): Promise<ProjectCRM[]> {
  const items = await fetchFirestoreCollection<ProjectCRM>('projects');
  return items.map(p => ({
    id: p.id || `proj-${Math.random().toString(36).substring(2, 9)}`,
    title: p.title || 'Untitled Project',
    clientName: p.clientName || 'Private Client',
    clientEmail: p.clientEmail || '',
    category: p.category || 'App Development',
    techStack: Array.isArray(p.techStack) ? p.techStack : [],
    status: (((p.status as any) === 'in_progress' ? 'in_development' : p.status) || 'in_development') as ProjectCRM['status'],
    budget: p.budget || '₹1,50,000',
    progress: typeof p.progress === 'number' ? p.progress : 50,
    startDate: p.startDate || new Date().toISOString().split('T')[0],
    deadline: p.deadline || '',
    image: p.image || '/assets/img/services/soft.png',
    featured: p.featured ?? true,
    showInHeader: p.showInHeader ?? false,
    github: p.github || '',
    desc: p.desc || '',
    bullets: Array.isArray(p.bullets) ? p.bullets : []
  }));
}

export async function getFirestoreTechStack(): Promise<TechStackCMS[]> {
  return await fetchFirestoreCollection<TechStackCMS>('techStack');
}

export async function getFirestoreTeam(): Promise<TeamMemberCMS[]> {
  return await fetchFirestoreCollection<TeamMemberCMS>('team');
}

export async function getFirestoreFAQs(): Promise<FAQItemCMS[]> {
  return await fetchFirestoreCollection<FAQItemCMS>('faqs');
}

export async function getFirestoreFeatures(): Promise<FeatureCMS[]> {
  return await fetchFirestoreCollection<FeatureCMS>('features');
}

export async function getFirestorePortfolio(): Promise<PortfolioItemCMS[]> {
  return await fetchFirestoreCollection<PortfolioItemCMS>('portfolio');
}

export async function getFirestoreTimeline(): Promise<TimelineCMS[]> {
  return await fetchFirestoreCollection<TimelineCMS>('timeline');
}

export async function getFirestoreOpenSource(): Promise<OpenSourceProjectCMS[]> {
  return await fetchFirestoreCollection<OpenSourceProjectCMS>('openSourceProjects');
}

export async function getFirestoreStats(): Promise<HeroStatCMS[]> {
  return await fetchFirestoreCollection<HeroStatCMS>('heroStats');
}

export async function getFirestoreValues(): Promise<CoreValueCMS[]> {
  return await fetchFirestoreCollection<CoreValueCMS>('values');
}

export async function getFirestoreProcess(): Promise<ProcessStepCMS[]> {
  return await fetchFirestoreCollection<ProcessStepCMS>('processSteps');
}

export async function getFirestoreSettings(): Promise<AgencySettingsCMS> {
  const settingsDoc = await fetchFirestoreDoc<AgencySettingsCMS>('settings', 'agency');
  return settingsDoc || {
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
  };
}
