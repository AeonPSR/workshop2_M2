"use client"

import { useState, useEffect } from 'react';
import ProducerCard from "@/components/producers/ProducerCard";
import SectionHeading from "@/components/shared/SectionHeading";
import { getProducers } from "@/lib/api/producers";
import { Button } from '@/components/ui/button';

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
        <section className="flex flex-col lg:gap-16 gap-8 lg:p-9 lg:px-36 p-4">
            <div className="flex flex-col gap-6">
                <div>
                    <SectionHeading eyebrow={"Producteurs"}>
                        Nos artisans
                    </SectionHeading>
                    <p className="lg:w-2xl text-gray-600 ">
                        Chaque producteur est sélectionné pour son savoir-faire, son engagement bio et la qualité exceptionnelle de ses produits.
                    </p>
                </div>
                <hr className="border-accent" />
            </div>

            {loading && (
                <div className="flex justify-center items-center min-h-75">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                    <p className="ml-3 text-gray-600 font-medium">Chargement des producteurs...</p>
                </div>
            )}

            {error && !loading && (
                <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 font-medium">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:px-12  justify-items-center">
                    {producers.length === 0 ? (
                        <p className="text-gray-500 italic">Aucun artisan trouvé pour le moment.</p>
                    ) : (
                        producers.map((producer) => (
                            <ProducerCard key={producer.id} producer={producer} />
                        ))
                    )}
                </div>
            )}

            <div className='lg:space-y-16 space-y-8 '>
                <hr className="border-accent" />
                <div className='flex flex-col items-center lg:gap-2 gap-4 text-center'>
                    <h2>Envie de découvrir leurs produits ?
                    </h2>
                    <Button variant='default' size='lg' >Envie de découvrir leurs produits ?
                    </Button>
                </div>
            </div>
        </section>
    );
}