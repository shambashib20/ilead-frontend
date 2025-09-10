// src/components/Loader.tsx
import { motion } from "framer-motion";

export default function Loader({ text = "Loading..." }: { text?: string }) {
  const base = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  } as const;

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 text-foreground">
      {/* Animated Dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-3 w-3 rounded-full bg-current
                       shadow-[0_0_0_1px_rgba(0,0,0,0.06)]
                       dark:shadow-[0_0_0_1px_rgba(255,255,255,0.15)]"
            animate={{ y: [-6, 0, -6], opacity: [0.6, 1, 0.6] }}
            transition={{ ...base, delay: i * 0.12 }}
          />
        ))}
      </div>

      {/* Loading Text */}
      <motion.p
        className="text-sm text-muted-foreground tracking-wide"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, repeat: Infinity, repeatType: "reverse" }}
      >
        {text}
      </motion.p>
    </div>
  );
}
