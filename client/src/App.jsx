//lib imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//pages
import Home from "./pages/Home.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import About from "./pages/About.jsx";
import Navbar from "./components/Navbar.jsx";

const router = createBrowserRouter([
  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-up", element: <SignUp /> },
  {
    path: "/",
    element: <Navbar />,
    children: [
      { index: true, element: <Home /> },
      { path: "/profile", element: <Profile /> },
      { path: "/about", element: <About /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
