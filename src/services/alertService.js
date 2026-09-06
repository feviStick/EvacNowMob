import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
} from 'firebase/firestore';

export function subscribeToActiveAlerts(callback) {
  const q = query(
    collection(db, 'alerts'), 
    where("active", "==", true),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs.map(doc => ({
      alertId: doc.id,
      ...doc.data()
    }));
    callback(alerts);
  });
}
