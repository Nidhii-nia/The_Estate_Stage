import { FaSearch } from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
import { Input } from "./ui/input";
import { useSelector } from "react-redux";

//file
import { userSelector } from "@/redux/slice/user.slice";

const Navbar = () => {
  const { currentUser } = useSelector(userSelector);
  return (
    <>
      <header className="max-sm:relative border shadow-md border-red-300 bg-linear-to-r from-rose-200 via-red-100 to-amber-100">
        <div className="flex flex-wrap justify-between items-center gap-2 max-w-6xl mx-auto p-3">
          <h1 className="text-[clamp(15px,10vw,30px)] font-bold flex flex-wrap">
            <span className="text-amber-400">the</span>
            <span className="text-red-900">Estate</span>
            <span className="text-red-900">Stage</span>
          </h1>
          <form className="relative flex items-center w-full sm:w-auto">
            <Input
              type="text"
              name="searchbar"
              id="searchbar"
              placeholder="Search estate here..."
              className={"pr-9"}
            />
            <button
              type="submit"
              className="absolute right-2.5 text-cyan-700 cursor-pointer"
            >
              <FaSearch />
            </button>
          </form>
          <ul className=" flex flex-wrap justify-between items-center">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "font-extrabold"
                  : "font-semibold text-red-900 hover:text-amber-700 transition-colors"
              }
              to="/"
            >
              <li className="text-red-900 pr-4 hover:text-amber-700 transition-colors hidden sm:inline">
                Home
              </li>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "font-extrabold"
                  : "font-semibold text-red-900 hover:text-amber-700 transition-colors"
              }
              to="/about"
            >
              <li className="text-red-900 pr-4 hover:text-amber-700 transition-colors hidden sm:inline">
                About
              </li>
            </NavLink>
            {currentUser ? (
              <NavLink to="profile" className={"max-sm:absolute max-sm:top-5 max-sm:right-5"}>
                <img src={currentUser.avatar} alt="user-avatar" className=" rounded-full w-9 h-9 outline-2 outline-mauve-400 hover:outline-cyan-600 transition-transform" referrerPolicy="no-referrer"/>
              </NavLink>
            ) : (
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "font-extrabold"
                    : "font-semibold text-red-900 hover:text-amber-700 transition-colors"
                }
                to="/sign-in"
              >
                <li className="text-red-900 pr-4 hover:text-amber-700 transition-colors">
                  Login
                </li>
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
