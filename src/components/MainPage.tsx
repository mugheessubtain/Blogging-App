import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Image from "next/image";

export default function MainPage() {
  const [blog, setBlog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRouter();

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
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const defaultImage = "/default-image.png"; // Replace with your fallback image path

  return isLoading ? (
    <Loading />
  ) : (
    <div className="flex flex-wrap justify-center gap-6 p-4 h-full">
      {blog.map(({ id, title = "Unknown Title", pic, content = "No Content" }) => (
        <div
          className="card bg-base-100 w-96 shadow-xl flex-shrink-0"
          key={id}
        >
          <figure className="h-48 w-full">
            <Image
              src={pic || defaultImage}
              alt={title}
              height={192} // Ensures image fits the container height
              width={384} // Matches container width
              className="h-full w-full object-cover rounded-t-lg"
              onError={(e) => {
                // Handle broken image by replacing with a default image
                (e.target as HTMLImageElement).src = defaultImage;
              }}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-lg font-bold truncate">{title}</h2>
            <p className="truncate">{content}</p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                onClick={() => route.push(`/blogs/${id}`)}
              >
                More Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
