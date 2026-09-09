import { FaCaretLeft, FaCaretRight, FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import { Button } from "./ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ListingCard = ({ listingData }) => {
  const images = listingData?.imageUrls || [];
  const [position, setPosition] = useState(0);
  const navigate = useNavigate();

  const handleLeftSlide = (e) => {
    e.stopPropagation();
    setPosition((prevState) => (prevState - 1 + images.length) % images.length);
  };

  const handleRightSlide = (e) => {
    e.stopPropagation();
    setPosition((prevState) => (prevState + 1) % images.length);
  };

  if (!images.length) return null;

  // Determine displayed price based on offer state
  const isOffer = listingData?.offer && listingData?.discountPrice;
  const price = isOffer ? listingData.discountPrice : listingData?.regularPrice;

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/listing/${listingData._id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          navigate(`/listing/${listingData._id}`);
        }
      }}
      className="group flex w-full cursor-pointer flex-col items-center rounded-2xl border-2 border-cyan-600 bg-amber-50 p-3 shadow-lg transition-all duration-300 hover:border-cyan-500 hover:shadow-xl"
    >
      
      {/* Image Slider Container */}
      <div className="relative w-full aspect-4/3 overflow-hidden rounded-xl border border-cyan-700/30">
        
        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
          <span className="bg-amber-900/80 backdrop-blur-xs text-amber-50 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
            For {listingData?.type || "Rent"}
          </span>
          {listingData?.offer && (
            <span className="bg-rose-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Offer
            </span>
          )}
        </div>

        {/* Left Slider Button */}
        {images.length > 1 && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleLeftSlide}
            className="absolute top-1/2 -translate-y-1/2 left-2 z-10 bg-amber-50/90 hover:bg-white text-cyan-800 border-cyan-600/50 rounded-full h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shadow-md transition-transform hover:scale-110"
          >
            <FaCaretLeft className="text-lg sm:text-xl text-cyan-900" />
          </Button>
        )}

        <img
          src={images[position]}
          alt={listingData?.name || "property-image"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Right Slider Button */}
        {images.length > 1 && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRightSlide}
            className="absolute top-1/2 -translate-y-1/2 right-2 z-10 bg-amber-50/90 hover:bg-white text-cyan-800 border-cyan-600/50 rounded-full h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shadow-md transition-transform hover:scale-110"
          >
            <FaCaretRight className="text-lg sm:text-xl text-cyan-900" />
          </Button>
        )}
      </div>

      {/* Content Details */}
      <div className="w-full mt-3 p-1 flex flex-col gap-2 text-left">
        
        {/* Title & Price */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-base font-bold text-amber-900 line-clamp-1">
            {listingData?.name}
          </h3>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-base font-extrabold text-cyan-800">
              &#8377;{price?.toLocaleString("en-In")}
              {listingData?.type === "rent" && <span className="text-xs font-normal"> / mo</span>}
            </span>
            {isOffer && (
              <span className="text-[10px] text-red-900/60 line-through">
                &#8377;{listingData?.regularPrice?.toLocaleString("en-In")}
              </span>
            )}
          </div>
        </div>

        {/* Address */}
        {listingData?.address && (
          <div className="flex items-center gap-1 text-xs text-red-900/80">
            <FaMapMarkerAlt className="text-amber-700 shrink-0" />
            <span className="line-clamp-1">{listingData.address}</span>
          </div>
        )}

        {/* Description */}
        <p className="line-clamp-2 text-xs font-medium text-red-900/90 leading-relaxed">
          {listingData?.description}
        </p>

        {/* Specs & Features Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-amber-200/60 pt-2.5 mt-1 text-xs text-amber-900 font-semibold">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <FaBed className="text-cyan-700" />
              {listingData?.beds || 0} {listingData?.beds === 1 ? "Bed" : "Beds"}
            </span>
            <span className="flex items-center gap-1">
              <FaBath className="text-cyan-700" />
              {listingData?.bathrooms || 0} {listingData?.bathrooms === 1 ? "Bath" : "Baths"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-cyan-800">
            {listingData?.parking && (
              <span title="Parking Available" className="flex items-center gap-1 bg-amber-100 px-1.5 py-0.5 rounded">
                <FaParking />
              </span>
            )}
            {listingData?.furnished && (
              <span title="Furnished" className="flex items-center gap-1 bg-amber-100 px-1.5 py-0.5 rounded">
                <FaChair />
              </span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ListingCard;