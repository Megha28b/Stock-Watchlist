"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup/",
        { username, password }
      );
      localStorage.setItem("authToken", response.data.token);
      toast.success("Signup successful");
      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        transition={Bounce}
      />
      <form onSubmit={handleSignup} className="space-y-4">
        <h2 className="text-2xl font-bold">Sign Up</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </>
  );
}
