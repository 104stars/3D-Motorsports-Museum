"use client";

import { ExhibitCard } from "@/components/ui/ExhibitCard";

const exhibits = [
  {
    id: 1,
    title: "Formula 1 Heritage",
    description:
      "Witness the evolution of speed with iconic F1 machines, from legendary championship-winning cars to cutting-edge hybrid technology that defines modern racing.",
    image: "/1.webp",
    tags: ["Interactive Display", "20+ Vehicles"],
  },
  {
    id: 2,
    title: "Le Mans Endurance",
    description:
      "Experience the ultimate test of stamina and engineering, featuring legendary endurance racers that conquered the 24-hour battle at Circuit de la Sarthe.",
    image: "/2.webp",
    tags: ["Historic Collection", "Prototype Racers"],
  },
  {
    id: 3,
    title: "Rally Legends",
    description:
      "Feel the raw power of off-road racing with championship-winning rally cars that dominated grueling stages across mountains, forests, and desert terrain.",
    image: "/3.webp",
    tags: ["All-Terrain Icons", "Group B Classics"],
  },
];

export default function FeaturedExhibits() {
  return (
    <section className="bg-neutral-950 py-20 px-6 md:px-12 lg:px-20">
      {/* Section Heading */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-5xl md:text-6xl font-light text-white mb-4 font-sans ">
          Featured Exhibits
        </h2>
        <p className="text-neutral-400 text-lg font-light max-w-2xl">
          Explore our carefully curated collection of motorsport history's most
          iconic moments and machines.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exhibits.map((exhibit) => (
          <ExhibitCard
            key={exhibit.id}
            title={exhibit.title}
            description={exhibit.description}
            image={exhibit.image}
            tags={exhibit.tags}
          />
        ))}
      </div>
    </section>
  );
}

