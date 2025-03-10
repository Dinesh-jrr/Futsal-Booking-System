
"use client"
import Header from "@/components/Header";
import UsersTable from "@/components/UsersTable";
import FutsalListings from "@/components/FutsalListings";
import AdminUserListings from "@/components/AdminUsersListing"
export default function Home() {
  return (
    <div className="p-8">

      <AdminUserListings/>
     
    </div>
  );
}