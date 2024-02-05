import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import handleLogout from "../../auth/handle-logout";

export default function LogoutButton({ className }: { className?: string }) {
  return (
    <button
      className={`text-white ${className}`}
      onClick={async () => {
        await handleLogout();
      }}
    >
      <FontAwesomeIcon icon={faArrowRightFromBracket} />
    </button>
  );
}
