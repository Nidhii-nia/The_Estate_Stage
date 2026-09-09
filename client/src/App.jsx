//lib imports
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import "sonner/dist/styles.css"; // Added CSS import

import { logoutUserSuccess, signInSuccess } from "@/redux/slice/user.slice";

//pages
import Home from "./pages/Home.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import About from "./pages/About.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import Listings from "./pages/Listings.jsx";
import Loader from "./components/Loader.jsx";
import EditListing from "./pages/EditListing.jsx";
import ListingDetails from "./pages/ListingDetails.jsx";
import Search from "./pages/Search.jsx";

axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  { path: "/sign-in", element: <SignIn />, errorElement: <ErrorPage /> },
  { path: "/sign-up", element: <SignUp />, errorElement: <ErrorPage /> },
  {
    path: "/",
    element: <Navbar />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "search", element: <Search /> },
      { path: "listing/:listingId", element: <ListingDetails /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "create-listing", element: <CreateListing /> },
          {path: "listings/:userId", element: <Listings />},
          {path: "edit-listings/:listingId", element: <EditListing />}
        ],
      },
      { path: "about", element: <About /> },
    ],
  },
  { path: "*", element: <ErrorPage /> },
]);

const App = () => {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      try {
        const { data } = await axios.get("/api/auth/session");

        if (active && data?.data) {
          dispatch(signInSuccess(data.data));
        }
      } catch (error) {
        console.log("Error app.jsx:", error);
        
        if (active) {
          dispatch(logoutUserSuccess());
        }
      } finally {
        if (active) {
          setAuthChecked(true);
        }
      }
    };

    verifySession();

    return () => {
      active = false;
    };
  }, [dispatch]);

  if (!authChecked) {
    return <Loader/>;
  }

  return (
    <>
      <Toaster
        position="top-right"
        offset="75px"
        toastOptions={{
          style: {
            width: "fit-content", // Shrinks box width to fit text tightly
            maxWidth: "260px", // Prevents it from becoming too wide
            fontSize: "13px", // Slightly smaller font for compact look
            padding: "8px 12px", // Reduces inner padding/height
            marginRight: "-70px", // Pushes it closer to the right viewport edge
          },
          className: "max-sm:!top-16 max-sm:!max-w-[120vw]",
        }}
      />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
