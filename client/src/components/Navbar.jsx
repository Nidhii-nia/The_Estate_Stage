import { FaSearch, FaUser, FaList, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  userSelector,
  logoutUserStart,
  logoutUserSuccess,
  logoutUserFailure,
} from "@/redux/slice/user.slice";

const Navbar = () => {
  const { currentUser } = useSelector(userSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      dispatch(logoutUserStart());
      const response = await axios.post(`/api/auth/logout/`);
      console.log("Backend response logout user:", response.data.message);
      navigate("/");
      dispatch(logoutUserSuccess());
      toast.success("Logged out successfully.");
    } catch (error) {
      const errorMessage =
        error.response?.data || error.message || "Logout Failed!";
      dispatch(logoutUserFailure(errorMessage));
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const term = searchTerm.trim();
    navigate(term ? `/search?query=${encodeURIComponent(term)}` : "/search");
  };

  return (
    <>
      <header className="max-sm:relative border shadow-md border-red-300 bg-linear-to-r from-rose-200 via-red-100 to-amber-100 z-50">
        <div className="flex flex-wrap justify-between relative items-center gap-2 max-w-6xl mx-auto p-3">
          <NavLink to="/">
            <h1 className="text-[clamp(15px,10vw,30px)] font-bold flex flex-wrap">
              <span className="text-amber-400">the</span>
              <span className="text-red-900">Estate</span>
              <span className="text-red-900">Stage</span>
            </h1>
          </NavLink>

          <form className="relative flex items-center w-full sm:w-auto" onSubmit={handleSearch}>
            <Input
              type="text"
              name="searchbar"
              id="searchbar"
              placeholder="Search estate here..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={"pr-9"}
            />
            <button
              type="submit"
              className="absolute right-2.5 text-cyan-700 cursor-pointer"
            >
              <FaSearch />
            </button>
          </form>

          <ul className="flex flex-wrap justify-between items-center gap-4">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "font-extrabold text-red-900"
                  : "font-semibold text-red-900 hover:text-amber-700 transition-colors"
              }
              to="/"
            >
              <li className="hidden sm:inline">Home</li>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "font-extrabold text-red-900"
                  : "font-semibold text-red-900 hover:text-amber-700 transition-colors"
              }
              to="/about"
            >
              <li className="hidden sm:inline">About</li>
            </NavLink>

            {currentUser ? (
              <div className="max-sm:absolute max-sm:top-3 max-sm:right-4" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center  focus:outline-none"
                >
                  <img
                    src={currentUser.avatar}
                    alt="user-avatar"
                    className="rounded-full  w-9 h-9 outline-2 outline-mauve-500 hover:outline-cyan-600 transition-colors cursor-pointer object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>

                {/* Avatar Options Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-amber-50 rounded-xl border border-cyan-600 shadow-xl py-2 z-50">
                    <p className="px-4 py-1 text-xs text-amber-900 font-bold border-b border-amber-200 truncate">
                      {currentUser.username}
                    </p>
                    <NavLink
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-900 hover:bg-amber-100 transition-colors"
                    >
                      <FaUser className="text-xs text-cyan-700" /> Profile
                    </NavLink>
                    <NavLink
                      to={`/listings/${currentUser._id}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-900 hover:bg-amber-100 transition-colors"
                    >
                      <FaList className="text-xs text-cyan-700" /> Show Listings
                    </NavLink>
                    <NavLink
                      to="/create-listing"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-900 hover:bg-amber-100 transition-colors"
                    >
                      <FaPlus className="text-xs text-cyan-700" /> Create Listing
                    </NavLink>
                    <div className="border-t border-amber-200 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <FaSignOutAlt className="text-xs" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "font-extrabold text-red-900"
                    : "font-semibold text-red-900 hover:text-amber-700 transition-colors"
                }
                to="/sign-in"
              >
                <li>Login</li>
              </NavLink>
            )}
          </ul>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default Navbar;