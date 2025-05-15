"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { baseUrl } from "@/lib/config";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [email, setEmail] = useState("");

  // Load email from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error("Email not found. Please sign up again.");
      router.push("/signup");
    }
  }, [router]);

  // Countdown for resend timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle input change with auto-focus
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("Text").slice(0, 6);
    if (!/^\d{6}$/.test(pasted)) return;

    const newOtp = pasted.split("");
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
  };

  // ✅ Verify OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Please enter the full 6-digit OTP.");
      return;
    }

    setIsVerifying(true);
    try {
      console.log("📧 Email:", email);
      console.log("🔢 OTP:", code);

      const res = await fetch(`${baseUrl}/api/users/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Verification failed");
        setIsVerifying(false);
        return;
      }

      toast.success("Email verified successfully!");
      localStorage.removeItem("email"); // optional cleanup
      router.push("/login");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  // ✅ Resend OTP
  const resendOtp = async () => {
    if (!email) return toast.error("No email found to resend OTP.");
    try {
      const res = await fetch(`${baseUrl}/api/users/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("OTP resent!");
        setOtp(Array(6).fill("")); // clear input
        setTimer(60); // restart timer
      } else {
        toast.error("Failed to resend OTP.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while resending OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.push("/signup")}
          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-green-500 hover:text-white"
        >
          Back
        </Button>

        <h1 className="text-2xl font-bold text-center text-gray-800">Verify Your Email</h1>
        <p className="text-sm text-center text-gray-600">
          Enter the 6-digit OTP sent to <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} onPaste={handlePaste} className="flex flex-col items-center space-y-6">
          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-xl border-2 border-green-500 rounded-lg outline-none focus:ring-2 focus:ring-green-400 transition-all text-black"
              />
            ))}
          </div>

          <Button type="submit" disabled={isVerifying} className="w-full">
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </form>

        <div className="text-sm text-center text-gray-600">
          {timer > 0 ? (
            <p>
              Resend OTP in <span className="font-semibold text-gray-800">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={resendOtp}
              className="text-green-600 font-medium hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
