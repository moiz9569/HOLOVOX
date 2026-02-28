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
    title: "Phone 360 Mode",
    description:
      "Turn your smartphone into an immersive 360° camera. No special hardware needed—just your phone.",
  },
  {
    icon: Glasses,
    title: "Smart Glasses Ready",
    description:
      "Seamlessly works with Meta, Xreal, and all major AR glasses for the ultimate immersive experience.",
  },
  {
    icon: Headset,
    title: "VR Compatible",
    description:
      "Full VR headset support for the most immersive 360° streaming with walk-around capabilities.",
  },
  {
    icon: Users,
    title: "Group Holographic Calls",
    description:
      "Connect with up to 20 people in seamless 8K quality with advanced presence detection.",
  },
  {
    icon: Globe,
    title: "Global Low Latency",
    description:
      "Priority servers ensure crystal-clear streaming with under 200ms latency worldwide.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC-2 compliant with white-label options, API access, and dedicated support.",
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
    <section className="py-12 md:py-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-coral/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-4 mx-auto pt-28 md:pt-36">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <h2 className="font-creata text-3xl md:text-5xl font-medium mb-4"></h2>
          <p className="text-lg text-muted-foreground">
            HoloVox transforms any device into a portal to someone else's world.
            See their silhouette in your reality, walk around their space, and
            feel truly connected.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            margin: "-100px",
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card rounded-2xl p-8 group hover:border-coral/30 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-xl bg-coral/10 flex items-center justify-center mb-6 group-hover:bg-coral/20 transition-colors">
                <feature.icon className="w-7 h-7 text-coral" />
              </div>
              <h3 className="font-creata text-xl font-medium text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
