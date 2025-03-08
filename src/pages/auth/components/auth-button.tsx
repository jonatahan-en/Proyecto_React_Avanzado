import { Link } from "react-router";
import ConfirmationButton from "@/components/shared/confirmation-button";
import { logout } from "../service";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import { authLogout } from "@/store/actions";
import { getIsLogged } from "@/store/selectors";

function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await logout();
    dispatch(authLogout());
  };

  return (
    <ConfirmationButton
      variant="outline"
      confirmation="Are you sure you want to log out?"
      confirmButton={
        <Button onClick={handleLogout} variant="destructive">
          Yes
        </Button>
      }
    >
      Log out
    </ConfirmationButton>
  );
}

export default function AuthButton() {
  const isLogged = useAppSelector(getIsLogged);

  if (isLogged) {
    return <LogoutButton />;
  }

  return <Link to="/login">Login</Link>;
}
