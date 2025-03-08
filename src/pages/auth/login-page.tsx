import { type ChangeEvent, type FormEvent, useState, useEffect } from "react";
import { login } from "./service";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/sonner";
import FormField from "@/components/shared/form-field";
import ActionButton from "@/components/shared/action-button";
import Logo from "@/components/shared/nodepop-react";
import type { Credentials } from "./types";
import { useAppDispatch, useAppSelector } from "@/store";
import { authLogin, uiResetError, authSetRememberMe } from "@/store/actions";
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
  const { pending, error } = useAppSelector(getUiSelector);
  const rememberMe = useAppSelector((state) => state.rememberMe);

  useEffect(() => {
    dispatch(authSetRememberMe(rememberMe));
  }, [dispatch, rememberMe]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCredentials((credentials) => ({
      ...credentials,
      [event.target.name]: event.target.value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    dispatch(authSetRememberMe(checked));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await dispatch(authLogin(credentials, rememberMe));
    await onSubmit({ ...credentials, remember: rememberMe });
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
          <Switch
            name="remember"
            checked={rememberMe}
            onCheckedChange={handleCheckboxChange}
          />
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
          className="cursor-pointer rounded border border-red-400 bg-red-100 p-2 text-red-500 transition duration-300 ease-in-out hover:bg-red-200"
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
          }}
        />
      </div>
    </div>
  );
}
