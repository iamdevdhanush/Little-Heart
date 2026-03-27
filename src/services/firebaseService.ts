import { auth, db } from '../lib/firebase';
import { 
  doc, getDoc, setDoc, collection, query, where, getDocs, 
  onSnapshot, addDoc, serverTimestamp, orderBy 
} from 'firebase/firestore';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { UserProfile } from '../data/mockData';

// Fallback to localStorage if Firebase is not configured
const isFirebaseReady = () => !!auth && !!db;

export const signUpWithEmail = async (email: string, pass: string) => {
  if (!isFirebaseReady()) {
    console.warn("Firebase not configured. Using mock auth.");
    return { uid: 'mock-user-123', email };
  }
  try {
    const result = await createUserWithEmailAndPassword(auth!, email, pass);
    return result.user;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, pass: string) => {
  if (!isFirebaseReady()) {
    console.warn("Firebase not configured. Using mock auth.");
    return { uid: 'mock-user-123', email };
  }
  try {
    const result = await signInWithEmailAndPassword(auth!, email, pass);
    return result.user;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  if (!isFirebaseReady()) {
    console.warn("Firebase not configured. Using mock auth.");
    return { uid: 'mock-user-123', email: 'mock@example.com' };
  }
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth!, provider);
    return result.user;
  } catch (error) {
    console.error("Auth error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  if (!isFirebaseReady()) return;
  await signOut(auth!);
};

export const saveUserProfile = async (userId: string, profile: UserProfile) => {
  if (!isFirebaseReady()) {
    localStorage.setItem('heartbeat_user', JSON.stringify(profile));
    return;
  }
  try {
    await setDoc(doc(db!, 'users', userId), profile);
  } catch (error) {
    console.error("Error saving profile:", error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!isFirebaseReady()) {
    const local = localStorage.getItem('heartbeat_user');
    return local ? JSON.parse(local) : null;
  }
  try {
    const docSnap = await getDoc(doc(db!, 'users', userId));
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

export const saveMedicalReport = async (userId: string, reportData: any) => {
  if (!isFirebaseReady()) {
    const reports = JSON.parse(localStorage.getItem('heartbeat_reports') || '[]');
    reports.push({ ...reportData, id: Date.now().toString(), createdAt: new Date().toISOString() });
    localStorage.setItem('heartbeat_reports', JSON.stringify(reports));
    return;
  }
  try {
    await addDoc(collection(db!, 'users', userId, 'reports'), {
      ...reportData,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving report:", error);
    throw error;
  }
};

export const subscribeToReports = (userId: string, callback: (reports: any[]) => void) => {
  if (!isFirebaseReady()) {
    const reports = JSON.parse(localStorage.getItem('heartbeat_reports') || '[]');
    callback(reports);
    return () => {};
  }
  
  const q = query(collection(db!, 'users', userId, 'reports'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(reports);
  }, (error) => {
    console.error("Error subscribing to reports:", error);
  });
};

export const saveDailyChecklist = async (userId: string, date: string, tasks: any[]) => {
  if (!isFirebaseReady()) {
    localStorage.setItem(`heartbeat_checklist_${date}`, JSON.stringify(tasks));
    return;
  }
  try {
    await setDoc(doc(db!, 'users', userId, 'checklists', date), { tasks });
  } catch (error) {
    console.error("Error saving checklist:", error);
  }
};

export const getDailyChecklist = async (userId: string, date: string): Promise<any[]> => {
  if (!isFirebaseReady()) {
    const local = localStorage.getItem(`heartbeat_checklist_${date}`);
    return local ? JSON.parse(local) : [
      { id: '1', title: 'Take prenatal vitamins', completed: false },
      { id: '2', title: 'Drink 8 glasses of water', completed: false },
      { id: '3', title: '15 min light walk', completed: false }
    ];
  }
  try {
    const docSnap = await getDoc(doc(db!, 'users', userId, 'checklists', date));
    return docSnap.exists() ? docSnap.data().tasks : [
      { id: '1', title: 'Take prenatal vitamins', completed: false },
      { id: '2', title: 'Drink 8 glasses of water', completed: false },
      { id: '3', title: '15 min light walk', completed: false }
    ];
  } catch (error) {
    console.error("Error fetching checklist:", error);
    return [];
  }
};
