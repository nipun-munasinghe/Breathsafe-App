import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
      {/* Heading */}
      <h1 className="text-6xl sm:text-8xl font-bold text-[#0F172A] font-['Albert Sans',sans-serif]">
        404
      </h1>

      {/* Sub text */}
      <p className="mt-2 text-lg text-[#71717A] font-['Albert Sans',sans-serif]">
        This page could not be found.
      </p>

      {/* Button */}
      <Link
        href="/"
        className="mt-6 px-6 py-2 text-base font-medium rounded-lg 
                   text-white bg-[#65A30D] hover:bg-[#064E3B] 
                   transition shadow-xl font-['Albert Sans',sans-serif]"
      >
        Go back home
      </Link>
    </div>
  );
}
