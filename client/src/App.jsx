//lib imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//pages
import Home from "./pages/Home.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import About from "./pages/About.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

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
        path: "/",
        element: <PrivateRoute />,
        children: [{ path: "profile", element: <Profile /> }],
      },
      { path: "about", element: <About /> },
    ],
  },
  { path: "*", element: <ErrorPage /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
