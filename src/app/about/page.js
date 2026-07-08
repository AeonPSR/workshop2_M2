"use client"

import OurValuesSection from "@/components/about/OurValuesSection"
import StatsSection from "@/components/about/StatsSection"
import { Button } from "@/components/ui/button"

export default function About() {

    return (
        <section >
            <div className="flex flex-col items-center gap-16">
            <div className="relative w-full bg-black lg:h-140 h-80">
                <img src="/images/about/cover-photo.png" className="w-full h-full object-cover opacity-70" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h1>{"Du terroir à"}</h1>
                    <h1>{"votre table"}</h1>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 max-w-2xl lg:text-left text-center lg:px-0 px-4">
                <p className="text-xs tracking-widest text-accent uppercase mb-2">
                    {"◆ La genèse"}
                </p>
                <h2>
                    {"Une plateforme née de la rencontre entre des passionnés"}
                </h2>
                <p className="whitespace-pre-line lg:text-lg text-sm">
                    {`PAP - Plateforme des Artisans Producteurs - est née d'une conviction simple : les meilleurs produits méritent les meilleurs circuits de distribution. Trop souvent, des artisans d'exception restent dans l'ombre, faute d'accès aux enseignes et aux clients qui sauraient apprécier leur travail.\n
                    Notre fondateur a parcouru les routes de France, du Vercors au Pilat, des vergers du Sud aux rotondes de café. Partout, il a rencontré des femmes et des hommes passionnés, porteurs d'un savoir-faire transmis de génération en génération. Mais trop souvent, leur produit restait confidentiel.\n
                    C'est de cette rencontre entre des passions que PAP a vu le jour. Nous avons créé une plateforme qui relie directement ces artisans à des clients exigeants - professionnels de la distribution bio comme La Vie Claire et Biocoop, mais aussi particuliers en quête d'authenticité.\n
                    Aujourd'hui, PAP poursuit cette mission avec une exigence intacte : sélectionner les meilleurs, les accompagner, et porter leurs créations jusqu'à vous. Chaque produit raconte une histoire, chaque producteur incarne un terroir.`}
                </p>

            </div>

            <OurValuesSection/>
           </div>
           <StatsSection/>

           <div className="bg-foreground flex flex-col gap-4 p-10 items-center justify-center text-center">
            
            <h2 className="text-white">Rejoignez PAP</h2>

            <p className="text-gray-300">{"Découvrez nos produits  et soutenez l'artisanat français."}</p>

            <Button variant="accent" className="p-4">Découvrir le catalogue</Button>

           </div>
        </section>
    )
} 