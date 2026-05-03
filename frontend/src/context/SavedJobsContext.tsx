"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Job } from "@/types";

const db = getFirestore(app);

interface SavedJobsContextType {
  savedIds: Set<string>;
  savedJobs: Job[];
  toggleSave: (job: Job) => Promise<void>;
  isSaved: (id: string) => boolean;
  loading: boolean;
}

const SavedJobsContext = createContext<SavedJobsContextType>({
  savedIds: new Set(),
  savedJobs: [],
  toggleSave: async () => {},
  isSaved: () => false,
  loading: false,
});

export const SavedJobsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  // Load saved jobs from Firestore when user logs in
  useEffect(() => {
    if (!user) {
      setSavedIds(new Set());
      setSavedJobs([]);
      return;
    }

    const fetchSaved = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "users", user.uid, "savedJobs"));
        const snapshot = await getDocs(q);
        const jobs: Job[] = [];
        const ids = new Set<string>();
        snapshot.forEach((doc) => {
          const data = doc.data() as Job;
          jobs.push(data);
          ids.add(data._id);
        });
        setSavedJobs(jobs);
        setSavedIds(ids);
      } catch (err) {
        console.error("Failed to load saved jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [user]);

  const toggleSave = useCallback(
    async (job: Job) => {
      if (!user) return;

      const jobRef = doc(db, "users", user.uid, "savedJobs", job._id);

      if (savedIds.has(job._id)) {
        // Remove
        await deleteDoc(jobRef);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(job._id);
          return next;
        });
        setSavedJobs((prev) => prev.filter((j) => j._id !== job._id));
      } else {
        // Save
        await setDoc(jobRef, { ...job, savedAt: serverTimestamp() });
        setSavedIds((prev) => new Set(prev).add(job._id));
        setSavedJobs((prev) => [job, ...prev]);
      }
    },
    [user, savedIds]
  );

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  return (
    <SavedJobsContext.Provider value={{ savedIds, savedJobs, toggleSave, isSaved, loading }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => useContext(SavedJobsContext);
