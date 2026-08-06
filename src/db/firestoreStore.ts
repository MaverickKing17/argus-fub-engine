import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Tenant, Lead, Message } from '../types.js';

const app = getApps().length === 0 ? initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
}) : getApps()[0];

export const firestoreDb = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Firestore Collection Names
export const TENANTS_COLLECTION = 'tenants';
export const LEADS_COLLECTION = 'leads';
export const MESSAGES_COLLECTION = 'messages';

// Helper functions for Firestore persistence
export async function saveTenantToFirestore(tenant: Tenant): Promise<void> {
  try {
    const docRef = doc(firestoreDb, TENANTS_COLLECTION, tenant.id);
    await setDoc(docRef, tenant, { merge: true });
  } catch (err) {
    console.error('Error saving tenant to Firestore:', err);
  }
}

export async function saveLeadToFirestore(lead: Lead): Promise<void> {
  try {
    const docRef = doc(firestoreDb, LEADS_COLLECTION, lead.id);
    await setDoc(docRef, lead, { merge: true });
  } catch (err) {
    console.error('Error saving lead to Firestore:', err);
  }
}

export async function saveMessageToFirestore(message: Message): Promise<void> {
  try {
    const docRef = doc(firestoreDb, MESSAGES_COLLECTION, message.id);
    await setDoc(docRef, message, { merge: true });
  } catch (err) {
    console.error('Error saving message to Firestore:', err);
  }
}

export async function fetchTenantsFromFirestore(): Promise<Tenant[]> {
  try {
    const querySnapshot = await getDocs(collection(firestoreDb, TENANTS_COLLECTION));
    const tenants: Tenant[] = [];
    querySnapshot.forEach((doc) => {
      tenants.push(doc.data() as Tenant);
    });
    return tenants;
  } catch (err) {
    console.error('Error fetching tenants from Firestore:', err);
    return [];
  }
}

export async function fetchLeadsFromFirestore(): Promise<Lead[]> {
  try {
    const querySnapshot = await getDocs(collection(firestoreDb, LEADS_COLLECTION));
    const leads: Lead[] = [];
    querySnapshot.forEach((doc) => {
      leads.push(doc.data() as Lead);
    });
    return leads;
  } catch (err) {
    console.error('Error fetching leads from Firestore:', err);
    return [];
  }
}

export async function fetchMessagesFromFirestore(): Promise<Message[]> {
  try {
    const querySnapshot = await getDocs(collection(firestoreDb, MESSAGES_COLLECTION));
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data() as Message);
    });
    return messages;
  } catch (err) {
    console.error('Error fetching messages from Firestore:', err);
    return [];
  }
}
