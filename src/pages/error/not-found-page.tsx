import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <div className="mb-8">
          <div className="mx-auto my-4 h-1 w-16 bg-blue-500"></div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button asChild>
          <Link to="/adverts">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
