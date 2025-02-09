import type { ReactNode } from "react";
import Header from "./header";
import { Toaster } from "../ui/sonner";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="max-w-4xl grow px-8 pt-8 sm:mx-auto sm:min-w-xl sm:border-r sm:border-l">
        {children}
      </main>
      {/* <footer className="grid h-16 place-content-center border-t shadow">
        @2025 Keepcoding
      </footer> */}
      <Toaster position="bottom-center" richColors />
    </div>
  );
}
