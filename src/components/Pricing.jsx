"use client";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Check, Sparkles } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Unlimited immersive calls with AI-enhanced 360° feel",
    features: [
      "Unlimited 2D video calls (no time limit)",
      "Dual-camera AI-enhanced ~360° view",
      "Screen sharing, chat & polls",
      "Phone & desktop support",
      "Light non-intrusive ads (skippable)",
    ],
    cta: "Get Started Free",
    featured: false,
  },
  {
    name: "Basic",
    price: "$14.95",
    period: "/month",
    description: "Step into real holographic presence",
    features: [
      "No ads experience",
      "Unlimited 1:1 holographic calls",
      "Up to 40 min per session",
      "Full movement & occlusion",
      "Phone AR & VR headset support",
    ],
    cta: "Start Basic",
    featured: false,
  },
  {
    name: "Pro",
    price: "20%",
    period: "take-rate",
    description: "Built for creators who monetize sessions",
    features: [
      "Unlimited duration sessions",
      "Group calls up to 20 people",
      "Full 8K + advanced features",
      "Creator dashboard + earnings tracking",
      "Priority low-latency servers",
      "Keep 80% of your revenue",
    ],
    cta: "Apply for Pro",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "Scalable solution for organizations & events",
    features: [
      "White-label branding",
      "Unlimited users & rooms",
      "API access & integrations",
      "Compliance & security (SOC-2 ready)",
      "Dedicated support & onboarding",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

export const Pricing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-navy-light/30 to-transparent pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-creata text-3xl md:text-5xl font-bold text-gray-600 mb-4">
            Pricing built for <span className="text-[#E51A54]">everyone</span>
          </h2>

          <p className="text-lg text-[#8783AB]">
            Start free with immersive AI-powered calls. Upgrade to unlock full
            holographic experiences.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Badge */}
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#E51A54] rounded-full text-sm font-medium text-white flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              {/* Card */}
              <div
                className={`bg-white shadow-[0_10px_25px_rgba(233,22,75,0.3)] rounded-2xl p-6 md:p-8 h-full flex flex-col transition-all duration-500 ${
                  tier.featured ? "border-2 border-[#E51A54] scale-105" : ""
                }`}
              >
                <h3 className="font-creata text-xl font-bold text-gray-600 mb-2">
                  {tier.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-creata text-3xl md:text-4xl font-bold text-gray-600">
                    {tier.price}
                  </span>
                  <span className="text-[#716F96] text-sm">{tier.period}</span>
                </div>

                <p className="text-[#716F96] text-sm mb-6">
                  {tier.description}
                </p>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-[#E51A54] shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-[#E51A54] hover:bg-[#E51A54]/90 text-white">
                  {tier.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
