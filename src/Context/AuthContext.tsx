"use client";


import { auth, db } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ChildrenType = {
  children: ReactNode;
};


const AuthContext = createContext({ user: null });

export default function AuthContextProvider({ children }: ChildrenType) {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        fetchuserData(uid);
      } else {
        setUser(null);
        setUserDoc(null)
      }
    });
  }, []);

 
  //   const fetchDoc = async () => {

  //   const q = query(collection(db, "userOfBlogs"), where("isAdmin", "==", true));

  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     // doc.data() is never undefined for query doc snapshots
  //     let user=doc.data();
  //     // setUserDoc(user)
  //     console.log(user);
      
  //   });
  // }
  //   useEffect(()=>{
  //   fetchDoc();
  // },[user])


  const fetchuserData = async (uid: string) => {
    const docRef = doc(db, "userOfBlogs", uid);
    try {
      const userFound = await getDoc(docRef);
      const user = userFound.data();
      if (!user) return;
      setUser(user);
      console.log(user);
      
    } catch (e) {
      console.error("error:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);