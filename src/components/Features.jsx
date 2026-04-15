"use client";
import { motion } from "framer-motion";
import {
  Smartphone,
  Glasses,
  Headset,
  Users,
  Globe,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "AI-Powered 360° Mode",
    description:
      "Use dual cameras with AI gap-fill to create a wide-angle ~360° immersive view—no special hardware needed.",
  },
  {
    icon: Glasses,
    title: "Smart Glasses Ready",
    description:
      "Works seamlessly with Meta, Xreal, and other AR glasses for a next-level immersive experience.",
  },
  {
    icon: Headset,
    title: "VR Compatible",
    description:
      "Step into full VR with walk-around capabilities and true spatial presence.",
  },
  {
    icon: Users,
    title: "Holographic Group Calls",
    description:
      "Connect with up to 20 people in ultra-real presence with advanced occlusion and movement.",
  },
  {
    icon: Globe,
    title: "Global Low Latency",
    description:
      "Optimized servers ensure smooth, real-time interaction worldwide.",
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description:
      "Secure, scalable, and customizable with API access and dedicated support.",
  },
];

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const Features = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-coral/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-creata text-3xl md:text-5xl font-bold text-gray-600 mb-4">
            Why <span className="text-[#E51A54]">HoloVox?</span>
          </h2>

          <p className="text-lg text-[#8783AB]">
            HoloVox turns any device into an immersive communication
            portal—combining AI-powered 360° video with real-time presence to
            make every call feel real.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white shadow-[0_10px_25px_rgba(233,22,75,0.3)] rounded-2xl p-6 md:p-8 group transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-xl bg-[#E51A54]/10 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-[#E51A54]" />
              </div>

              <h3 className="font-creata font-bold text-xl text-black mb-3">
                {feature.title}
              </h3>

              <p className="text-[#78779F] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
