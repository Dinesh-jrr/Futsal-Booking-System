"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    phoneNumber: "",
  });

  const validateEmail = (email: string) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\d{7,15}$/.test(phone); // Accepts 7 to 15 digits
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setValidationErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Invalid email format",
      }));
    }

    if (name === "phoneNumber") {
      setValidationErrors((prev) => ({
        ...prev,
        phoneNumber: validatePhone(value) ? "" : "Invalid phone number",
      }));
    }
  };

  //function to handle submit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!validatePhone(form.phoneNumber)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      // Step 1: Register the user (unverified)
      const registerRes = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "futsal_owner" }),
      });
  
      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        toast.error(errorData.message || "Registration failed");
        setIsSubmitting(false);
        return;
      }
  
      // Step 2: Send OTP to email
      const otpRes = await fetch("http://localhost:5000/api/users/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
  
      if (!otpRes.ok) {
        toast.error("Failed to send OTP. Please try again.");
        setIsSubmitting(false);
        return;
      }
  
      // Step 3: Save email to localStorage
      // localStorage.setItem("email", form.email);
      // toast.success("OTP sent! Please verify your email.");
      // console.log("Redirecting to /verify-otp");
      router.push("/emailverify");
      console.log("Redirected to emailverify");
  
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-green-500 hover:text-white"
        >
          Back
        </Button>

        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="space-y-4">
            <Input
              name="name"
              placeholder="Full name"
              required
              value={form.name}
              onChange={handleChange}
              className="bg-white border-2 border-green-500 text-black"
            />

            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email address"
                required
                value={form.email}
                onChange={handleChange}
                className="bg-white border-2 border-green-500 text-black"
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <Input
                name="phoneNumber"
                placeholder="Phone number"
                required
                value={form.phoneNumber}
                onChange={handleChange}
                className="bg-white border-2 border-green-500 text-black"
              />
              {validationErrors.phoneNumber && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.phoneNumber}</p>
              )}
            </div>

            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={form.password}
                onChange={handleChange}
                className="bg-white border-2 border-green-500 text-black pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <p className="text-sm text-gray-600 mt-1">
              You are signing up as a <strong>Futsal Owner</strong>
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Sign up and verify"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
