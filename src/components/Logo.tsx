import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/site";

/**
 * Brand logo (transparent WebP, made for dark backgrounds). `full` adds the
 * "Powering a brighter tomorrow" tagline and is used in the footer.
 */
export function Logo({ full = false }: { full?: boolean; light?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label={`${site.name} home`}>
      {full ? (
        <Image src="/brand/logo-full.webp" alt={site.name} width={703} height={240} className="h-16 w-auto sm:h-20" />
      ) : (
        <Image src="/brand/logo.webp" alt={site.name} width={537} height={168} priority className="h-10 w-auto min-[380px]:h-12 sm:h-14" />
      )}
    </Link>
  );
}
