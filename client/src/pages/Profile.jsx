import { useSelector } from "react-redux";

import { userSelector } from "@/redux/slice/user.slice.js";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/supabase";

const UpdateButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-cyan-700 hover:bg-cyan-600 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Updating ..." : "UPDATE"}
    </Button>
  );
};

const Profile = () => {
  const { currentUser } = useSelector(userSelector);
  const fileRef = useRef();
  const [fileUpload, setFileUpload] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [uploadSuccess,setUploadSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    avatar: currentUser.avatar,
  });
  

  const handleFileUpload = async (file) => {
    try {
      setFileUpload(true);
      setFileUploadError(null);
      const fileName = `${Date.now()}_${file.name}`;
      const bucketName = import.meta.env.VITE_SUPABASE_BUCKET_NAME;

      //upload data to supabase
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log(urlData.publicUrl);
      setFormData({ ...formData, avatar: urlData.publicUrl });
      setFileUpload(false);
      setUploadSuccess(true);
    } catch (e) {
      setFileUploadError(e);
      setFileUpload(false);
    }
  };

    useEffect(()=>{
    if(formData.avatar){
      let timer = setTimeout(()=>setUploadSuccess(false),3000);

      return () => clearTimeout(timer)
    }
  },[formData.avatar])

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile.name);

    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="flex w-full m-3 max-w-xs flex-col items-center gap-6 rounded-2xl border border-cyan-600 bg-amber-50 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold text-amber-900 sm:text-3xl">
          Profile
        </h1>
        {fileUploadError && (
          <div className=" text-xs text-red-600">
            {/* "Error uploading image( Max-limit:2MB )" */}
            {fileUploadError.error || fileUploadError.message}
          </div>
        )}
        <form className="flex w-full flex-col items-center justify-center gap-5">
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            hidden
            onChange={(e) => handleChange(e)}
          />
          <img
            src={formData.avatar || currentUser.avatar}
            alt="user-avatar"
            className=" rounded-full w-18 h-18 outline-2 outline-cyan-700 cursor-pointer"
            onClick={() => fileRef.current.click()}
            referrerPolicy="no-referrer"
          />
          {fileUpload && <p className="text-xs text-green-700">Uploading...</p>}
          {uploadSuccess && <p className="text-xs text-green-700">Image uploaded successfully!</p>}
          <Input
            type="username"
            placeholder="Username"
            value={currentUser.username}
            className="w-full caret-lime-800 selection:bg-red-300 shadow-sm"
          />
          <Input
            type="email"
            placeholder="Email"
            value={currentUser.email}
            className="w-full caret-lime-800 selection:bg-red-300 shadow-sm"
          />
          <Input
            type="password"
            placeholder="Password"
            // value={currentUser.username}
            className="w-full caret-lime-800 selection:bg-red-300 shadow-sm"
          />
          <UpdateButton />
        </form>
      </div>
    </div>
  );
};

export default Profile;
