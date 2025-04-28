"use client";

import { useEffect } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-red-50 px-6 text-center">
      <div className="animate-bounce mb-6">
        <XCircleIcon className="h-24 w-24 text-red-500 drop-shadow-lg" />
      </div>
      <h1 className="text-4xl font-bold text-red-700 mb-4">
        Payment Cancelled!
      </h1>
      <p className="text-lg text-gray-700 mb-2">
        It seems your transaction was cancelled or did not go through.
      </p>
      <p className="text-sm text-gray-500">{`You’ll`} be redirected shortly...</p>

      <button
        onClick={() => router.push("/")}
        className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition shadow-md"
      >
        Go to Homepage Now
      </button>
    </div>
  );
}
