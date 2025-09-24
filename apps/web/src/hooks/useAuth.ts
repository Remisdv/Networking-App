import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth, logout as firebaseLogout, signInWithGoogle } from "../firebase";
import { createSession } from "../lib/api-client";
import { clearSessionToken, setSessionToken } from "../auth/session";

export function useAuth() {
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken(true);
        setSessionToken(idToken);
        await createSession(idToken);
      } else {
        clearSessionToken();
      }
    });

    return () => unsubscribe();
  }, []);

  const emailSignIn = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credentials.user.getIdToken(true);
      setSessionToken(idToken);
      await createSession(idToken);
      return credentials.user;
    },
  });

  const googleSignIn = useMutation({
    mutationFn: async () => {
      const credentials = await signInWithGoogle();
      const idToken = await credentials.user.getIdToken(true);
      setSessionToken(idToken);
      await createSession(idToken);
      return credentials.user;
    },
  });

  const signOut = useMutation({
    mutationFn: async () => {
      clearSessionToken();
      await firebaseLogout();
    },
  });

  return {
    user,
    emailSignIn,
    googleSignIn,
    signOut,
  };
}
