"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 md:px-6 py-6 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-emerald-400">
            FootLock
          </h1>
          <div className="space-x-2 md:space-x-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-gray-900 text-sm md:text-base"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-gray-900 text-sm md:text-base"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section className="relative text-center">
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
        <div
          className="bg-cover bg-center h-[80vh] md:h-[90vh] relative flex items-center justify-center px-6"
          style={{
            backgroundImage: "url('/images/court-bg.jpg')",
          }}
        >
          <div className="relative z-20 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-emerald-300">
              Book Your Perfect Futsal Match
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-6 px-2 md:px-0">
              Discover the best futsal courts nearby. Book effortlessly. Play passionately.
            </p>
            <Link href="/signup">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-gray-900 px-6 py-3 text-base md:text-lg"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 md:px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: "Easy Booking", desc: "Book courts in just a few clicks with real-time availability." },
            { title: "Chat with Players", desc: "Coordinate with friends and opponents through built-in messaging." },
            { title: "Opponent Finder", desc: "Match with players at your skill level in your area." },
            { title: "Seamless Payments", desc: "Integrated, secure, and fast payment options." },
            { title: "Instant Notifications", desc: "Get notified about matches, chats, and booking updates instantly." },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-2xl transition-shadow h-full"
            >
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-emerald-300">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h4 className="text-xl md:text-2xl font-semibold mb-3 text-emerald-400">
            Get Connected
          </h4>
          <p className="mb-6 text-gray-400 text-sm md:text-base">
            Follow us on social media for the latest futsal updates
          </p>
          <div className="flex justify-center flex-wrap gap-3 md:gap-4">
            <Link href="https://facebook.com" passHref>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-white border-white hover:bg-white hover:text-gray-900"
              >
                <FaFacebookF /> Facebook
              </Button>
            </Link>
            <Link href="https://twitter.com" passHref>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-white border-white hover:bg-white hover:text-gray-900"
              >
                <FaTwitter /> Twitter
              </Button>
            </Link>
            <Link href="https://instagram.com" passHref>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-white border-white hover:bg-white hover:text-gray-900"
              >
                <FaInstagram /> Instagram
              </Button>
            </Link>
          </div>

          <div className="mt-10 border-t border-gray-700 pt-6 text-sm text-gray-500">
            <p>© 2025 FootLock. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
