import { LegalPage } from "@/components/LegalPage";
import { DISCLOSURE, site } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Terms of Use", description: `Terms for using ${site.name}, a free referral service connecting homeowners with independent electricians.`, path: routes.terms });

export default function Page() {
  return (
    <LegalPage title="Terms of Use" path={routes.terms} sections={[
      ["The service", DISCLOSURE],
      ["No contractor relationship", `${site.name} is not a party to any agreement between you and an electrician. Quotes, scheduling, warranties, permits and payment are between you and the electrician you choose to hire.`],
      ["Verify before you hire", "You are responsible for verifying any electrician's license, insurance and references before work begins."],
      ["Information on this site", "Guides and service pages are general information, not professional advice for your specific property. Electrical codes and permit rules vary by location."],
      ["Emergencies", "If there is smoke, fire or a downed power line, call 911 and your utility. Do not rely on this website in an emergency."],
      ["Limitation of liability", `To the extent permitted by law, ${site.name} is not liable for the work, conduct or pricing of independent electricians.`],
      ["Review", "These terms need review by counsel before launch."],
    ]} />
  );
}
