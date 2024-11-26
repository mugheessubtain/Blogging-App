"use client"

import AuthForm from "@/components/Authform"
import AuthProtectedRoutes2 from "@/HOC/AuthProRoutes"

export default function Login(){
  return(
    <AuthProtectedRoutes2>
      
    <AuthForm 
    type={"Signup"}/>
    </AuthProtectedRoutes2>
  )
}