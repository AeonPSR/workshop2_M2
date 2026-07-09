
export default function ProducerCard({ producer }) {

  return (
    <div className="flex flex-col gap-4 items-center lg:w-96 w-80">
      <div className="relative overflow-hidden rounded-lg aspect-4/5 w-full">
        <img
          src={producer.image}
          alt="Brasserie du Vercors"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6">

          <p className="text-xs uppercase tracking-wider text-gray-300 flex items-center gap-1">
            {producer.address}
          </p>

          <h3 className="text-2xl font-bold text-white my-1">{producer.name}</h3>
          <p className="text-xs uppercase font-semibold text-accent">Boissons</p>
        </div>

      </div>
      <p className="lg:text-sm text-xs">{producer.description}</p>

    </div>
  )
}