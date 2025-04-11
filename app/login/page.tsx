"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        const session = await getSession();
        //@ts-ignore
        const role = session?.user?.role;
        //@ts-ignore
        const ownerId = session?.user?.id;
        console.log(ownerId);

        if (role === "admin") {
          router.push("/admin");
          console.log("checking...");
        } else if (role === "futsal_owner") {
          console.log("on it");
          const checkRes = await fetch(
            `http://localhost:5000/api/by-owner?ownerId=${ownerId}`
          );
          console.log("CheckRes OK:", checkRes.ok);
          const futsalData = await checkRes.json();
          console.log("FutsalData:", futsalData);

          console.log(futsalData)
          if (checkRes.ok && futsalData?.futsal) {
            const status = futsalData.futsal.status;  
            console.log("Owner ID:", ownerId);

 
            if (status === "approved") {
              router.push("/dashboard");
            } else if (status === "pending" || status === "rejected") {
              router.push("/futsalstatus"); // hold message page
            }
          } else {
            router.push("/createfutsal");
          }
          
        } else if (role === "user") {
          setError("Invalid login for this platform.");
        } else {
          setError("Unknown role. Contact support.");
        }
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="px-4 py-2 text-white border border-gray-300 hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Back
          </Button>
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <div className="rounded-md shadow-sm space-y-4">
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
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                className="bg-white border-2 border-green-500 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:text-primary/80"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
