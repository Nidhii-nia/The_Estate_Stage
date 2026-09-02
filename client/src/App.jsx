//lib imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import "sonner/dist/styles.css"; // Added CSS import

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

const router = createBrowserRouter([
  { path: "/sign-in", element: <SignIn />, errorElement: <ErrorPage /> },
  { path: "/sign-up", element: <SignUp />, errorElement: <ErrorPage /> },
  {
    path: "/",
    element: <Navbar />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "create-listing", element: <CreateListing /> },
        ],
      },
      { path: "about", element: <About /> },
    ],
  },
  { path: "*", element: <ErrorPage /> },
]);

const App = () => {
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
