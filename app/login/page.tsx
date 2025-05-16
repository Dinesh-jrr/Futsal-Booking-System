"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner"; // ✅ Sonner toast
import { baseUrl } from "@/lib/config";


export default function LoginPage() {
  const router = useRouter();
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
      toast.error(res.error || "Invalid credentials");
      return;
    }

    // ✅ Wait a moment and manually fetch session
    const response = await fetch("/api/auth/session");
    const session = await response.json();
    const role = session?.user?.role;
    const ownerId = session?.user?.id;

    if (role === "admin") {
      toast.success("Welcome, Admin!");
      router.push("/admin");
    } else if (role === "futsal_owner") {
      toast.success("Welcome, Owner!");
      const checkRes = await fetch(
        `${baseUrl}/api/by-owner?ownerId=${ownerId}`
      );
      const futsalData = await checkRes.json();

      if (checkRes.ok && futsalData?.futsal) {
        const status = futsalData.futsal.status;

        if (status === "approved") {
          router.push("/dashboard");
        } else {
          toast.info("Futsal is under review or rejected.");
          router.push("/futsalstatus");
        }
      } else {
        toast("No futsal found. Let's get started!");
        router.push("/createfutsal");
      }
    } else if (role === "user") {
      toast.error("Unauthorized: User access not allowed here.");
    } else {
      toast.error("Unknown role. Please contact support.");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong during login");
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
          Don&apos;t have an account?{" "}
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
