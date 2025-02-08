import { Link } from "react-router";
import ConfirmationButton from "@shared/confirmation-button";
import { useAuth } from "../context";
import { logout } from "../service";

export default function AuthButton() {
  const { isLogged, onLogout } = useAuth();

  const handleClick = async () => {
    await logout();
    onLogout();
  };

  if (isLogged) {
    return (
      <ConfirmationButton onConfirm={handleClick}>Logout</ConfirmationButton>
    );
  }

  return <Link to="/login">Login</Link>;
}
