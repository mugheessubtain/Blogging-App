"use client"

import { useAuthContext } from "@/Context/AuthContext";
import { auth } from "@/firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";


export default function Navbar() {
  const { user } = useAuthContext()
useEffect(()=>{
console.log(user);

},[])
  const route = useRouter();
  const Signout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      toast.success("Logout Successfully")
    }).catch((error) => {
      // An error happened.
    });
    route.push("/");
  }
  return (
    <>
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounde
        d-box z-[1] mt-3 w-52 p-2 shadow">
            <li className="cursor-pointer" ><Link href={"/Login"}>Login</Link></li>
            <li className="cursor-pointer" ><Link href={"/Signup"}>SignUp</Link></li>
            <li className="cursor-pointer" onClick={Signout}><Link href="/">LogOut</Link></li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Blogging App</a>
      </div>
       <div className="navbar-end">
          <div className="indicator">
            {

            user?<h1 className=" mr-10">{user.userName}</h1>:null
            }
          </div>
        
      </div> 
    </div>
    <div className="border-b-2 ">

    </div>
    </>
  )
}


