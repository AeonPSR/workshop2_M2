import SectionHeading from "@/components/shared/SectionHeading";
export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <SectionHeading as="h1" eyebrow="◆ Bio Haut de Gamme">
        L'excellence artisanale,
        <span className="text-accent">livrée</span>.
      </SectionHeading>
    </main>
  );
}
