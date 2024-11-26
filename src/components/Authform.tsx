"use client"

import { auth, db } from "@/firebase/firebaseConfig";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useId, useState } from "react"
import { toast } from "react-toastify";
import Loading from "./Loading";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/Context/AuthContext";
type AuthType = {
    type: string
}

export default function AuthForm({ type }: AuthType) {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPasword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const route = useRouter()
    const provider = new GoogleAuthProvider();

    async function googleLogin() {
        try {
            let result = await signInWithPopup(auth, provider)
            let newUser = result.user;
            let obj = {
                name: newUser.displayName,
                email: newUser.email,
                uid: newUser.uid,
                photoURL: newUser.photoURL,
                isVerified: newUser.emailVerified,
                isAdmin:false
            };
            console.log("Google Sign-In successful:", obj);
            saveUser(obj)
        }
        catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    }

    const Signup = (email: string, password: string, userName: string) => {

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const { email, uid } = userCredential.user;
                saveUser({ email, uid, userName, isAdmin })
                // console.log(user);
                toast.success(`Signed up with email: ${email}`);
                resetInput()

                // ...
            })
            .catch((error) => {
                console.error("Signup Error:", error);
                toast.error(`Signup failed: ${error.message}`);
            });
    }
    const resetInput = () => {
        setEmail("")
        setUserName("")
        setPasword("")
    }
    const Login = (email: string, password: string) => {


        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                toast.success(`Logged in with email: ${email}`);
                resetInput()
                route.push("/")
                // console.log(user.isAdmin);
                


                // ...
            })
            .catch((error) => {
                console.error("Login Error:", error);
                toast.error(`Login failed: ${error.message}`);
            });
    }
    const saveUser = async (UserData: any) => {
        try {
            const docRef = doc(db, "userOfBlogs", UserData.uid)
            await setDoc(docRef, UserData)
            route.push("/")
        }
        catch (e) {
            toast.error("Please enter valid details")
        }


    }
    useEffect(() => {
        setIsLoading(false)
    }, [])

    return isLoading ? (
        <Loading />
    ) : (

        <div className="flex justify-center items-center h-screen ">
            <div className="card card-compact bg-base-100 w-96 shadow-xl p-7">
                {

                    type === "Signup" ?

                        <h1 className="text-2xl font-bold text-center">Signup</h1> :
                        <h1 className="text-2xl font-bold text-center">Login</h1>
                }

                <br />
                {

                    type === "Signup" && (

                        <label className="input input-bordered flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                            </svg>
                            <input type="text" className="grow" placeholder="Username"
                                value={userName}
                                onChange={(e) => {
                                    setUserName(e.target.value)
                                }}
                            />
                        </label>
                    )

                }
                <br />
                <label className="input input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path
                            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input type="text" className="grow" placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                    />
                </label>
                <br />
                <label className="input input-bordered flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            fillRule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clipRule="evenodd" />
                    </svg>
                    <input type="password" className="grow" placeholder="password"
                        value={password}
                        onChange={(e) => {
                            setPasword(e.target.value)
                        }}
                    />
                </label>
                <br />
                {
                    type === "Signup" ? (
                        <>
                            <button className="btn btn-primary" onClick={() => {
                                Signup(email, password, userName)
                            }}>Sign up</button>
                            <p>Already have an account. <Link href={"/Login"}>Login </Link>here</p>
                        </>

                    ) :
                        (
                            <>
                                <button className="btn btn-primary" onClick={() => {
                                    Login(email, password)
                                }}>Login</button>
                                <button className="btn mt-4" onClick={googleLogin}>Contiue with Google</button>
                                <p className="m-4">Do not have an account. <Link href={"/Signup"}>Signup </Link>here</p>
                            </>
                        )
                }
            </div>
        </div>
    )
}