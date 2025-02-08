import { type ChangeEvent, type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "./context";
import { login } from "./service";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
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
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const { email, password } = credentials;
  const buttonDisabled = !email || !password || isLoading;

  return (
    <div>
      <header>
        <h1>Log in to Nodepop</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <label className="block">
            email
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            password
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </label>
          <label className="block">
            remember
            <input type="checkbox" name="remember" value="remember" />
          </label>
          <button type="submit" disabled={buttonDisabled}>
            Log in
          </button>
        </form>
        {error && (
          <div
            onClick={() => {
              setError(null);
            }}
            className="text-red-600"
          >
            {error.message}
          </div>
        )}
      </main>
    </div>
  );
}
