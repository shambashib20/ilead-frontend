import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Clock } from "lucide-react";
import logo from "../../assets/logo-dark-sm.png";
export const Route = createFileRoute("/_appLayout/")({
  component: ComingSoonEnhanced,
});

function ComingSoonEnhanced() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown timer (example: 30 days from now)
  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  // const itemVariants = {
  //   hidden: { y: 20, opacity: 0 },
  //   visible: {
  //     y: 0,
  //     opacity: 1,
  //     transition: {
  //       duration: 0.8,
  //       ease: ["easeOut"],
  //     },
  //   },
  // };

  // const floatingVariants = {
  //   animate: {
  //     y: [0, -15, 0],
  //     transition: {
  //       duration: 4,
  //       repeat: Infinity,
  //       ease: "easeInOut",
  //     },
  //   },
  // };

  // const countdownVariants = {
  //   hidden: { scale: 0 },
  //   visible: {
  //     scale: 1,
  //     transition: {
  //       type: "spring",
  //       stiffness: 100,
  //     },
  //   },
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden p-4">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-80 h-80 -top-40 -right-40 bg-blue-800/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-96 h-96 -bottom-48 -left-48 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="text-center text-white z-10 relative max-w-4xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo/Brand */}
        <motion.div className="mb-16">
          <img
            src={logo}
            className="w-20 h-20 block mx-auto mb-10 mt-10"
            alt=""
          />
        </motion.div>

        {/* Main title section */}
        <motion.div className="mb-16">
          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Coming Soon
          </motion.h1>

          <motion.p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Say goodbye to complex systems. Our upcoming CRM is designed to help
            you capture leads, automate follow-ups, and close deals—faster than
            ever!
          </motion.p>
        </motion.div>

        {/* Countdown timer */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-16">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <motion.div
              key={unit}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {value.toString().padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-300 uppercase tracking-wider">
                {unit}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Email subscription */}
        <motion.div className="max-w-md mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Notify Me
            </motion.button>
          </div>
        </motion.div>

        {/* Progress and status */}
        <motion.div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Launch progress</span>
            <span>60%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{
                duration: 2,
                delay: 1,
                ease: "easeOut",
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            Estimated launch: 30 days
          </p>
        </motion.div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-4 h-4 bg-cyan-400 rounded-full opacity-60"
        animate={{
          y: [0, -20, 0],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-16 w-3 h-3 bg-purple-400 rounded-full opacity-60"
        animate={{
          y: [0, -15, 0],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
}
