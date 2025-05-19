import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/components/auth/firebase-config";
import { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  currentUser: User | null;
  userRole: "master" | "player" | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userRole: null,
  loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthContextType>({
    currentUser: null,
    userRole: null,
    loading: true
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          setAuthState({
            currentUser: user,
            userRole: docSnap.exists() ? docSnap.data().role : null,
            loading: false
          });
        } catch (error) {
          console.error("Error fetching user role:", error);
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } else {
        setAuthState({
          currentUser: null,
          userRole: null,
          loading: false
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

// Exportação corrigida do hook
export const useAuth = () => useContext(AuthContext);