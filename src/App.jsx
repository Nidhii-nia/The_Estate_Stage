//lib imports
import React from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom"

//pages
import Home from "./pages/Home.jsx"
import SignIn from "./pages/SignIn.jsx"
import SignUp from "./pages/SignUp.jsx"
import Profile from "./pages/Profile.jsx"
import About from "./pages/About.jsx"



const router = createBrowserRouter([
  {path:"/", element:<Home/>},
  {path:"/sign-in", element:<SignIn /> },
  {path: "/sign-out", element:<SignUp/>},
  {path:"/profile", element:<Profile/>},
  {path:"/about", element:<About/>}
])

const App = () => {
  return (
    <RouterProvider router={router}/>
  )
}

export default App