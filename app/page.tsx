import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { getServerSession } from "next-auth"; // Uncomment if you plan to use sessions
// import { redirect } from "next/navigation"; // Uncomment if you plan to handle redirection
// import { authOptions } from "./api/auth/[...nextauth]/route"; // Uncomment if you want to use authOptions for session handling

export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header Section */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold">FootLock</div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                Sign up
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Book Your Perfect Futsal Match
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Find and book the best futsal courts in your area. Join the largest futsal community and start playing today.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Easy Booking</h3>
            <p className="text-gray-300">
              Book your preferred futsal court in just a few clicks, with real-time availability.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Chat with Players</h3>
            <p className="text-gray-300">
              Connect with other players, organize matches, and discuss your game strategy through our chat feature.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Opponent Finder</h3>
            <p className="text-gray-300">
              Find opponents of your skill level nearby to challenge and play a match with.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Seamless Payments</h3>
            <p className="text-gray-300">
              Easily pay for court bookings through integrated secure payment gateways.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Instant Notifications</h3>
            <p className="text-gray-300">
              Receive instant notifications for match updates, booking confirmations, and opponent messages.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="container mx-auto px-6">
          {/* Get Connected Section */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-4">Get Connected</h3>
            <p className="text-lg mb-4">
              Stay connected with us through our social media channels or contact support.
            </p>
            <div className="space-x-6">
              <Link href="https://facebook.com" passHref>
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                  Facebook
                </Button>
              </Link>
              <Link href="https://twitter.com" passHref>
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                  Twitter
                </Button>
              </Link>
              <Link href="https://instagram.com" passHref>
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                  Instagram
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          <p>© 2025 FutsalLock. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
