const statsElements = [
    {
        value: "5+",
        label: "Producteurs partenaires",
    },
    {
        value: "100%",
        label: "Produits certifiés bio",
    },
    {
        value: "2",
        label: "Enseignes partenaires",
    },
    {
        value: "1000+",
        label: "Clients satisfaits",
    }
];


export default function StatsSection() {

    return (
        <div className="flex lg:flex-row flex-col w-full justify-center lg:gap-16 gap-4 lg:p-28  p-8">

            {statsElements.map((item, index) => (
                <div key={index} className="text-center flex flex-col items-center gap-2">
                    <h3 className="text-accent lg:text-5xl text-4xl font-bold">{item.value}</h3>
                    <p className="text-sm uppercase text-gray-500">{item.label}</p>
                </div>
            ))}

        </div>
    )

}