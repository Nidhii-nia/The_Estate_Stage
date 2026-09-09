import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBath,
  FaBed,
  FaChair,
  FaEnvelope,
  FaMapMarkerAlt,
  FaParking,
  FaPhone,
  FaTag,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const ListingDetails = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getListing = async () => {
      try {
        const { data } = await axios.get(`/api/listing/${listingId}`);
        setListing(data?.data || null);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Unable to load this listing",
        );
      } finally {
        setLoading(false);
      }
    };

    getListing();
  }, [listingId]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    );
  if (error || !listing)
    return (
      <p className="mx-auto max-w-xl px-4 py-20 text-center text-red-700">
        {error || "Listing not found"}
      </p>
    );

  const images = listing.imageUrls || [];
  const hasOffer = listing.offer && listing.discountPrice;
  const price = hasOffer ? listing.discountPrice : listing.regularPrice;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-2 text-sm font-semibold text-cyan-800 hover:text-cyan-950"
      >
        <FaArrowLeft /> Back to listings
      </button>

      <div className="overflow-hidden rounded-3xl border border-cyan-700/30 bg-amber-50 shadow-xl">
        <div className="grid gap-2 bg-slate-900 p-2 lg:grid-cols-[1fr_150px]">
          <div className="relative min-h-70 overflow-hidden rounded-2xl bg-slate-800 lg:min-h-127.5">
            {images[activeImage] && (
              <img
                src={images[activeImage]}
                alt={listing.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="grid grid-cols-4 gap-2 lg:grid-cols-1">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(index)}
                className={`overflow-hidden rounded-xl border-2 ${activeImage === index ? "border-amber-400" : "border-transparent"}`}
              >
                <img
                  src={image}
                  alt={`${listing.name} view ${index + 1}`}
                  className="h-20 w-full object-cover lg:h-29.5"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_310px]">
          <section>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-900">
                    For {listing.type}
                  </span>
                  {listing.offer && (
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-800">
                      Special offer
                    </span>
                  )}
                </div>
                <h1 className="font-heading text-3xl font-bold text-amber-950 sm:text-4xl">
                  {listing.name}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                  <FaMapMarkerAlt className="text-amber-700" />{" "}
                  {listing.address}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-cyan-900">
                  &#8377;{price?.toLocaleString("en-IN")}
                </p>
                {listing.type === "rent" && (
                  <p className="text-xs text-slate-500">per month</p>
                )}
                {hasOffer && (
                  <p className="text-sm text-slate-500 line-through">
                    &#8377;{listing.regularPrice?.toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </div>

            <div className="my-8 grid grid-cols-2 gap-3 border-y border-amber-200 py-5 sm:grid-cols-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FaBed className="text-cyan-700" /> {listing.beds} beds
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FaBath className="text-cyan-700" /> {listing.bathrooms} baths
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FaParking className="text-cyan-700" />{" "}
                {listing.parking ? "Parking" : "No parking"}
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FaChair className="text-cyan-700" />{" "}
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </div>
            </div>

            <h2 className="font-heading text-2xl font-bold text-amber-950">
              About this property
            </h2>
            <p className="mt-3 whitespace-pre-line text-base leading-7 text-slate-700">
              {listing.description}
            </p>
          </section>

          <aside className="self-start rounded-2xl border border-cyan-700/30 bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-cyan-800">
              <FaTag /> Interested in this property?
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-amber-950">
              Contact the seller
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Ask about availability, viewing times, and the details that matter
              to you.
            </p>
            <div className="mt-5 grid gap-3">
              {listing.sellerEmail && (
                <a
                  href={`mailto:${listing.sellerEmail}?subject=Inquiry about ${listing.name}`}
                  className="flex items-center justify-center gap-2 rounded-lg bg-cyan-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-950"
                >
                  <FaEnvelope /> Email seller
                </a>
              )}
              {listing.sellerPhone && (
                <a
                  href={`tel:${listing.sellerPhone}`}
                  className="flex items-center justify-center gap-2 rounded-lg border border-cyan-800 px-4 py-3 text-sm font-bold text-cyan-900 transition hover:bg-cyan-50"
                >
                  <FaPhone /> {listing.sellerPhone}
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ListingDetails;
