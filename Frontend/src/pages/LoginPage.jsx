import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode"); // login หรือ signup
  const [isLogin, setIsLogin] = useState(mode !== "signup");

  useEffect(() => {
    setIsLogin(mode !== "signup");
  }, [mode]);

  const toggleForm = () => setIsLogin((prev) => !prev);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        {isLogin ? (
          <LoginForm onSwitch={toggleForm} />
        ) : (
          <SignupForm onSwitch={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
