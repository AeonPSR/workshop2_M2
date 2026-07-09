"use client";

import Link from "next/link";
import OurValuesSection from "@/components/about/OurValuesSection";
import StatsSection from "@/components/about/StatsSection";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <section>
      <div className="flex flex-col items-center gap-16">
        <div className="relative h-60 w-full bg-black lg:h-70">
          <img
            src="/images/about/cover-photo.png"
            className="h-full w-full object-cover opacity-70"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h1>
              Du terroir à <br />
              votre table
            </h1>
          </div>
        </div>

        <div className="flex max-w-2xl flex-col items-center gap-4 px-4 text-center lg:px-0 lg:text-left">
          <p className="text-accent mb-2 text-xs tracking-widest uppercase">
            ◆ La genèse
          </p>
          <h2>Une plateforme née de la rencontre entre des passionnés</h2>
          <p className="text-sm whitespace-pre-line lg:text-base">
            <span className="text-accent italic">Comptoir artisan </span>est né
            d'une conviction simple : les meilleurs produits méritent les
            meilleurs circuits de distribution. Trop souvent, des artisans
            d'exception restent dans l'ombre, faute d'accès aux enseignes et aux
            clients qui sauraient apprécier leur travail.
          </p>
          <p className="text-sm whitespace-pre-line lg:text-base">
            Notre fondateur a parcouru les routes de France, du Vercors au
            Pilat, des vergers du Sud aux rotondes de café. Partout, il a
            rencontré des femmes et des hommes passionnés, porteurs d'un
            savoir-faire transmis de génération en génération. Mais trop
            souvent, leur produit restait confidentiel.\n C'est de cette
            rencontre entre des passions que{" "}
            <span className="text-accent italic">Comptoir artisan</span> a vu le
            jour. Nous avons créé une plateforme qui relie directement ces
            artisans à des clients exigeants - professionnels de la distribution
            bio comme La Vie Claire et Biocoop, mais aussi particuliers en quête
            d'authenticité.
          </p>
          <p className="text-sm whitespace-pre-line lg:text-base">
            Aujourd'hui,{" "}
            <span className="text-accent italic">Comptoir artisan </span>
            poursuit cette mission avec une exigence intacte : sélectionner les
            meilleurs, les accompagner, et porter leurs créations jusqu'à vous.
            Chaque produit raconte une histoire, chaque producteur incarne un
            terroir.
          </p>
        </div>

        <OurValuesSection />
      </div>
      <StatsSection />

      <div className="bg-foreground flex flex-col items-center justify-center gap-4 p-10 text-center">
        <h2 className="text-white">Rejoignez PAP</h2>

        <p className="text-gray-300">
          {"Découvrez nos produits  et soutenez l'artisanat français."}
        </p>

        <Link href="/catalogue">
          <Button variant="accent" className="p-4">
            Découvrir le catalogue
          </Button>
        </Link>
      </div>
    </section>
  );
}
