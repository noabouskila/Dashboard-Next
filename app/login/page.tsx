import AcmeLogo from "../ui/acme.logo";
import LoginForm from "../ui/login-form";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Connexion",
};

const LoginPage = () => {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">{<AcmeLogo />}</div>
        </div>
        <Suspense fallback={<p>Chargement du formulaire...</p>}>
          <LoginForm />
        </Suspense>
        <div className="mt-4 rounded-md bg-gray-50 p-4 text-center text-sm text-gray-700">
          <p>
            si vous souhaitez decouvrir le Dashboard que j&apos;ai crée :
            connectez vous grace à
          </p>
          <span>email: user@gmail.com, password: 123456</span>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
