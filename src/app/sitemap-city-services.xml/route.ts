import { sitemapResponse } from "@/lib/sitemap";

export const dynamic = "force-static";
export const GET = () => sitemapResponse("city-services");
