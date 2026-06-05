import Image from "next/image";

export function ExhibitCard({ title, description, image, tags }) {
  const compressedImage = image.replace(/(\.\w+)$/, 'com$1');
  
  return (
    <article className="relative h-[600px] w-full overflow-hidden rounded-3xl group outline-1 outline-white/10 shadow-[0_0_60px_rgba(255,255,255,0.06)] transition-shadow duration-300">
      <Image
        src={compressedImage}
        alt=""
        aria-hidden
        fill
        
        className="object-cover pointer-events-none scale-110 opacity-80 blur-2xl brightness-[0.7]"
      />

      <div className="absolute inset-x-0 top-0 h-[65%] md:h-[62%] overflow-hidden">
        <div className="relative w-full h-full [mask-image:linear-gradient(to_bottom,black_0%,black_85%,transparent_100%)]">
          <Image
            src={image}
            alt=""
            aria-hidden
            fill
            
            className="object-cover pointer-events-none transition-transform duration-700"
          />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[45%] md:h-[48%] overflow-hidden -mt-8">

        <div className="relative z-10 h-full flex flex-col justify-center p-8">
          <h3 className="text-3xl font-regular text-white mb-4 font-sans">
            {title}
          </h3>
          <p className="text-neutral-200 text-base font-light leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

