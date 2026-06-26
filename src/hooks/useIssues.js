import { useState, useEffect } from 'react';
import {
  collection, addDoc, onSnapshot,
  orderBy, query, updateDoc, doc, increment
} from 'firebase/firestore';
import { db } from '../firebase';

export function useIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCount, setNewCount] = useState(0);
  const [prevCount, setPrevCount] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'issues'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (prevCount !== null && data.length > prevCount) {
        setNewCount(c => c + (data.length - prevCount));
      }
      setPrevCount(data.length);
      setIssues(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addIssue = async (issue) => {
    await addDoc(collection(db, 'issues'), {
      ...issue,
      votes: 0,
      status: 'pending',
      createdAt: new Date(),
      date: new Date().toISOString().split('T')[0],
    });
  };

  const voteIssue = async (id) => {
    await updateDoc(doc(db, 'issues', id), {
      votes: increment(1)
    });
  };

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, 'issues', id), { status });
  };

  return { issues, loading, newCount, setNewCount, addIssue, voteIssue, updateStatus };
}