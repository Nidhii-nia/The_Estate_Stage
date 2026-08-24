import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/supabase";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import {
  userSelector,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "@/redux/slice/user.slice.js";
import { toast } from "sonner";

const Profile = () => {
  const { currentUser, loading, error } = useSelector(userSelector);
  const fileRef = useRef(null);

  // File upload UI states
  const [fileUpload, setFileUpload] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [visible, setVisibility] = useState(false);

  // Single source of truth for editable form fields
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    avatar: currentUser?.avatar || "",
  });

  const dispatch = useDispatch();

  // Handle avatar upload to Supabase
  const handleFileUpload = async (file) => {
    try {
      setFileUpload(true);
      setFileUploadError(null);
      const fileName = `${Date.now()}_${file.name}`;
      const bucketName = import.meta.env.VITE_SUPABASE_BUCKET_NAME;

      const { error: uploadErr } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, avatar: urlData.publicUrl }));
      setFileUpload(false);
      setUploadSuccess(true);
    } catch (e) {
      setFileUploadError(e.message || "Failed to upload image");
      setFileUpload(false);
    }
  };

  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => setUploadSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Direct Async Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart()); // Called as function

      const response = await axios.put(
        `/api/user/update/${currentUser._id}`,
        formData
      );

      // Redux gets updated with response data
      dispatch(updateUserSuccess(response.data.data || response.data));
      toast.success("Profile updated successfully!")
    } catch (err) {
      const errorMessage =
        err.response?.data || err.message || "Update failed";
      dispatch(updateUserFailure(errorMessage));
    }
  };

  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="flex w-full m-3 max-w-xs flex-col items-center gap-6 rounded-2xl border border-cyan-600 bg-amber-50 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold text-amber-900 sm:text-3xl">
          Profile
        </h1>

        {(error || fileUploadError) && (
          <div className="text-xs text-red-600">
            {error || fileUploadError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center justify-center gap-5"
        >
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            hidden
            onChange={(e) =>
              e.target.files[0] && handleFileUpload(e.target.files[0])
            }
          />

          <img
            src={formData.avatar || currentUser?.avatar}
            alt="user-avatar"
            className="rounded-full w-18 h-18 outline-2 outline-cyan-700 cursor-pointer object-cover"
            onClick={() => fileRef.current?.click()}
            referrerPolicy="no-referrer"
          />

          {fileUpload && (
            <p className="text-xs text-green-700">Uploading...</p>
          )}
          {uploadSuccess && (
            <p className="text-xs text-green-700">
              Image uploaded successfully!
            </p>
          )}

          <Input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            className="w-full caret-lime-800 selection:bg-red-300 shadow-sm"
            onChange={handleChange}
          />

          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            className="w-full caret-lime-800 selection:bg-red-300 shadow-sm"
            onChange={handleChange}
          />

          <div className="w-full relative flex flex-wrap justify-between items-center">
            <Input
              type={visible ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={formData.password}
              className="w-full caret-lime-800 selection:bg-red-300 shadow-sm pr-10"
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-3.5 text-gray-600"
              onClick={() => setVisibility((prev) => !prev)}
            >
              {visible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading || fileUpload}
            className="w-full bg-cyan-700 hover:bg-cyan-600 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "UPDATE"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;