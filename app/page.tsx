
import Header from "@/components/Header";
import UsersTable from "@/components/UsersTable";
import FutsalListings from "@/components/FutsalListings";
export default function Home() {
  return (
    <div className="p-8">

      <UsersTable/>
      <FutsalListings/>
    </div>
  );
}