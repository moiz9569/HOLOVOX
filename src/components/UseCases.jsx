"use client";
import { motion } from "framer-motion";
import { Heart, Star, Building2, Stethoscope } from "lucide-react";

const useCases = [
  {
    icon: Heart,
    title: "Connect with Family",
    description:
      "Be there for bedtime stories, holiday dinners, or just a quiet evening—even from across the world.",
    gradient: "from-rose-500/20 to-pink-600/20",
  },
  {
    icon: Star,
    title: "Creators & Influencers",
    //  description: "Offer premium holographic sessions to fans. Monetize with our 80/20 split—you keep 80%.",
    description:
      "Host paid holographic sessions and monetize your audience with our 80/20 split—you keep 80%.",
    gradient: "from-amber-500/20 to-orange-600/20",
  },
  {
    icon: Building2,
    title: "Enterprise Meetings",
    description:
      "Transform remote work with presence. White-label solutions for dealerships, training, and events.",
    gradient: "from-blue-500/20 to-indigo-600/20",
  },
  {
    icon: Stethoscope,
    title: "Healthcare & Support",
    description:
      "Celebrities visiting hospital patients, therapists connecting deeper—healthcare reimagined.",
    gradient: "from-emerald-500/20 to-teal-600/20",
  },
];

export const UseCases = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-coral/5 to-transparent pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-creata text-3xl md:text-5xl font-bold text-gray-600 mb-4">
            Built for <span className="text-[#E51A54]">Every Connection</span>
          </h2>

          <p className="text-lg text-[#8783AB]">
            From intimate family moments to enterprise-scale deployments,
            HoloVox adapts to how you want to connect.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl w-full">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${useCase.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative bg-white shadow-[0_10px_25px_rgba(233,22,75,0.3)] rounded-2xl p-6 md:p-8 h-full transition-all duration-500">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#E51A54]/10 flex items-center justify-center shrink-0">
                    <useCase.icon className="w-6 h-6 text-[#E51A54]" />
                  </div>

                  <div>
                    <h3 className="font-creata text-xl font-bold text-black mb-2">
                      {useCase.title}
                    </h3>

                    <p className="text-[#7B7BA2] leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.blockquote
          className="max-w-3xl mt-10 md:mt-14 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p className="font-creata text-xl md:text-2xl lg:text-3xl font-extralight text-gray-600/80 italic leading-relaxed">
            "In 360° VR, the world has no frames. It breathes around you,
            responds to your presence, and turns looking into feeling."
          </p>
        </motion.blockquote>
      </div>
    </div>
  );
};
