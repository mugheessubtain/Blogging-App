"use client";


import { useAuthContext } from "@/Context/AuthContext";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { toast } from "react-toastify";

type AuthProtectedRoutesTypes = {
  children: ReactNode;
};

export default function AuthProtectedRoutes2({
  children,
}: AuthProtectedRoutesTypes) {
  const route = useRouter();
  const { user } = useAuthContext()!;
  useEffect(() => {
    if(user){
      if(user.isAdmin){
        route.push("/admin");
        // toast.error("You are already logged in");
      }
      else{
        route.push("/");
        toast.error("You are not an Admin");
      }
    }

    // if (user && user.role === "company" && !("name" in user!)) {
    //   route.push("/company/companyinfo");
    // }
  }, [user]);

  return <>{children}</>;
}
