import { useEffect, useState } from "react";
import { db } from "../firebase/config";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

const sortByCreatedAtDesc = (docs) =>
  [...docs].sort(
    (a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0),
  );

export const useFetchDocuments = (docCollection, search = null, uid = null) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const collectionRef = collection(db, docCollection);

    let q;

    // buscar por tags (ordenação no cliente evita índice composto)
    if (search) {
      q = query(
        collectionRef,
        where("tagsArray", "array-contains", search),
      );
    }

    // buscar posts do usuário (ordenação no cliente evita índice composto)
    else if (uid) {
      q = query(collectionRef, where("uid", "==", uid));
    }

    // buscar todos os posts
    else {
      q = query(collectionRef, orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDocuments(uid || search ? sortByCreatedAtDesc(docs) : docs);

        setLoading(false);
      },
      (error) => {
        console.log(error);
        setError(error.message);
        setLoading(false);
      },
    );

    // cleanup listener
    return () => unsubscribe();
  }, [docCollection, search, uid]);

  return { documents, loading, error };
};
