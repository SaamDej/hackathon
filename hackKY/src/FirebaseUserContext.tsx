import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

interface UserContextType {
  user: User | null;
  userData: { firstName: string; lastName: string; email: string } | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const FirebaseUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data() as { firstName: string; lastName: string; email: string });
        }
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, userData }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use user context
export const useFirebaseUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useFirebaseUser must be used within a FirebaseUserProvider");
  }
  return context;
};
