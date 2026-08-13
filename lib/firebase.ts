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
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  Firestore,
  collection,
  query,
  orderBy,
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

const DATABASE_ID = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || "default";

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

// Lazy Firestore instance explicitly targeting the custom "default" database ID
let dbInstance: Firestore | null = null;

export const getFirestoreDb = (): Firestore | null => {
  if (!dbInstance) {
    try {
      if (DATABASE_ID && DATABASE_ID !== 'default' && DATABASE_ID !== '(default)') {
        dbInstance = getFirestore(app, DATABASE_ID);
      } else {
        dbInstance = getFirestore(app);
      }
    } catch (err: any) {
      try {
        dbInstance = getFirestore(app);
      } catch (fallbackErr: any) {
        console.warn('Firestore connection note:', fallbackErr?.message || fallbackErr);
        return null;
      }
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

export interface FirestoreUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string | null;
  role: 'admin' | 'user';
  status: string;
  provider: string;
  createdAt?: any;
  lastLoginAt?: any;
}

/**
 * Creates or updates a user document in the Firestore 'users' collection for first-time / returning users.
 * Returns the latest user record with their current assigned role directly from Firestore.
 */
export const syncUserToFirestore = async (user: User): Promise<{ isNewUser: boolean; user: FirestoreUser } | null> => {
  if (!user?.uid) return null;

  try {
    const db = getFirestoreDb();
    if (!db) return null;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef).catch(() => null);

    const defaultAdminEmails = [
      'innovateria.in@gmail.com',
      'vivekajee@gmail.com'
    ];
    const userEmail = (user.email || '').trim().toLowerCase();
    const isPrimaryOwner = defaultAdminEmails.includes(userEmail);

    if (!userSnap || !userSnap.exists()) {
      // First-time user: Create new user document in 'users' collection with 'user' role
      const initialRole: 'admin' | 'user' = isPrimaryOwner ? 'admin' : 'user';
      const newUserData: FirestoreUser = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Google User',
        photoURL: user.photoURL || '',
        phoneNumber: user.phoneNumber || null,
        role: initialRole,
        status: 'active',
        provider: user.providerData?.[0]?.providerId || 'google.com',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      };

      await setDoc(userRef, newUserData).catch((err) => {
        console.warn('Firestore setDoc notice:', err?.message || err);
      });
      return { isNewUser: true, user: newUserData };
    } else {
      // Returning user: Preserve assigned role from Firestore document
      const existingData = userSnap.data() as FirestoreUser;
      const assignedRole: 'admin' | 'user' = isPrimaryOwner ? 'admin' : (existingData.role || 'user');

      const updates: any = {
        lastLoginAt: serverTimestamp(),
        displayName: user.displayName || existingData.displayName || 'Google User',
        photoURL: user.photoURL || existingData.photoURL || '',
        role: assignedRole
      };

      await updateDoc(userRef, updates).catch(() => {});
      return { 
        isNewUser: false, 
        user: { 
          ...existingData, 
          ...updates,
          uid: user.uid,
          email: user.email || existingData.email,
          role: assignedRole
        } 
      };
    }
  } catch (error: any) {
    console.warn('Firestore user sync note:', error?.message || error);
    return null;
  }
};

/**
 * Fetches all registered users from the Firestore 'users' collection.
 */
export const getFirestoreUsers = async (): Promise<FirestoreUser[]> => {
  const db = getFirestoreDb();
  if (!db) return [];

  try {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, orderBy('lastLoginAt', 'desc'));
    const snapshot = await getDocs(q).catch(() => getDocs(usersCol));

    const usersList: FirestoreUser[] = [];
    snapshot.forEach((d) => {
      const data = d.data() as FirestoreUser;
      usersList.push({
        ...data,
        uid: d.id,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        lastLoginAt: data.lastLoginAt?.toDate ? data.lastLoginAt.toDate().toISOString() : data.lastLoginAt
      });
    });

    return usersList;
  } catch (err: any) {
    console.warn('Error reading users from Firestore:', err?.message || err);
    return [];
  }
};

/**
 * Updates a user's role directly in the Firestore 'users' collection.
 */
export const updateFirestoreUserRole = async (uid: string, newRole: 'admin' | 'user'): Promise<boolean> => {
  const db = getFirestoreDb();
  if (!db || !uid) return false;

  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      role: newRole,
      roleUpdatedAt: serverTimestamp()
    });
    return true;
  } catch (err: any) {
    console.error('Error updating user role in Firestore:', err);
    return false;
  }
};

/**
 * Syncs all technology stack items directly to Cloud Firestore 'techStack' collection.
 */
export const syncTechStackToFirestore = async (techItems: any[]): Promise<{ success: boolean; count: number }> => {
  const db = getFirestoreDb();
  if (!db) throw new Error('Cloud Firestore database is not initialized.');

  let count = 0;
  for (const item of techItems) {
    const docId = String(item.id || `tech-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
    const docRef = doc(db, 'techStack', docId);
    await setDoc(docRef, {
      ...item,
      id: docId,
      _syncedAt: serverTimestamp()
    }, { merge: true });
    count++;
  }

  return { success: true, count };
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
  getDocs,
  setDoc, 
  updateDoc, 
  collection, 
  writeBatch, 
  serverTimestamp, 
  analyticsInstance as analytics 
};
export type { User };
export default app;
