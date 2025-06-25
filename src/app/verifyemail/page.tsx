"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [hasError, setHasError] = useState(false); // Renamed to avoid ESLint warning

  const verifyUserEmail = useCallback(async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        setHasError(true); // Properly set error state
      }
    }
  }, [token]);

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token, verifyUserEmail]); // ✅ Fixed missing dependency warning

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black">
        {token ? token : "no token"}
      </h2>

      {verified && (
        <div>
          <h2 className="text-2xl">Email Verified</h2>
          <Link href="/login">Login</Link>
        </div>
      )}

      {hasError && (
        <div>
          <h2 className="text-2xl bg-red-500 text-black">Error verifying email</h2>
        </div>
      )}
    </div>
  );
}
