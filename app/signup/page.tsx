"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [role, setRole] = useState("user"); // Default role is 'user'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phoneNumber: formData.get("phoneNumber"),
          password: formData.get("password"),
          role:"futsal_owner", // Use the role state here
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        {/* Back Button Inside the Container */}
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => router.push("/")} // Navigates back to the previous page
            className="px-4 py-2 text-white border border-gray-300 hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Back
          </Button>
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Full name"
                className="bg-white border-2 border-green-500 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              />
            </div>
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                className="bg-white border-2 border-green-500 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              />
            </div>
            <div>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                required
                placeholder="Phone number"
                className="bg-white border-2 border-green-500 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Password"
                className="bg-white border-2 border-green-500 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              />
            </div>
            {/* Optional: Role Selection */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="role" className="text-sm font-semibold text-gray-600">
                You are signing up as futsal owner
              </label>
              {/* <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-white border-2 border-green-500 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              >
                <option value="admin">Admin</option>
                <option value="futsal_owner">Futsal Owner</option>
              </select> */}
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
