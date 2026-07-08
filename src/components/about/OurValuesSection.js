import { FavouriteIcon, Plant04Icon, DiplomaIcon, UserMultipleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
const valuesElements = [
  {
    title: "Bio & Authentique",
    description: "Tous nos produits sont certifiés bio, cultivés et transformés dans le respect du vivant.",
    icon: FavouriteIcon
  },
  {
    title: "Relation Humaine",
    description: "Nous connaissons chacun de nos producteurs. Le lien direct, sans intermédiaire superflu.",
    icon: Plant04Icon
  },
  {
    title: "Exigence Qualité",
    description: "Une sélection rigoureuse, des cahiers des charges stricts, des produits d’exception.",
    icon: DiplomaIcon
  },
  {
    title: "Proximité",
    description: "Des producteurs français, des circuits courts, un impact environnemental maîtrisé.",
    icon: UserMultipleIcon
  }
];
export default function OurValuesSection() {

    return (
        <div className="w-full lg:h-125 flex flex-col items-center justify-center border-y border-accent p-10 bg-secondary gap-8">
            <div className="text-center">
                <p className="text-xs tracking-widest text-accent uppercase mb-2">
                    {"Nos valeurs"}
                </p>
                <h2>
                    {"Ce qui nous guide"}
                </h2>
            </div>
            <div className="flex gap-4 lg:flex-row flex-col">
                {valuesElements.map((item, index) =>  {
                    
                    
                    return(
                    <div className="p-6 border bg-white flex flex-col gap-3 w-72" key={index}> 
                    <div className="rounded-full w-10 h-10 bg-muted flex items-center justify-center">
                        <HugeiconsIcon icon={item.icon} size={18} color="#a88443"/>
                    </div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm">{item.description}</p>

                    </div>
                )})}

            </div>
        </div>
    )
}