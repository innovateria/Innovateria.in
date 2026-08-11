import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { 
  getAuth, 
  initializeAuth,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  browserPopupRedirectResolver,
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  Auth,
  User 
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Firestore,
  collection,
  writeBatch
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDhYUgOMEgmt1wENGNrQ4c0gvPVKJrTNaI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "innovateria.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "innovateria",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "innovateria.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "366296805053",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:366296805053:web:1bd7b98c7a4999cace11d4",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-DHD7XX7R9Q"
};

// Initialize Firebase using singleton pattern (safe for Next.js SSR and client)
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth with resilient multi-persistence fallback
let auth: Auth;
if (typeof window !== 'undefined') {
  try {
    auth = initializeAuth(app, {
      persistence: [browserLocalPersistence, browserSessionPersistence, inMemoryPersistence],
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch (e) {
    auth = getAuth(app);
  }
} else {
  auth = getAuth(app);
}

// Lazy Firestore instance getter to prevent continuous background reconnection if Firestore is not yet created in console
let dbInstance: Firestore | null = null;

export const getFirestoreDb = (): Firestore | null => {
  if (typeof window === 'undefined') return null;
  if (!dbInstance) {
    try {
      dbInstance = getFirestore(app);
    } catch (err: any) {
      console.warn('Firestore initialization deferred:', err?.message || err);
      return null;
    }
  }
  return dbInstance;
};

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

let analyticsInstance: Analytics | null = null;
let analyticsPromise: Promise<Analytics | null> | null = null;

// Initialize Analytics on client-side safely with IndexedDB protection
export const initAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === 'undefined') return null;
  if (analyticsInstance) return analyticsInstance;
  if (analyticsPromise) return analyticsPromise;

  analyticsPromise = (async () => {
    try {
      if (typeof window.indexedDB === 'undefined') {
        return null;
      }

      const supported = await isSupported().catch(() => false);
      if (supported) {
        analyticsInstance = getAnalytics(app);
        return analyticsInstance;
      }
    } catch (err: any) {
      if (
        err?.message?.includes('Database is closing') ||
        err?.message?.includes('closing/hidden') ||
        err?.name === 'InvalidStateError'
      ) {
        return null;
      }
      console.warn('Firebase Analytics notice:', err?.message || err);
    }
    return null;
  })();

  return analyticsPromise;
};

/**
 * Creates or updates a user document in the Firestore 'users' collection for first-time / returning users.
 */
export const syncUserToFirestore = async (user: User) => {
  if (!user?.uid) return null;

  try {
    const db = getFirestoreDb();
    if (!db) return null;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef).catch(() => null);

    const defaultAdminEmails = [
      'innovateria.in@gmail.com',
      'vivekajee@gmail.com',
      'vnjvibhash@gmail.com'
    ];
    const userEmail = (user.email || '').trim().toLowerCase();
    const isDefaultAdmin = defaultAdminEmails.includes(userEmail);

    if (!userSnap || !userSnap.exists()) {
      // First-time user: Create new user document in 'users' collection
      const newUserData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Google User',
        photoURL: user.photoURL || '',
        phoneNumber: user.phoneNumber || null,
        role: isDefaultAdmin ? 'admin' : 'user',
        status: 'active',
        provider: user.providerData?.[0]?.providerId || 'google.com',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      };

      await setDoc(userRef, newUserData).catch((err) => {
        if (err?.message?.includes('not found') || err?.code === 'not-found') {
          console.warn('Note: Cloud Firestore database has not been enabled in Firebase Console yet.');
        }
      });
      return { isNewUser: true, data: newUserData };
    } else {
      // Returning user: Update lastLoginAt and latest profile details
      const existingData = userSnap.data();
      const updates: any = {
        lastLoginAt: serverTimestamp(),
        displayName: user.displayName || existingData.displayName,
        photoURL: user.photoURL || existingData.photoURL
      };

      if (isDefaultAdmin && existingData.role !== 'admin') {
        updates.role = 'admin';
      }

      await updateDoc(userRef, updates).catch(() => {});
      return { isNewUser: false, data: { ...existingData, ...updates } };
    }
  } catch (error: any) {
    if (error?.message?.includes('Database') && error?.message?.includes('not found')) {
      console.warn('Note: Cloud Firestore database not provisioned in Firebase Console.');
    }
    return null;
  }
};

/**
 * Syncs all Admin Panel CMS data collections to Firebase Firestore.
 */
export const syncAllCMSDataToFirestore = async (cmsData: any) => {
  const db = getFirestoreDb();
  if (!db || !cmsData) {
    throw new Error('Cloud Firestore database is not yet enabled in your Firebase Console. Go to Firebase Console -> Build -> Firestore Database -> Create database.');
  }

  const collections = [
    'services',
    'team',
    'projects',
    'portfolio',
    'openSourceProjects',
    'features',
    'faqs',
    'leads',
    'clients',
    'timeline',
    'heroStats',
    'techStack',
    'values',
    'processSteps',
    'adminUsers'
  ];

  const results: Record<string, number> = {};

  try {
    // 1. Sync array collections
    for (const colName of collections) {
      const items = cmsData[colName];
      if (Array.isArray(items) && items.length > 0) {
        let count = 0;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const docId = String(item.id || item.uid || item.step || item.label || `${colName}-${i + 1}`);
          const docRef = doc(db, colName, docId);
          
          await setDoc(docRef, {
            ...item,
            _syncedAt: serverTimestamp()
          }, { merge: true });
          
          count++;
        }
        results[colName] = count;
      }
    }

    // 2. Sync agency settings document
    if (cmsData.settings) {
      const settingsRef = doc(db, 'settings', 'agency_settings');
      await setDoc(settingsRef, {
        ...cmsData.settings,
        _syncedAt: serverTimestamp()
      }, { merge: true });
      results['settings'] = 1;
    }

    return {
      success: true,
      syncedAt: new Date().toISOString(),
      results
    };
  } catch (err: any) {
    if (err?.message?.includes('Database') && err?.message?.includes('not found')) {
      throw new Error('Database (default) not found. Please enable Cloud Firestore in your Firebase Console (Build > Firestore Database > Create database).');
    }
    throw err;
  }
};

export { 
  app, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  writeBatch,
  serverTimestamp,
  analyticsInstance as analytics 
};
export type { User };
export default app;
