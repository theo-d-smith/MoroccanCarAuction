import React, { useState } from "react";
import { X } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function AuthModal() {
  const {
    authMode,
    setAuthMode,
    handleLogin,
    handleRegister,
    setShowAuthModal,
  } = useAppContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    isSeller: false,
  });
  const [error, setError] = useState("");

  const onSubmit = () => {
    setError("");
    if (authMode === "login") {
      if (!handleLogin(formData.email, formData.password))
        setError("Invalid credentials");
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError("Fill all fields");
        return;
      }
      if (
        !handleRegister(
          formData.email,
          formData.password,
          formData.name,
          formData.isSeller
        )
      )
        setError("Email exists");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {authMode === "login" ? "Login" : "Register"}
          </h2>
          <button
            onClick={() => setShowAuthModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          {authMode === "register" && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            onKeyPress={(e) => e.key === "Enter" && onSubmit()}
          />
          {authMode === "register" && (
            <label className="flex items-center gap-3 text-white">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={formData.isSeller}
                onChange={(e) =>
                  setFormData({ ...formData, isSeller: e.target.checked })
                }
              />
              <span>Register as a seller</span>
            </label>
          )}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={onSubmit}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg"
          >
            {authMode === "login" ? "Login" : "Create Account"}
          </button>
        </div>
        <p className="text-gray-400 text-center mt-6">
          {authMode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
            className="text-amber-500"
          >
            {authMode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
