import "reflect-metadata";
import { container } from "tsyringe";
import SessionManager from "../../session/session-manager";
import Navbar from "./navbar";

const sessionManager = container.resolve(SessionManager);

export default async function Header() {
  const session = await sessionManager.getSession();

  return (
    <header className="bg-soft-brown w-full">
      <Navbar username={session?.getUser()?.getUsername()} />
    </header>
  );
}
