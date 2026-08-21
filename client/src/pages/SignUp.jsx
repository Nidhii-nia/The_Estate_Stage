import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

// 1. Submit Button component
const SubmitButton = ({ isFormDataEmpty }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || isFormDataEmpty}
      className="w-full bg-cyan-700 hover:bg-cyan-600 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Signing Up..." : "Sign Up"}
    </Button>
  );
};

// 2. Action function that handles submission and state returns
const signUpAction = async (previousState, formData) => {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const res = await axios.post("/api/user/signUp", {
      username,
      email,
      password,
    });
    console.log("Backend Response for SignUp:", res);
    return { error: null, success: true };
  } catch (e) {
    console.log("Backend error for SignUp:", e.response.data);
    return {
      error: e?.response?.data || e.message || "An error occurred",
      success: false,
    };
  }
};

const SignUp = () => {
  const [visible, setVisibility] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // 3. Hook handles formAction state lifecycle
  const [state, formAction] = useActionState(signUpAction, {
    error: null,
    success: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const isFormDataEmpty =
    !formData?.username?.trim() ||
    !formData?.email?.trim() ||
    !formData?.password?.trim();

    useEffect(()=>{
      if(state.success){
        navigate("/sign-in");
      }
    },[state.success,navigate])

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="flex w-full m-3 max-w-xs flex-col items-center gap-6 rounded-2xl border border-cyan-600 bg-amber-50 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold text-amber-900 sm:text-3xl">
          SignUp
        </h1>

        {state?.error && (
          <div className="w-full rounded bg-red-100 p-2 text-center text-xs text-red-600">
            {state.error}
          </div>
        )}

        <form
          action={(formData) => {
            formAction(formData);
          }}
          className="flex w-full flex-col items-center gap-5"
        >
          <Input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            className="w-full caret-lime-800 selection:bg-red-300 shadow-sm"
            value={formData.username}
            onChange={handleChange}
          />
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
              type={visible === true ? "text" : "password"}
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

          <span className="text-xs text-gray-500 sm:text-sm">
            Note: The password must contain at least 8 characters, at least one
            of each - special character, uppercase alphabet, lowercase alphabet,
            digit.
          </span>

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
            Have an account?{" "}
            <NavLink
              to={"/sign-in"}
              className={"text-cyan-700 hover:underline"}
            >
              Sign in
            </NavLink>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;