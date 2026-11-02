import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  Firestore,
  setDoc
} from 'firebase/firestore';
import { ClientRecord, AgencyConfig, FirebaseConfigState } from '@/types';
import { initialClients, defaultAgencyConfig } from './sampleData';

const FIREBASE_CONFIG_STORAGE_KEY = 'usman_travel_firebase_credentials';
const CLIENTS_COLLECTION = 'umrah_clients';
const SETTINGS_COLLECTION = 'agency_settings';

// Default environment credentials if set
const envConfig: FirebaseConfigState = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
};

// Check if user has saved credentials in browser
export function getSavedFirebaseConfig(): FirebaseConfigState {
  if (typeof window === 'undefined') return envConfig;
  try {
    const saved = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading saved Firebase config:', e);
  }
  return envConfig;
}

export function saveFirebaseConfig(config: FirebaseConfigState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  }
}

export function isFirebaseConfigured(config?: FirebaseConfigState): boolean {
  const cfg = config || getSavedFirebaseConfig();
  return Boolean(cfg.apiKey && cfg.projectId && cfg.appId);
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getFirebaseInstance(): { app: FirebaseApp | null; db: Firestore | null } {
  const config = getSavedFirebaseConfig();
  if (!isFirebaseConfigured(config)) {
    return { app: null, db: null };
  }

  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    db = getFirestore(app);
    return { app, db };
  } catch (error) {
    console.warn('Firebase initialization error, using local fallback:', error);
    return { app: null, db: null };
  }
}

// Local Storage Fallback Helpers
const LOCAL_STORAGE_CLIENTS_KEY = 'usman_travel_clients_data';
const LOCAL_STORAGE_AGENCY_KEY = 'usman_travel_agency_config';

export function getLocalClients(): ClientRecord[] {
  if (typeof window === 'undefined') return initialClients;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CLIENTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_CLIENTS_KEY, JSON.stringify(initialClients));
      return initialClients;
    }
    return JSON.parse(raw);
  } catch {
    return initialClients;
  }
}

export function saveLocalClients(clients: ClientRecord[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_CLIENTS_KEY, JSON.stringify(clients));
  }
}

export function getLocalAgencyConfig(): AgencyConfig {
  if (typeof window === 'undefined') return defaultAgencyConfig;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_AGENCY_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_AGENCY_KEY, JSON.stringify(defaultAgencyConfig));
      return defaultAgencyConfig;
    }
    return JSON.parse(raw);
  } catch {
    return defaultAgencyConfig;
  }
}

export function saveLocalAgencyConfig(config: AgencyConfig): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_AGENCY_KEY, JSON.stringify(config));
  }
}

// Data Access Layer: Firestore with automatic LocalStorage Synchronization
export async function fetchClients(): Promise<{ clients: ClientRecord[]; isCloud: boolean }> {
  const { db } = getFirebaseInstance();
  if (!db) {
    return { clients: getLocalClients(), isCloud: false };
  }

  try {
    const q = query(collection(db, CLIENTS_COLLECTION), orderBy('serialNo', 'asc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Seed Firestore with initial demo data if empty
      const local = getLocalClients();
      for (const item of local) {
        await addDoc(collection(db, CLIENTS_COLLECTION), item);
      }
      return { clients: local, isCloud: true };
    }

    const clients: ClientRecord[] = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    } as ClientRecord));

    saveLocalClients(clients);
    return { clients, isCloud: true };
  } catch (error) {
    console.warn('Firestore fetch failed, falling back to local storage:', error);
    return { clients: getLocalClients(), isCloud: false };
  }
}

export async function addClient(client: Omit<ClientRecord, 'id'>): Promise<ClientRecord> {
  const { db } = getFirebaseInstance();
  const newClientData: ClientRecord = {
    ...client,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db) {
    try {
      const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), newClientData);
      const created = { ...newClientData, id: docRef.id };
      
      // Update local storage cache
      const current = getLocalClients();
      saveLocalClients([created, ...current]);
      return created;
    } catch (e) {
      console.warn('Firestore addDoc failed, writing locally:', e);
    }
  }

  // Local fallback
  const id = `client-${Date.now()}`;
  const localCreated = { ...newClientData, id };
  const current = getLocalClients();
  saveLocalClients([localCreated, ...current]);
  return localCreated;
}

export async function updateClient(id: string, updates: Partial<ClientRecord>): Promise<ClientRecord> {
  const { db } = getFirebaseInstance();
  const updatedPayload = {
    ...updates,
    updatedAt: new Date().toISOString()
  };

  if (db && !id.startsWith('client-')) {
    try {
      const docRef = doc(db, CLIENTS_COLLECTION, id);
      await updateDoc(docRef, updatedPayload);
    } catch (e) {
      console.warn('Firestore updateDoc failed, writing locally:', e);
    }
  }

  // Update local
  const current = getLocalClients();
  const updatedList = current.map(item => item.id === id ? { ...item, ...updatedPayload } : item);
  saveLocalClients(updatedList);
  return updatedList.find(c => c.id === id)!;
}

export async function deleteClient(id: string): Promise<void> {
  const { db } = getFirebaseInstance();

  if (db && !id.startsWith('client-')) {
    try {
      await deleteDoc(doc(db, CLIENTS_COLLECTION, id));
    } catch (e) {
      console.warn('Firestore deleteDoc failed:', e);
    }
  }

  const current = getLocalClients();
  saveLocalClients(current.filter(c => c.id !== id));
}

// Agency Config Operations
export async function fetchAgencyConfig(): Promise<AgencyConfig> {
  const { db } = getFirebaseInstance();
  if (!db) {
    return getLocalAgencyConfig();
  }

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'default_config');
    const snapshot = await getDocs(collection(db, SETTINGS_COLLECTION));
    if (!snapshot.empty) {
      return snapshot.docs[0].data() as AgencyConfig;
    }
    return getLocalAgencyConfig();
  } catch {
    return getLocalAgencyConfig();
  }
}

export async function saveAgencyConfig(config: AgencyConfig): Promise<void> {
  saveLocalAgencyConfig(config);
  const { db } = getFirebaseInstance();
  if (db) {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, 'default_config');
      await setDoc(docRef, config);
    } catch (e) {
      console.warn('Could not save agency config to Firestore:', e);
    }
  }
}
