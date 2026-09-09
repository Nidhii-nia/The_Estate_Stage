import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const ListingPageInfo = ({ listingData, onDelete, isDeleting }) => {
  const navigate = useNavigate();

  return (
    <div className="group flex flex-row items-center justify-between w-full border border-cyan-900 bg-olive-50 rounded-md p-2 gap-2 sm:gap-4 transition-all duration-100 overflow-hidden">
      
      {/* Left: Fixed-width Image */}
      <div className="w-24 sm:w-36 shrink-0 overflow-hidden rounded-md">
        <img
          title={`${listingData.name} image`}
          // Fixed structural bug: accessing index [0] to extract the string URL safely
          src={listingData.imageUrls?.[0] || ""} 
          alt={`${listingData.name} image`}
          className="w-full h-16 sm:h-20 object-cover rounded-md transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Middle: Title */}
      <p className="text-xs sm:text-sm font-semibold text-olive-500 truncate min-w-0 flex-1 px-1">
        {listingData.name}
      </p>

      {/* Right: Action Buttons */}
      <div className="flex flex-row items-center gap-1.5 sm:gap-2 shrink-0">
        <Button 
          type="button" 
          disabled={isDeleting}
          onClick={() => navigate(`/edit-listings/${listingData._id}`, { state: listingData })} 
          className="flex items-center gap-1 px-2 py-1 text-[11px] sm:text-xs bg-olive-700 hover:bg-olive-700/90 disabled:opacity-50"
        >
          <FaPencilAlt className="text-[10px]" />
          <span>Edit</span>
        </Button>

        <Button 
          type="button" 
          disabled={isDeleting}
          onClick={() => onDelete(listingData._id)} // Triggers the parent's optimistic transition
          className="flex items-center gap-1 px-2 py-1 text-[11px] sm:text-xs bg-red-700 hover:bg-red-700/90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FaTrash className="text-[10px]" />
          {/* Changes button text dynamically if a background action is processing */}
          <span>{isDeleting ? "Deleting..." : "Delete"}</span>
        </Button>
      </div>

    </div>
  );
};

export default ListingPageInfo;
