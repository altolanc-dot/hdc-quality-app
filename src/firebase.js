import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB8CS6XJKBAqlSTaOZY1g1Dt3zCVjqMvBE",
  authDomain: "hdc-quality-team.firebaseapp.com",
  projectId: "hdc-quality-team",
  storageBucket: "hdc-quality-team.firebasestorage.app",
  messagingSenderId: "730234114654",
  appId: "1:730234114654:web:1aa11f0f21084254775acf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const dbGet = async (collection, docId) => {
  try {
    const snap = await getDoc(doc(db, collection, docId));
    return snap.exists() ? snap.data() : null;
  } catch(e) { console.error('dbGet:', e); return null; }
};

export const dbSet = async (collection, docId, data) => {
  try {
    await setDoc(doc(db, collection, docId), data, { merge: true });
    return true;
  } catch(e) { console.error('dbSet:', e); return false; }
};
