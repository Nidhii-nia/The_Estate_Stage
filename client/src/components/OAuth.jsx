import { app } from "@/config/firebase.config";
import { Button } from "./ui/button";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "@/redux/slice/user.slice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const res = await signInWithPopup(auth, provider);

      console.log("Firebase result:", res);
      const response = await axios.post("/api/auth/google", {
        name: res.user.displayName,
        email: res.user.email,
        avatar: res.user.photoURL,
      });
      console.log("Response backend google:", response);

      dispatch(
        signInSuccess(response.data.data),
      );
      navigate("/");
    } catch (e) {
      console.log("OAuth error:", e.message);
    }
  };

  return (
    <Button
      onClick={handleGoogleClick}
      type="button"
      className="flex flex-wrap w-full transition-transform hover:scale-[1.02] hover:opacity-95"
    >
      <span>Continue</span>
      <span>with</span>
      <span>Google</span>
    </Button>
  );
};

export default OAuth;
