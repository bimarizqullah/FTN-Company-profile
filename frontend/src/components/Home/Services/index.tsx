import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";

const Services = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background vector */}
      <div className="absolute left-0 top-0">
        <Image
          src="/images/categories/light-vector.svg"
          alt="vector"
          width={800}
          height={1050}
          className="dark:hidden"
          unoptimized
        />
        <Image
          src="/images/categories/dark1-vector.svg"
          alt="vector"
          width={800}
          height={1050}
          className="hidden dark:block"
          unoptimized
        />
      </div>

      <div className="container max-w-8xl mx-auto px-5 2xl:px-0 relative z-10">
        <div className="grid grid-cols-12 items-center gap-10">
          {/* Left Content */}
          <div className="lg:col-span-6 col-span-12">
            <p className="text-dark/75 dark:text-white/75 text-base font-semibold flex gap-2.5">
              <Icon icon="mdi:fiber-optic" className="text-2xl text-blue-500" />
              Services & Solutions
            </p>
            <h2 className="lg:text-52 text-40 mt-4 mb-2 lg:max-w-full font-medium leading-[1.2] text-dark dark:text-white">
              Fiber Optic Infrastructure Provider Services
            </h2>
            <p className="text-dark/50 dark:text-white/50 text-lg lg:max-w-full leading-[1.3] md:max-w-3/4">
              We provide standardized passive infrastructure that supports
              aesthetics, cost efficiency, and sustainable digital growth for
              Indonesia’s smart cities.
            </p>
            <Link
              href="/projects"
              className="py-4 px-8 bg-blue-500 text-base leading-4 block w-fit text-white rounded-full font-semibold mt-8 hover:bg-dark duration-300"
            >
              View Projects
            </Link>
          </div>

          {/* Right Cards */}
          <div className="lg:col-span-6 col-span-12 grid grid-cols-2 gap-6">
            {/* Passive Infrastructure */}
            <div className="relative rounded-2xl overflow-hidden group bg-white dark:bg-dark shadow-lg p-6">
              <Icon icon="mdi:cable-data" className="text-4xl text-blue-500" />
              <h3 className="text-lg font-semibold mt-4 text-dark dark:text-white">
                Passive Infrastructure
              </h3>
              <p className="text-sm text-dark/60 dark:text-white/60 mt-2">
                High quality ducting, manhole, and ODC to ensure reliable fiber
                optic deployment.
              </p>
            </div>

            {/* Standardized Installation */}
            <div className="relative rounded-2xl overflow-hidden group bg-white dark:bg-dark shadow-lg p-6">
              <Icon icon="mdi:server-network" className="text-4xl text-blue-500" />
              <h3 className="text-lg font-semibold mt-4 text-dark dark:text-white">
                Standardized Installation
              </h3>
              <p className="text-sm text-dark/60 dark:text-white/60 mt-2">
                Installation meets technical standards for safety, durability,
                and scalability.
              </p>
            </div>

            {/* Efficient Construction */}
            <div className="relative rounded-2xl overflow-hidden group bg-white dark:bg-dark shadow-lg p-6">
              <Icon icon="mdi:tools" className="text-4xl text-blue-500" />
              <h3 className="text-lg font-semibold mt-4 text-dark dark:text-white">
                Efficient Construction
              </h3>
              <p className="text-sm text-dark/60 dark:text-white/60 mt-2">
                Cost-effective and environmentally friendly construction
                approach.
              </p>
            </div>

            {/* Smart City Integration */}
            <div className="relative rounded-2xl overflow-hidden group bg-white dark:bg-dark shadow-lg p-6">
              <Icon
                icon="mdi:city-variant-outline"
                className="text-4xl text-blue-500"
              />
              <h3 className="text-lg font-semibold mt-4 text-dark dark:text-white">
                Smart City Integration
              </h3>
              <p className="text-sm text-dark/60 dark:text-white/60 mt-2">
                Supporting IoT, surveillance, and smart governance through robust
                infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
