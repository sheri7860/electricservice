import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Accessibility", description: `${site.name} aims to meet WCAG 2.2 AA. How to report an accessibility problem.`, path: routes.accessibility });

export default function Page() {
  return (
    <LegalPage title="Accessibility" path={routes.accessibility} sections={[
      ["Our goal", "We aim for this site to meet WCAG 2.2 Level AA: keyboard navigation, visible focus, sufficient contrast, labeled form fields and text alternatives."],
      ["Need help?", `If any part of the site is hard to use, call ${site.phone} and we will take your request by phone.`],
      ["Report a problem", "Tell us the page and what went wrong, and we will work to fix it."],
    ]} />
  );
}
