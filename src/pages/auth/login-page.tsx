import { type ChangeEvent, type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { login } from "./service";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/sonner";
import FormField from "@/components/shared/form-field";
import ActionButton from "@/components/shared/action-button";
import Logo from "@/components/shared/nodepop-react";
import type { Credentials } from "./types";
import { useAppDispatch, useAppSelector } from "@/store";
import { authLogin,  uiResetError } from "@/store/actions";
import { getUiSelector } from "@/store/selectors";



function LoginForm({
  onSubmit,
}: {
  onSubmit: (form: Credentials & { remember: boolean }) => Promise<void>;
}) {
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const {pending, error} = useAppSelector(getUiSelector)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCredentials((credentials) => ({
      ...credentials,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    const formData = new FormData(event.currentTarget);
    const remember = !!formData.get("remember");
    try {
      await dispatch(authLogin(credentials))
      await onSubmit({ ...credentials, remember });
    } catch (error) {
      console.log(error); 
    }
  };

  const { email, password } = credentials;
  const canSubmit = email && password;

  return (
    <div>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <FormField>
          Email
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            autoComplete="off"
          />
        </FormField>
        <FormField>
          Password
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            autoComplete="off"
          />
        </FormField>
        <FormField className="flex py-2">
          <Switch name="remember" value="remember" />
          Remember me next time
        </FormField>
        <ActionButton
          disabled={!canSubmit || pending}
          loading={pending}
          className="w-full"
        >
          {pending
            ? "Please wait"
            : canSubmit
              ? "Log in to Nodepop"
              : "Enter your credentials"}
        </ActionButton>
      </form>
      {error && (
        <div
          className="text-red-500 bg-red-100 border border-red-400 rounded p-2 cursor-pointer hover:bg-red-200 transition duration-300 ease-in-out"
          onClick={() => dispatch(uiResetError())}
        >
          {error.message}
        </div>
        )}
      <Toaster position="bottom-center" richColors />
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  

  

  return (
    <div className="mx-auto h-dvh max-w-md">
      <div className="grid gap-8 px-6 py-6 pt-12">
        <header className="grid justify-items-center gap-4">
          <Logo className="h-24 w-24" />
          <h1 className="text-center text-3xl font-bold sm:text-4xl">
            Log in to Nodepop
          </h1>
        </header>
        <LoginForm
          onSubmit={async ({ remember, ...credentials }) => {
            await login(credentials, remember);
            navigate(location.state?.from ?? "/", { replace: true });
          }}
        />
      </div>
    </div>
  );
}
