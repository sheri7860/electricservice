import Link from "next/link";
import { routes } from "@/lib/routes";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
    <Header />
    <main id="main">
    <div className="container-x max-w-2xl py-24 text-center">
      <p className="font-display text-7xl font-bold text-volt-dark">404</p>
      <h1 className="mt-4 text-3xl font-bold">That page isn&apos;t here</h1>
      <p className="mt-3 text-muted">Try the services list, find your state, or call us.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={routes.services} className="btn btn-secondary">Electrical services</Link>
        <Link href={routes.locations} className="btn btn-outline">Locations</Link>
      </div>
    </div>
    </main>
    <Footer />
    </>
  );
}
