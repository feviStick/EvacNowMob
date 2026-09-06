import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

export async function createReport(userId, reportData) {
  try {
    const reportRef = await addDoc(collection(db, 'reports'), {
      ...reportData,
      userId,
      status: 'Pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return reportRef.id;
  } catch (error) {
    console.error("Error adding report: ", error);
    throw error;
  }
}

export function subscribeToUserReports(userId, callback) {
  const q = query(
    collection(db, 'reports'), 
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map(doc => ({
      reportId: doc.id,
      ...doc.data()
    }));
    callback(reports);
  });
}
