"use client";

import { getCsrfToken, signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Loader } from "./loading/Loader";

export function SignIn() {
  const t = useTranslations("SignIn");

  const [csrfToken, setCsrfToken] = useState("");
  const [errorState, setErrorState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState(false);

  const search = useSearchParams();
  const error = search.get("error");
  const router = useRouter();

  useEffect(() => {
    if (error) {
      setErrorState(true);
    }
  }, [error]);

  useEffect(() => {
    async function loadProviders() {
      const csrf = await getCsrfToken();
      setCsrfToken(csrf);
    }
    loadProviders();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const res = await signIn("credentials", {
      password,
      redirect: false,
    });
    if (res?.error) {
      setErrorState(true);
    } else {
      setErrorState(false);
      setSuccessState(true);
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form
      className="flex flex-col items-center justify-start gap-4 p-4 "
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <section className="flex flex-col items-start gap-2">
        <label className="flex flex-col items-start gap-1 ">
          {errorState && (
            <p className="text-red-500 text-sm font-semibold">
              {t("ErrorMessage")}
            </p>
          )}
          {successState && (
            <p className="text-green-500 text-sm font-semibold">
              {t("SuccessMessage")}
            </p>
          )}
          <p className="text-base font-semibold">{t("SignInMessage")}</p>
          <input
            className="px-1 border-[1px] rounded-[5px]"
            name="password"
            type="password"
          />
        </label>
        <button
          className=" px-1.5 py-0.5 w-fit flex items-center gap-1 text-sm font-semibold rounded-[8px] border bg-card hover:brightness-95 transition-all text-card-foreground shadow-lg shadow-neutral-200/40 dark:shadow-none"
          disabled={loading}
        >
          {t("Submit")}
          {loading && <Loader visible={true} />}
        </button>
      </section>
    </form>
  );
}