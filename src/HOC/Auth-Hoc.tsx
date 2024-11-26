"use client";


import { useAuthContext } from "@/Context/AuthContext";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { toast } from "react-toastify";

type AuthProtectedRoutesTypes = {
  children: ReactNode;
};

export default function AuthProtectedRoutes({
  children,
}: AuthProtectedRoutesTypes) {
  const route = useRouter();
  const { user } = useAuthContext()!;
  useEffect(() => {
    if (user) {
      // console.log(user);
      console.log(user.isAdmin);
      if (user.isAdmin) {
        route.push("/admin");
      }
      else{
        toast.error("You are not a Admin");

        route.push("/");

      }
    }

    // if (user && user.role === "company" && !("name" in user!)) {
    //   route.push("/company/companyinfo");
    // }
  }, [user]);

  return <>{children}</>;
}
