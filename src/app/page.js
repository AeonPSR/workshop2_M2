import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <SectionHeading as="h1" eyebrow="◆ Bio Haut de Gamme">
        L'excellence artisanale,
        <span className="text-accent">livrée</span>.
      </SectionHeading>

      <Button variant="default">Default</Button>
      <Button variant="outline">outline</Button>
      <Button variant="secondary">secondary</Button>
      <Button variant="ghost">ghost</Button>
      <Button variant="destructive">destructive</Button>
      <Button variant="link">link</Button>
    </>
  );
}
