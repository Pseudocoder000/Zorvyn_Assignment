import { motion } from "framer-motion"
import gullak from "../../stickers/gullak.png"

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#05060f]/90 flex items-center justify-center">

      {/* 🐷 Gullak */}
      <div className="relative flex flex-col items-center">

        <motion.img
          src={gullak}
          className="w-16 md:w-20"
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* 💰 Coin */}
        <motion.div
          className="w-4 h-4 bg-yellow-400 rounded-full absolute top-[-20px]"
          animate={{
            y: [0, 30, 10],
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeIn"
          }}
        />

        <p className="text-white/60 text-sm mt-3">Loading...</p>
      </div>
    </div>
  )
}