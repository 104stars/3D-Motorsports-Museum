"use client";

import Image from "next/image";

export function ExhibitCard({ title, description, image, tags }) {
  // Get compressed image path by replacing extension with "com" suffix
  const compressedImage = image.replace(/(\.\w+)$/, 'com$1');
  
  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-3xl group outline-1 outline-white/10">
      {/* Compressed background image for entire card */}
      <Image
        src={compressedImage}
        alt=""
        aria-hidden
        fill
        className="object-cover scale-110 opacity-80 blur-2xl brightness-[0.7]"
      />

      {/* Main high-quality image with gradient mask (visible top, transparent bottom) */}
      <div className="absolute inset-x-0 top-0 h-[65%] md:h-[62%] overflow-hidden">
        <div className="relative w-full h-full [mask-image:linear-gradient(to_bottom,black_0%,black_85%,transparent_100%)]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700"
          />
        </div>
      </div>

      {/* Bottom Content Panel */}
      <div className="absolute inset-x-0 bottom-0 h-[45%] md:h-[48%] overflow-hidden -mt-8">

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center p-8">
          {/* Title */}
          <h3 className="text-4xl font-bold text-white mb-4 font-sans">
            {title}
          </h3>

          {/* Description */}
          <p className="text-neutral-200 text-base font-light leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

