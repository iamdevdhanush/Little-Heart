import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (firebaseConfig && firebaseConfig.apiKey) {
  console.log("Initializing Firebase with project:", firebaseConfig.projectId);
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
} else {
  console.error("Firebase config is missing or invalid!");
}

export { app, auth, db };
