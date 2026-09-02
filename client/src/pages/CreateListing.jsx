import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/config/supabase.config";
import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { userSelector } from "@/redux/slice/user.slice";

const CreateListing = () => {
  const [fileError, setFileError] = useState(null);
  const [error, setError] = useState(null);
  const [filesToUpload, setFilesToUpload] = useState([]); // Selected raw File objects
  const fileRef = useRef();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector(userSelector);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: 5000,
    discountPrice: 0,
    bathrooms: 1,
    type: "rent",
    furnished: false,
    parking: false,
    offer: false,
    beds: 1,
    imageUrls: [],
  });

  console.log("FormData: ", formData);

  const handleChange = (e) => {
    const { id, name, type, checked, value } = e.target;
    const targetId = id || name;

    // 1. Handle Sell / Rent type toggles
    if (targetId === "sell" || targetId === "rent") {
      setFormData((prev) => ({
        ...prev,
        type: targetId,
      }));
      return;
    }

    // 2. Handle Checkboxes
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [targetId]: checked,
      }));
      return;
    }

    // 3. Handle Text, Textarea, and Number inputs
    if (type === "text" || type === "textarea" || type === "number") {
      setFormData((prev) => ({
        ...prev,
        [targetId]: type === "number" ? Number(value) : value,
      }));
    }
  };

  // Select local files into state
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (formData.imageUrls.length + selectedFiles.length > 6) {
      setFileError("You can only upload a maximum of 6 images in total.");
      return;
    }

    setFileError(null);
    setFilesToUpload(selectedFiles);
  };

  // Supabase single-file helper
  const storeImage = async (fileToUpload) => {
    const fileName = `${Date.now()}_${fileToUpload.name}`;
    const bucketName = import.meta.env.VITE_SUPABASE_BUCKET_NAME;

    const { error: uploadErr } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileToUpload);

    if (uploadErr) throw uploadErr;

    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return data.publicUrl;
  };

  // Upload handler for UPLOAD button
  const handleUploadImages = async () => {
    if (filesToUpload.length === 0) {
      setFileError("Please select at least one image to upload.");
      return;
    }

    if (formData.imageUrls.length + filesToUpload.length > 6) {
      setFileError("Max 6 files allowed!");
      return;
    }

    setUploading(true);
    setFileError(null);

    try {
      const uploadPromises = filesToUpload.map((file) => storeImage(file));
      const urls = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls.concat(urls),
      }));
      setFilesToUpload([]);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setFileError(`Image upload failed: ${err.message || err}`);
    } finally {
      setUploading(false);
    }
  };

  // Remove uploaded image URL preview
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1) {
      return setFileError("You must upload at least one image");
    }
    if (+formData.regularPrice < +formData.discountPrice) {
      return setFileError("Discount price must be lower than regular price");
    }

    try {
      setLoading(true);
      setError(false);
      await axios.post("/api/listing/create-listing", {
        ...formData,
        userRef: currentUser,
      });
      setLoading(false);
      toast.success("Listing created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error:", error.message);
      setError(error.response.data);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full p-2">
      <div className="flex w-full m-3 max-w-4xl flex-col items-center gap-6 rounded-2xl border border-cyan-600 bg-amber-50 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold text-amber-900 sm:text-3xl">
          Create Listing
        </h1>
        {error && (
          <p className="flex justify-center items-center border border-red-600 bg-red-300 text-sm text-red-600 p-1 rounded-md">
            {error}
          </p>
        )}
        <form
          onSubmit={handleSubmitForm}
          className="flex w-full flex-col items-center justify-center gap-5"
        >
          <div className="flex flex-col lg:flex-row gap-8 w-full items-start justify-center">
            {/* Left Column */}
            <div className="flex flex-col flex-1 gap-3 w-full items-center">
              <Input
                type="text"
                placeholder="Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-auto shadow-sm"
              />
              <Textarea
                placeholder="Description"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full h-auto shadow-sm"
              />
              <Input
                type="text"
                placeholder="Address"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full h-auto shadow-sm"
              />
              <div className="flex flex-wrap w-full gap-5 my-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sell"
                    name="sell"
                    onChange={handleChange}
                    checked={formData.type === "sell"}
                    className="accent-amber-500 h-5 w-5 rounded-sm border-2 border-amber-400 hover:border-amber-500"
                  />
                  <label className="text-sm" htmlFor="sell">
                    Sell
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rent"
                    name="rent"
                    onChange={handleChange}
                    checked={formData.type === "rent"}
                    className="accent-amber-500 h-5 w-5 rounded-sm border-2 border-amber-400 hover:border-amber-500"
                  />
                  <label className="text-sm" htmlFor="rent">
                    Rent
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="parking"
                    name="parking"
                    onChange={handleChange}
                    checked={formData.parking}
                    className="accent-amber-500 h-5 w-5 rounded-sm border-2 border-amber-400 hover:border-amber-500"
                  />
                  <label className="text-sm" htmlFor="parking">
                    Parking Spot
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="furnished"
                    name="furnished"
                    onChange={handleChange}
                    checked={formData.furnished}
                    className="accent-amber-500 h-5 w-5 rounded-sm border-2 border-amber-400 hover:border-amber-500"
                  />
                  <label className="text-sm" htmlFor="furnished">
                    Furnished
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="offer"
                    name="offer"
                    onChange={handleChange}
                    checked={formData.offer}
                    className="accent-amber-500 h-5 w-5 rounded-sm border-2 border-amber-400 hover:border-amber-500"
                  />
                  <label className="text-sm" htmlFor="offer">
                    Offer
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap gap-5 justify-start items-center w-full">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="outline-none w-16 h-8 selection:bg-rose-400 border-2 border-amber-400 hover:border-amber-500 rounded-sm px-1"
                    name="beds"
                    id="beds"
                    min="1"
                    max="10"
                    value={formData.beds}
                    onChange={handleChange}
                  />
                  <label className="text-sm" htmlFor="beds">
                    Beds
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="outline-none w-16 h-8 selection:bg-rose-400 border-2 border-amber-400 hover:border-amber-500 rounded-sm px-1"
                    name="bathrooms"
                    id="bathrooms"
                    min="1"
                    max="10"
                    value={formData.bathrooms}
                    onChange={handleChange}
                  />
                  <label className="text-sm" htmlFor="bathrooms">
                    Bathrooms
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="outline-none w-20 h-8 selection:bg-rose-400 border-2 border-amber-400 hover:border-amber-500 rounded-sm px-1"
                    name="regularPrice"
                    id="regularPrice"
                    min="5000"
                    max="100000000"
                    value={formData.regularPrice}
                    onChange={handleChange}
                  />
                  <label className="text-sm" htmlFor="regularPrice">
                    Regular Price (&#8377;/Month)
                  </label>
                </div>

                {formData.offer && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="outline-none w-20 h-8 selection:bg-rose-400 border-2 border-amber-400 hover:border-amber-500 rounded-sm px-1"
                      name="discountPrice"
                      id="discountPrice"
                      min="0"
                      max="10000000"
                      value={formData.discountPrice}
                      onChange={handleChange}
                    />
                    <label className="text-sm" htmlFor="discountPrice">
                      Discount Price (&#8377;/Month)
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col flex-1 gap-3 w-full">
              <label htmlFor="images" className="text-sm">
                <b>Images:</b> The first image will be cover (max 6 allowed)
              </label>
              {fileError && (
                <p className="flex justify-center items-center border border-red-600 bg-red-300 text-sm text-red-600 p-1 rounded-md">
                  {fileError}
                </p>
              )}
              <div className="flex flex-row items-center gap-1">
                <Input
                  type="file"
                  name="images"
                  id="images"
                  ref={fileRef}
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="border-0 file:border-2 file:bg-cyan-50 file:border-amber-500 file:p-1 file:rounded-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  className="border-2 border-green-600 text-xs text-green-700 hover:bg-green-200 hover:text-green-700 hover:border-green-500 transition-colors duration-300"
                  onClick={handleUploadImages}
                >
                  {uploading ? "Uploading..." : "UPLOAD"}
                </Button>
              </div>

              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="flex flex-row justify-between items-center border border-green-700 rounded-sm p-1"
                  >
                    <img
                      className="m-1 w-28 h-20 object-cover rounded-sm"
                      src={url}
                      alt={`property image ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <FaTimes />
                    </Button>
                  </div>
                ))}
              <Button type="submit">
                {loading&&error===false ? "Creating..." : "CREATE LISTING"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
