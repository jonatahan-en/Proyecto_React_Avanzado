import { type ChangeEvent, type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "./context";
import { login } from "./service";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { isApiClientError } from "@/api/error";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { onLogin } = useAuth();

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
      setIsLoading(true);
      await login(credentials, remember);
      onLogin();
      navigate(location.state?.from ?? "/", { replace: true });
    } catch (error) {
      if (isApiClientError(error)) {
        toast.error(error.message);
      } else {
        toast.error("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const { email, password } = credentials;
  const buttonDisabled = !email || !password || isLoading;

  return (
    <div className="mx-auto h-dvh max-w-md">
      <div className="px-6 pt-20">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Log in to Nodepop</h1>
          <p className="text-muted-foreground mt-2 hidden sm:block">
            Enter your credentials and enjoy nodepop!
          </p>
        </header>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
            />
          </div>
          <div className="text-muted-foreground has-checked:text-foreground flex items-center gap-2 py-2">
            <Switch id="remember" name="remember" value="remember" />
            <Label htmlFor="remember">Remember me next time</Label>
          </div>
          <Button type="submit" disabled={buttonDisabled} className="w-full">
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? "Please wait" : "Log in"}
          </Button>
        </form>
        <Toaster position="bottom-center" richColors />
      </div>
    </div>
  );
}
