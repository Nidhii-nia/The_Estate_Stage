import ListingCard from "@/components/ListingCard";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const listingData = async () => {
      try {
        const response = await axios.get("/api/listing/");
        
        setData(Array.isArray(response.data?.data) ? response.data.data : []);
      } catch (error) {
        setError(error.response?.data || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    listingData();
  }, []);

  return (
    <>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:gap-14 sm:py-10">
        <section className="relative isolate min-h-145 overflow-hidden rounded-2xl bg-slate-900 text-amber-50 shadow-xl sm:min-h-155">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=85"
            alt="Elegant sunlit home interior"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-slate-950/90 via-slate-900/55 to-slate-900/10" />
          <div className="flex h-full min-h-145 max-w-2xl flex-col justify-end p-6 sm:min-h-155 sm:p-12 lg:p-16">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300 sm:text-sm">The place between now and next</p>
            <h1 className="mt-4 max-w-xl font-heading text-5xl font-bold leading-[1.02] sm:text-7xl">Find a home that feels like yours.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-200 sm:text-lg">
              Explore well-loved spaces, honest details, and homes ready for the life you are building.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/search" className="inline-flex items-center gap-3 rounded-md bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300">
                <FaSearch className="text-xs" /> Start exploring
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-amber-300">
                Our story <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Find your next place</p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-amber-950 sm:text-4xl">Homes worth coming home to.</h2>
            </div>
          </div>
        {error && <p className="w-full rounded-md border border-red-800 bg-red-50 p-3 text-sm text-red-600">{typeof error === "string" ? error : "Unable to load listings"}</p>}
        {loading ? (
          <div className="flex justify-center py-12"><Loader /></div>
        ) : data.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((listing) => <ListingCard key={listing._id} listingData={listing} />)}
          </div>
        ) : (
          <p className="py-12 text-center text-slate-500">No listings found.</p>
        )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
