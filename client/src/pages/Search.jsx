import ListingCard from "@/components/ListingCard";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 5;

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);

  const query = searchParams.get("query") || "";
  const selectedType = searchParams.get("type") || "all";
  const selectedOffer = searchParams.get("offer") === "true";
  const selectedParking = searchParams.get("parking") === "true";
  const selectedFurnished = searchParams.get("furnished") === "true";
  const sort = searchParams.get("sort") || "latest";

  const [filters, setFilters] = useState({
    query,
    type: selectedType,
    offer: selectedOffer,
    parking: selectedParking,
    furnished: selectedFurnished,
    sort,
  });

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/listing/search", {
          params: {
            query,
            type: selectedType,
            offer: selectedOffer,
            parking: selectedParking,
            furnished: selectedFurnished,
            sort,
            skip: 0,
            limit: PAGE_SIZE,
          },
        });
        const result = response.data?.data || {};
        setListings(Array.isArray(result.listings) ? result.listings : []);
        setTotal(result.total || 0);
        setHasMore(Boolean(result.hasMore));
        setError(null);
      } catch (requestError) {
        setError(requestError.response?.data || "Unable to load listings");
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [query, selectedType, selectedOffer, selectedParking, selectedFurnished, sort]);

  const handleFilterChange = (event) => {
    const { name, type, checked, value } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const nextParams = new URLSearchParams();
    if (filters.query.trim()) nextParams.set("query", filters.query.trim());
    if (filters.type !== "all") nextParams.set("type", filters.type);
    if (filters.offer) nextParams.set("offer", "true");
    if (filters.parking) nextParams.set("parking", "true");
    if (filters.furnished) nextParams.set("furnished", "true");
    if (filters.sort !== "latest") nextParams.set("sort", filters.sort);
    setVisibleCount(PAGE_SIZE);
    setSearchParams(nextParams);
  };

  const handleShowMore = async () => {
    try {
      setLoadingMore(true);
      const response = await axios.get("/api/listing/search", {
        params: {
          query,
          type: selectedType,
          offer: selectedOffer,
          parking: selectedParking,
          furnished: selectedFurnished,
          sort,
          skip: listings.length,
          limit: PAGE_SIZE,
        },
      });
      const result = response.data?.data || {};
      setListings((current) => current.concat(result.listings || []));
      setHasMore(Boolean(result.hasMore));
      setVisibleCount((count) => count + PAGE_SIZE);
    } catch (requestError) {
      setError(requestError.response?.data || "Unable to load more listings");
    } finally {
      setLoadingMore(false);
    }
  };

  const visibleListings = listings.slice(0, visibleCount);

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit rounded-xl border border-slate-300 bg-white p-5 shadow-sm lg:sticky lg:top-6">
        <div className="mb-5 border-b border-slate-200 pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Refine</p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-slate-800">Find a property</h1>
        </div>
        <form className="space-y-5" onSubmit={handleSearch}>
          <label className="block text-sm font-semibold text-slate-700">
            Search term
            <Input name="query" value={filters.query} onChange={handleFilterChange} placeholder="City, area, name..." className="mt-2" />
          </label>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-700">Type</legend>
            <div className="space-y-2 text-sm text-slate-600">
              {[{ value: "all", label: "Rent & Sale" }, { value: "rent", label: "Rent" }, { value: "sell", label: "Sale" }].map((option) => (
                <label key={option.value} className="flex items-center gap-2">
                  <input type="radio" name="type" value={option.value} checked={filters.type === option.value} onChange={handleFilterChange} />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-700">Amenities</legend>
            <div className="space-y-2 text-sm text-slate-600">
              {[{ name: "parking", label: "Parking" }, { name: "furnished", label: "Furnished" }, { name: "offer", label: "Offer" }].map((option) => (
                <label key={option.name} className="flex items-center gap-2">
                  <input type="checkbox" name={option.name} checked={filters[option.name]} onChange={handleFilterChange} />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block text-sm font-semibold text-slate-700">
            Sort
            <select name="sort" value={filters.sort} onChange={handleFilterChange} className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-cyan-600">
              <option value="latest">Latest</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>

          <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-800">Search</Button>
        </form>
      </aside>

      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Search results</p>
            <h2 className="mt-1 font-heading text-3xl font-bold text-slate-900">Properties for you</h2>
          </div>
          {!loading && <p className="text-sm text-slate-500">{total} matching {total === 1 ? "property" : "properties"}</p>}
        </div>

        {error && <p className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{typeof error === "string" ? error : "Unable to load listings"}</p>}
        {loading ? (
          <div className="flex justify-center py-16"><Loader /></div>
        ) : visibleListings.length ? (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {visibleListings.map((listing) => <ListingCard key={listing._id} listingData={listing} />)}
            </div>
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button type="button" variant="outline" onClick={handleShowMore} disabled={loadingMore} className="border-slate-700 text-slate-700 hover:bg-slate-100">
                  {loadingMore ? "Loading..." : "Show more"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500">No properties match these filters.</p>
        )}
      </section>
    </main>
  );
};

export default Search;
