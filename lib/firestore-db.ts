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

/**
 * Generic Firestore collection fetcher
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
 * Generic Firestore document fetcher
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
