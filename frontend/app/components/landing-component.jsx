"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Rat } from "lucide-react";

export default function Globe3D() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#0a0613] pt-32 pb-10 font-light text-white antialiased md:pt-20 md:pb-16">
      <div
        className="absolute top-0 right-0 h-1/2 w-1/2"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(155, 135, 245, 0.15) 0%, rgba(13, 10, 25, 0) 60%)",
        }}
      />
      <div
        className="absolute top-0 left-0 h-1/2 w-1/2 -scale-x-100"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(155, 135, 245, 0.15) 0%, rgba(13, 10, 25, 0) 60%)",
        }}
      />

      <div className="relative z-10 container mx-auto max-w-2xl px-4 text-center md:max-w-4xl md:px-6 lg:max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>
          <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-light md:text-5xl lg:text-7xl">
            <Rat className="text-amber-400"/> Mongoose
          </h1>
          <h2 className="mx-auto mb-6 max-w-4xl text-4xl font-light md:text-5xl lg:text-7xl">
            Stay safe with{" "}
            <span className="text-[#9b87f5]">AI</span> Insights
          </h2>
          <p className="mx-auto mb-10 max-w-prose text-base text-white/70 sm:text-lg md:text-xl leading-relaxed">
            Deepfake detecter combines usage of artificail intelligence with 
            the use of deep learning and retrieval augementative generation
            with best practices to help you identify between what is real and 
            AI produced.
          </p>

          <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:mb-0 sm:flex-row">
            <Link
              href="#form"
              className="neumorphic-button hover:shadow-[0_0_20px_rgba(155, 135, 245, 0.5)] relative w-full overflow-hidden rounded-full border border-white/10 bg-linear-to-b from-white/10 to-white/5 px-8 py-4 text-white shadow-lg transition-all duration-300 hover:border-[#9b87f5]/30 sm:w-auto">
              Get Started
            </Link>
            <a
              href="#tech"
              className="flex w-full items-center justify-center gap-2 text-white/70 transition-colors hover:text-white sm:w-auto">
              <span>Learn how it works</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </a>
          </div>
        </motion.div>
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}>
          <div className="relative flex h-40 w-full overflow-hidden md:h-64">
            <img
              src="https://i.postimg.cc/5NwYwdTn/earth.webp"
              alt="Earth"
              className="absolute top-0 left-1/2 -z-10 mx-auto -translate-x-1/2 px-4 opacity-80"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}