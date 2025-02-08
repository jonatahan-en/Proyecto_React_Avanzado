import { Link } from "react-router";
import { useAuth } from "../context";
import { logout } from "../service";

export default function AuthButton() {
  const { isLogged, onLogout } = useAuth();

  const handleClick = async () => {
    await logout();
    onLogout();
  };

  if (isLogged) {
    return <button onClick={handleClick}>Logout</button>;
  }

  return <Link to="/login">Login</Link>;
}
