// hooks/useNotes.ts (hook comum)
import { useState, useEffect } from "react";
import { db, auth } from "@/components/auth/firebase-config";
import {
  collection,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

export const useNotes = (collectionName: string) => {
  const [notes, setNotes] = useState<any[]>([]);
  
  useEffect(() => {
    if (!auth.currentUser?.uid) return;
    
    const q = query(
      collection(db, collectionName),
      where("userId", "==", auth.currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [collectionName]);

  return notes;
};

export const useFolders = (collectionName: string) => {
  const [folders, setFolders] = useState<any[]>([]);
  
  useEffect(() => {
    if (!auth.currentUser?.uid) return;
    
    const q = query(
      collection(db, collectionName),
      where("userId", "==", auth.currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFolders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [collectionName]);

  return folders;
};