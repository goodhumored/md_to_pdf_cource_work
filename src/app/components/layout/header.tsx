import "reflect-metadata";
import Navbar from "./navbar";

export default async function Header() {

  return (
    <header className="bg-soft-brown w-full">
      <Navbar />
    </header>
  );
}
