import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormStatus } from "react-dom";
import { useActionState, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";

// File imports
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/slice/user.slice.js";

// 1. Submit Button Component
const SubmitButton = ({ isFormDataEmpty }) => {
  const { pending } = useFormStatus();
  const btnStatus = pending || isFormDataEmpty;

  return (
    <Button
      type="submit"
      disabled={btnStatus}
      className="w-full bg-cyan-700 hover:bg-cyan-600 transition-transform hover:scale-[1.02]"
    >
      {pending ? "Signing In..." : "Sign In"}
    </Button>
  );
};

// 2. Main Component
const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [visible, setVisibility] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Action function defined inside component to access dispatch and navigate safely
  const signInAction = async (previousState, formDataPayload) => {
    const email = formDataPayload.get("email");
    const password = formDataPayload.get("password");

    // 1. Start Redux loading state
    dispatch(signInStart());

    try {
      const res = await axios.post("/api/user/login", { email, password });
      
      // 2. Dispatch Redux success state with returned user data
      dispatch(signInSuccess(res.data));

      // 3. Redirect immediately on successful login
      navigate("/");

      return {
        success: true,
        error: null,
      };
    } catch (e) {
      // Extract clean error message string to prevent rendering raw objects
      const errorMessage =
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : null) ||
        e.message ||
        "An error occurred!";

      // 4. Dispatch Redux failure state
      dispatch(signInFailure(errorMessage));

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Form handling hook
  const [state, formAction] = useActionState(signInAction, {
    success: false,
    error: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const isFormDataEmpty = !formData.email.trim() || !formData.password.trim();

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="flex w-full m-3 max-w-xs flex-col items-center gap-6 rounded-2xl border border-cyan-600 bg-amber-50 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-amber-900 sm:text-3xl">
          SignIn
        </h1>

        {state?.error && (
          <div className="w-full rounded bg-red-100 p-2 text-center text-xs text-red-600">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex w-full flex-col items-center gap-5">
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            className="w-full caret-lime-800 selection:bg-red-300 shadow-sm"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="w-full relative flex flex-wrap justify-between items-center">
            <Input
              type={visible ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full pr-9 caret-lime-800 selection:bg-red-300 shadow-sm"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-3.5 text-gray-600"
              onClick={() => setVisibility((prev) => !prev)}
            >
              {visible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <SubmitButton isFormDataEmpty={isFormDataEmpty} />
          <Button
            type="button"
            className="w-full transition-transform hover:scale-[1.02]"
          >
            Continue with Google
          </Button>
        </form>

        <div>
          <span className="text-gray-800">
            Don't have an account?{" "}
            <NavLink
              to={"/sign-up"}
              className={"text-cyan-700 hover:underline"}
            >
              Sign up
            </NavLink>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;