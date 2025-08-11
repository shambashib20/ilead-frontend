import { motion } from "framer-motion";
import { Link, useRouteContext } from "@tanstack/react-router";

export default function NotFound() {
  const { isAuthenticated } = useRouteContext({ from: "__root__" }) as {
    isAuthenticated: boolean;
  };

  const targetPath = isAuthenticated ? "/dashboard" : "/login";
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-6 relative overflow-hidden">
      {/* Animated 404 number */}
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="text-9xl font-extrabold text-gray-800 dark:text-gray-100"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-4 text-lg text-gray-500 dark:text-gray-400"
      >
        Oops! The page you’re looking for doesn’t exist.
      </motion.p>

      {/* Back to Home Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6"
      >
        <Link
          to={targetPath}
          className="inline-block px-6 py-3 text-white bg-blue-600 dark:bg-blue-500 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
        >
          Go Home
        </Link>
      </motion.div>

      {/* Decorative floating circle */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: [0, -10, 0], opacity: 0.2 }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-16 right-20 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full"
      />
    </div>
  );
}
