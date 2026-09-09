import ListingPageInfo from "@/components/ListingPageInfo";
import Loader from "@/components/Loader";
import { userSelector } from "@/redux/slice/user.slice";
import axios from "axios";
import { useEffect, useState, useOptimistic, useTransition } from "react";
import { useSelector } from "react-redux";

const Listings = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector(userSelector);
  const [listingData, setListingData] = useState([]);
  
  // 1. Initialize the transition hook
  const [isPending, startTransition] = useTransition();

  // 2. Define the optimistic state configuration
  const [optimisticListings, setOptimisticListings] = useOptimistic(
    listingData,
    (currentListings, targetId) => currentListings.filter((listing) => listing._id !== targetId)
  );

  useEffect(() => {
    if (!currentUser?._id) return;

    const getListings = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/listing/userListing/${currentUser._id}`,
        );
        setListingData(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        setError(error.response?.data || "Failed to load listings");
        setListingData([]);
      } finally {
        setLoading(false);
      }
    };

    getListings();
  }, [currentUser]);

  // 3. Centralized delete handler utilizing the transition state
  const handleDelete = (listingId) => {
    startTransition(async () => {
      // Instantly filter out the item from the UI array
      setOptimisticListings(listingId);

      try {
        await axios.patch(`/api/listing/delete/${listingId}`);
        // Success: Commit the true state change
        setListingData((prev) => prev.filter((listing) => listing._id !== listingId));
      } catch (err) {
        // Error: fallback messaging. useOptimistic auto-restores state.
        setError(err.response?.data?.message || "Failed to delete listing. Restoring...");
      }
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {error && (
        <div className="border border-red-600 text-red-600 text-sm rounded-sm p-2 mb-4 text-center max-w-md mx-auto">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-8">
          <Loader />
        </div>
      // 4. Update conditional rendering check to point to optimistic data
      ) : optimisticListings.length > 0 ? (
        <div className="space-y-9">
          
          {/* 5. Metrics updated to run on the optimistic data array */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white border border-slate-400 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Properties
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                {optimisticListings.length}
              </p>
            </div>

            <div className="bg-white border border-slate-400 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Sold / Unavailable
              </p>
              <p className="text-3xl font-extrabold text-amber-600 mt-2">
                {optimisticListings.filter((l) => l.notAvailable).length}
              </p>
            </div>

            <div className="bg-white border border-slate-400 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                For Rent
              </p>
              <p className="text-3xl font-extrabold text-blue-600 mt-2">
                {optimisticListings.filter((l) => l.type === 'rent').length}
              </p>
            </div>

            <div className="bg-white border border-slate-400 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                For Sale
              </p>
              <p className="text-3xl font-extrabold text-emerald-600 mt-2">
                {optimisticListings.filter((l) => l.type === 'sell').length}
              </p>
            </div>
          </div>

          {/* Properties Grid Section */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Your Listed Properties
            </h2>
            <div className="flex flex-col flex-wrap gap-6">
              {/* 6. Map the UI using optimisticListings and pass down the handler */}
              {optimisticListings.map((listing) => (
                <ListingPageInfo 
                  key={listing._id} 
                  listingData={listing} 
                  onDelete={handleDelete}
                  isDeleting={isPending}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-slate-500 text-center">No listings found.</p>
      )}
    </div>
  );
};

export default Listings;