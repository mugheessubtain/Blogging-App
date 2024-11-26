"use client"

import Loading from "@/components/Loading";
import { useAuthContext } from "@/Context/AuthContext";
import { db } from "@/firebase/firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function BlogList() {
    const [blog,setBlog]=useState([])
    const [isLoading, setIsLoading] = useState(true);
    const route = useRouter()
    const fetchData = async () => {
        const blogRef = collection(db, "blogs");
        setIsLoading(true);
        try {
          const allBlogsSnapShot = await getDocs(blogRef);
          const allblog = allBlogsSnapShot.docs.map((blog) => {
            const obj = blog.data();
            obj.id = blog.id;
            return obj;
          });
        setIsLoading(false);

          setBlog(allblog);
          console.log(allblog);
          
        } catch (e) {
          console.log(e);
        } finally {
          setIsLoading(false);
        }
      };
      useEffect(() => {
        fetchData();
        setIsLoading(true);
      }, []);
    
    return isLoading?<Loading/>: (
        <>
            <div className="p-6 m-4">
                <button className="btn btn-primary p-4 text-center" onClick={() => {
                    route.push("admin/Preview")
                }}> + Create Blog</button>
            </div>
            <div>
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>
                                    {/* <label>
                                        <input type="checkbox" className="checkbox" />
                                    </label> */}
                                </th>
                                <th>Blogs</th>
                                <th>tag</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        {
                            blog.map(({id,title, pic, tag })=>(
                                <tbody  key={id}>
                            {/* row 1 */}
                            <tr>
                                <th>
                                </th>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                    src={pic}
                                                    alt="Avatar Tailwind CSS Component" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{title}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {tag}
                                    <br />
                                    
                                </td>
                                <td><button className="btn btn-ghost btn-xs">Edit</button></td>
                                <th>
                                    <button className="btn btn-ghost btn-xs">Delete</button>
                                </th>
                            </tr>
                        </tbody>
                            ))
                        }
                        {/* foot */}
                      
                    </table>
                </div>
            </div>
        </>
    )
}