"use client"

import { auth, db, storage } from "@/firebase/firebaseConfig";
import { ref } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "./Loading";

export default function Createblog() {
    const [title, setTitle] = useState("");
    const [pic, setPic] = useState<File>();
    const [tag, setTag] = useState("");
    const [content, setContent] = useState("");

    const [picURL, setPicURL] = useState("");
    const [isLoading, setIsLoading] = useState(true);


    const route = useRouter();
    useEffect(() => {
        setIsLoading(false)
    }, [])
    const uploadFiles = (event: React.FormEvent) => {
        event.preventDefault();
        if (!title || !tag || !pic || !content) {

            toast.error("All fields are required!");
            return;
        }
        uploadPic();
    };
    const resetInput = () => {
        setTitle(""),
            setTag("");
        setContent("")
    }
    const saveBlog = async (picURL: string) => {
        const blog = {
            title,
            tag,
            content,
            pic: picURL,
            createdDate: new Date().toDateString()
        };
        let docId = auth.currentUser?.uid;
        let userRef = doc(db, "blogs", docId!);
        setIsLoading(true)
        try {
            await setDoc(userRef, blog);
        setIsLoading(false)
        route.push("/admin")

        } catch (e) {
            console.log(e);
        }
        console.log(blog);
        resetInput()

    };

    const uploadPic = () => {
        const storageRef = ref(storage, `blogimages/${makeImageName()}`);
        const uploadTask = uploadBytesResumable(storageRef, pic!);
        uploadTask.on(
            "state_changed",
            (snapshot) => { },
            (error) => { },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("File available at", downloadURL);
                    setPicURL(downloadURL);
                    saveBlog(downloadURL);
                });
            }
        );
    };
    const makeImageName = () => {
        let imageName = pic?.name.split(".");
        let lastIndex = imageName!?.length - 1;
        let imageType = imageName![lastIndex];
        let newName = `${auth.currentUser?.uid}.${imageType}`;
        return newName;
    };

    return isLoading ? (
        <Loading />
    ) : (

        <div className='flex gap-5 justify-center items-center'>
            <div>
                <div className="flex flex-col xl:p-10 gap-5 mb-10">
                    <h1 className="text-2xl font-bold text-center">Create a Blog</h1>

                    <div className="flex gap-5 justify-center flex-col md:flex-row">
                        {/* Blog form */}
                        <div className="shadow-2xl xl:w-[550px] w-full rounded-lg border-slate-100 border-2">
                            <form className="card-body" onSubmit={uploadFiles}>
                                <div className="form-control">
                                    <label className="label cursor-pointer" htmlFor="title">
                                        <span className="label-text font-semibold text-[15px]">
                                            Title
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        className="input input-bordered input-primary w-full"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label cursor-pointer" htmlFor="file">
                                        <span className="label-text font-semibold text-[15px]">
                                            Upload Image
                                        </span>
                                    </label>
                                    <input
                                        type="file"
                                        className="file-input file-input-bordered file-input-primary w-full"
                                        id="file"
                                        onChange={(e) => {


                                            let file = e.target.files
                                            if (file?.length) {
                                                setPic(file[0])
                                                // console.log(file);

                                            }
                                        }
                                        }
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label cursor-pointer" htmlFor="tag">
                                        <span className="label-text font-semibold text-[15px]">
                                            Tag
                                        </span>
                                    </label>
                                    <select
                                        className="w-full input input-bordered input-primary rounded-lg"
                                        id="tag"
                                        value={tag}
                                        onChange={(e) => setTag(e.target.value)}
                                    >
                                        <option value={"Entertainment"}>Entertainment</option>
                                        <option value={"Blogging"}>Blogging</option>
                                        <option value={"Education"}>Education</option>
                                        <option value={"Coding"}>Coding</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label cursor-pointer" htmlFor="content">
                                        <span className="label-text font-semibold text-[15px]">
                                            Content
                                        </span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-primary input input-primary w-full h-24"
                                        placeholder="Type blog content in markdown format"
                                        id="content"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="mt-3">
                                    <button className="btn btn-primary w-full" onClick={uploadFiles}>
                                        Create Blog
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex flex-col xl:p-10 gap-5 mb-10">
                    <h1 className="text-2xl font-bold text-center">Preview Blog</h1>

                    <div className="flex gap-5 justify-center flex-col md:flex-row">
                        <div className="shadow-2xl overflow-y-scroll rounded-lg xl:w-[550px] w-full h-[34rem] border-slate-100 border-2">
                            <div className="card-body">

                                <div className="p-2 h-full">
                                    {content}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    )
}