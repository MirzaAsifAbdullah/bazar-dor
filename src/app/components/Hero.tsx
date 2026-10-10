import Image from "next/image";
import CurrentDate from "./CurrentDate";

const Hero = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-5">
      <div className="flex min-h-[215px] items-center justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-6 sm:px-8">
        {/* hero */}
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <CurrentDate />
          </span>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            আজকের বাজারের দাম এক নজরে
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            প্রয়োজনীয় পণ্যের আজকের বাজারদর, দামের পরিবর্তন এবং বাজারভিত্তিক
            তথ্য এক জায়গায়।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-5 inline-flex rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            সব দাম দেখুন
          </a>
        </div>

        <div className="hidden shrink-0 md:flex md:h-44 md:w-52 md:items-center md:justify-center">
          <div className="mr-4">
            <Image
              src="/bazar-hero.png"
              alt="Hero Illustration"
              width={208}
              height={176}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
