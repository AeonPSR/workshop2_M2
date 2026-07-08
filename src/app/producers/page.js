"use client";

import { useState, useEffect } from "react";
import ProducerCard from "@/components/producers/ProducerCard";
import SectionHeading from "@/components/shared/SectionHeading";
import { getProducers } from "@/lib/api/producers";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

export default function Producers() {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProducers();
        setProducers(data);
      } catch (err) {
        setError("Impossible de récupérer les producteurs pour le moment.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section className="flex flex-col gap-8 p-4 lg:gap-16 lg:p-9 lg:px-36">
      <div className="flex flex-col gap-6">
        <div>
          <SectionHeading as="h2" eyebrow={"Producteurs"}>
            Nos artisans
          </SectionHeading>
          <p className="text-gray-600 lg:w-2xl">
            Chaque producteur est sélectionné pour son savoir-faire, son
            engagement bio et la qualité exceptionnelle de ses produits.
          </p>
        </div>
        <hr className="border-accent/30" />
      </div>

      {loading && (
        <div className="flex min-h-75 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-green-600"></div>
          <p className="ml-3 font-medium text-gray-600">
            Chargement des producteurs...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
          {producers.length === 0 ? (
            <p className="text-gray-500 italic">
              Aucun artisan trouvé pour le moment.
            </p>
          ) : (
            producers.map((producer) => (
              <ProducerCard key={producer.id} producer={producer} />
            ))
          )}
        </div>
      )}

      <div className="space-y-8 lg:space-y-16">
        <hr className="border-accent/30" />
        <div className="flex flex-col items-center gap-4 text-center lg:gap-2">
          <h2>Envie de découvrir leurs produits ?</h2>
          <Button variant="default">
            Parcourir le catalogue <HugeiconsIcon icon={ArrowRight02Icon} />
          </Button>
        </div>
      </div>
    </section>
  );
}
