import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

//1. Submit Button
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

//2.Handling formstatus

const signInAction = async (previousState, formData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const res = await axios.post("/api/user/login", { email, password });
    console.log("Backend Response for signIn", res);

    return {
      success: true,
      error: null,
    };
  } catch (e) {
    console.log("Backend error for signIn: ", e.response.data);
    return {
      success: false,
      error: e?.response?.data || e.message || "An error occurred!",
    };
  }
};

const SignIn = () => {
  //STATE HOOK
  const [visible, setVisibility] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  //FORM HANDLING HOOK
  const [state, formAction] = useActionState(signInAction, {
    success: false,
    error: null,
  });

  const isFormDataEmpty = !formData.email.trim() || !formData.password.trim();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  console.log("Form Data Sign-in:", formData);

  //FORM RESET

  //NAVIGATION
  useEffect(() => {
    if (state.success) {
      navigate("/");
    }
  }, [state.success, navigate]);

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

        <form
          action={(formData) => {
            formAction(formData);
          }}
          className="flex w-full flex-col items-center gap-5"
        >
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

          <SubmitButton isFormDataEmpty={isFormDataEmpty} />
          <Button className="w-full transition-transform hover:scale-[1.02]">
            Continue with Google
          </Button>
        </form>
        <div>
          <span className="text-gray-800">
            Have an account?{" "}
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
