"use client"

import { getProductById } from "@/lib/api/products";
import { useProStatus } from "@/context/pro-context";
import { useEffect, useState, use } from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { ArrowLeft02Icon, Location04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function page({ params }) {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;
    const router = useRouter();
    const { pricelistId } = useProStatus();
    const { isPro, getPrice, addToCart } = useApp();
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        async function loadProduct() {
            const product = await getProductById(id, pricelistId)
            console.log(product)
            setProduct(product)
        }

        loadProduct()
    }, [])


    if (!product) {
        return (<div className="flex flex-col items-center justify-center h-screen"
        >
            <p>Chargement ....</p>
        </div>)
    }

    const price = getPrice(product);
    const outOfStock = product.stock !== undefined && product.stock <= 0;
    const lowStock = isPro && product.stock > 0 && product.stock <= 10;


    return (

        <section className="px-4 md:px-72 flex flex-col gap-4 py-8">
            {/* Bouton Retour */}
            <Link href="/catalogue" className="text-sm text-gray-500 flex gap-1 items-center hover:text-black transition-colors">
                <HugeiconsIcon icon={ArrowLeft02Icon} size={18} /> Retour au catalogue
            </Link>

            <div className="flex flex-col md:flex-row items-stretch min-h-170  rounded-sm ">

                <div className="w-full md:w-2/5 shrink-0 relative bg-gray-100">
                    <div
                        className={cn(
                            "image-zoom bg-secondary relative overflow-hidden rounded-sm h-full",
                            outOfStock && "grayscale",
                        )}
                    >
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                sizes="(min-width: 768px) 25vw, 50vw"
                                className={cn(
                                    "object-cover w-full h-full",
                                    outOfStock && "opacity-20",
                                )}
                            />
                        ) : (
                            <div
                                className={cn(
                                    "bg-muted h-full w-full",
                                    outOfStock && "opacity-20",
                                )}
                            />
                        )}
                        {outOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-accent font-heading text-2xs tracking-wide-luxe border-accent bg-background/50 rotate-[-8deg] border px-3 py-1.5 backdrop-blur-sm md:text-xs">
                                    RÉSERVE ÉPUISÉE
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col gap-6">


                    <div className="space-y-2">
                        <p className="text-accent text-xs tracking-widest uppercase font-medium mb-1">
                            {"◆ "}{product.category}
                        </p>
                        <h2 className="text-3xl font-semibold text-gray-900">
                            {product.name}
                        </h2>
                        <p className="text-xs text-gray-500">Réf. BPL-BIE-002</p>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="font-heading text-foreground text-3xl font-bold">
                            {price.toFixed(2)}€
                        </span>
                        <span className="text-sm text-muted-foreground">/ unité</span>
                    </div>

                    <div className=" flex lg:flex-row flex-col gap-2 lg:w-120">
                        <div className="flex items-center border border-[#E5E5E5] bg-[#F9F9F9] h-12 w-32">
                            <button
                                type="button"
                                onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
                                className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black text-lg font-light transition-colors select-none"
                            >
                                &minus;
                            </button>

                            <span className="flex-1 text-center font-medium text-sm text-gray-900 select-none">
                                {quantity}
                            </span>

                            <button
                                type="button"
                                onClick={() => setQuantity(prev => prev + 1)}
                                className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black text-lg font-light transition-colors select-none"
                            >
                                &#43;
                            </button>
                        </div>

                        <Button className="uppercase flex-1" variant="outline" disabled={outOfStock} onClick={() => {
                            addToCart(product.id, quantity);
                            router.push("/cart");
                        }}
                        >        {outOfStock ? "Indisponible" : "Ajouter au panier"}</Button>

                    </div>

                    <div className="flex flex-col gap-2 text-xs lg:pr-28">

                        <p className="text-gray-500"> Description</p>
                        <p>{product.description ? product.description : "Aucune description n’est disponible pour le moment."}</p>
                    </div>

                    <div className="flex flex-col gap-2 text-xs lg:pr-28">

                        <p className="text-gray-500"> Conservation & Entreposage</p>
                        <p>{product.description ? product.description : "Aucune Conservation n’est disponible pour le moment."}</p>
                    </div>


                    <div className="flex flex-col gap-4">
                        <hr className="border-accent" />

                        <div className="flex flex-col gap-3">
                            <span className="text-[11px] font-semibold tracking-[0.15em] text-[#B5A186] uppercase">
                                Producteur
                            </span>

                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 shrink-0 overflow-hidden rounded-sm bg-gray-100">
                                    <img
                                        src={"/images/producter_image.jpeg"}
                                        alt={"Le Tonneau Doré"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex flex-col gap-0.5">
                                    <h4 className="text-lg font-medium text-gray-900 tracking-tight">
                                        {"Le Tonneau Doré"}
                                    </h4>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <HugeiconsIcon icon={Location04Icon} size={18} />
                                        {"Lyon, Rhône (69)"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>







                </div>

            </div>
        </section>

    )

}


