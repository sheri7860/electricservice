import { LegalPage } from "@/components/LegalPage";
import { DISCLOSURE, site } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Privacy Policy", description: `How ${site.name} collects, uses and shares information from calls and service requests.`, path: routes.privacy });

export default function Page() {
  return (
    <LegalPage title="Privacy Policy" path={routes.privacy} sections={[
      ["Who we are", DISCLOSURE],
      ["What we collect", "When you send a request: the service you need, ZIP code, timing, name, phone number, optional email and notes. When you call: the phone number you call from, call time and duration, and the call may be recorded for quality and dispute purposes where the law allows and with notice. Automatically: pages visited, device type, referring page and campaign parameters (such as utm tags and ad click IDs), stored in your browser for up to 30 days."],
      ["How we use and share it", "To route your call or request to up to three independent electricians who serve your area, so they can contact you by phone, text or email about your request. To measure which pages and ads lead to requests. We do not sell your information for any other purpose."],
      ["Call tracking", "Some phone numbers on this site are tracking numbers that forward to electricians. They let us attribute calls to pages or campaigns."],
      ["Your choices", "You can ask us to delete your request information or stop contact by replying STOP to texts or contacting us. Depending on your state, you may have additional rights to access, correct or delete personal information."],
      ["Security", "Requests are transmitted over HTTPS and delivered to buyers through signed connections. IP addresses are stored only as salted hashes for abuse prevention."],
      ["Changes", "We will update this page if our practices change. This policy needs review by counsel before launch."],
    ]} />
  );
}
