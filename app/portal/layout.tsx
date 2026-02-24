import { PortalNav } from "@/components/portal-nav";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <main className="container-page"><PortalNav />{children}</main>;
}
