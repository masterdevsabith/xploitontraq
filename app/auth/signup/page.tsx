"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    setError("");

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    const { error: addedError } = await supabase
      .from("users")
      .insert([{ email, password }])
      .select("*");

    if (addedError) {
      setError(addedError.message);
      return;
    }

    const user = data.user;
    if (user) {
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("user_email", user.email || "");
    }

    toast.success("Account created successfully");
    router.push("/dashboard");
  };

  return (
    <main className="flex items-center justify-center h-screen bg-black text-white">
      <ToastContainer theme="dark" />
      <div className="w-full max-w-md px-8 py-10 bg-zinc-900 rounded-2xl shadow-lg border border-zinc-700">
        <h1 className="text-center text-4xl font-bold mb-6 text-transparent bg-gradient-to-tr from-zinc-300 via-zinc-500 to-zinc-700 bg-clip-text">
          Sign Up - XploitAgent
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 bg-zinc-800 border border-zinc-600 rounded text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-6 bg-zinc-800 border border-zinc-600 rounded text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignup}
          className="w-full py-2 bg-gradient-to-tr from-zinc-700 via-zinc-600 to-zinc-800 text-white rounded-2xl hover:opacity-90 transition"
        >
          Sign Up
        </button>

        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
        )}
      </div>
    </main>
  );
}
