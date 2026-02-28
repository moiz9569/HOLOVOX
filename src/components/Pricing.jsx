 "use client";
 import { motion } from "framer-motion";
  import { Button } from "./ui/button";
 import { Check, Sparkles } from "lucide-react";
 
 const tiers = [
   {
     name: "Free",
     price: "$0",
     period: "forever",
     description: "2D video calls to compete with Zoom",
     features: [
       "HD 1080p video calls",
       "Up to 40 min (personal) / Unlimited (B2B)",
       "Screen sharing & chat",
       "Phone & computer support",
       "Light non-intrusive ads",
     ],
     cta: "Get Started Free",
     featured: false,
   },
   {
     name: "Basic",
     price: "$12",
     period: "/month",
     description: "Unlock holographic magic",
     features: [
       "Unlimited 1-on-1 holo calls (40 min)",
       "1080p silhouette + walk-around",
       "Phone AR & VR headset support",
       "No ads or watermarks",
       "Session history dashboard",
     ],
     cta: "Start Basic",
     featured: false,
   },
   {
     name: "Pro",
     price: "20%",
     period: "platform fee",
     description: "For creators who monetize",
     features: [
       "Unlimited duration + group calls (20 people)",
       "Full 8K feed + advanced occlusion",
       "All AR glasses supported",
       "Analytics, scheduling & payments",
       "Priority low-latency servers",
       "You keep 80% of session revenue",
     ],
     cta: "Apply for Pro",
     featured: true,
   },
   {
     name: "Enterprise",
     price: "Custom",
     period: "pricing",
     description: "White-label for organizations",
     features: [
       "White-label branding",
       "Unlimited rooms & users",
       "SOC-2 compliance",
       "API access & on-prem options",
       "Dedicated support & training",
     ],
     cta: "Contact Sales",
     featured: false,
   },
 ];
 
 export const Pricing = () => {
   return (
     <section className="py-12 md:py-16 relative" id="pricing">
       {/* Background */}
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-light/30 to-transparent pointer-events-none" />
       
       <div className="container px-4 relative">
         <motion.div
           className="text-center max-w-3xl mx-auto mb-16"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
         >
           <h2 className="font-creata text-3xl md:text-5xl font-medium text-foreground mb-6">
             Simple, <span className="text-gradient">Transparent</span> Pricing
           </h2>
           <p className="text-lg text-muted-foreground">
             Start free with 2D calls. Upgrade when you're ready for holograms.
           </p>
         </motion.div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {tiers.map((tier, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: index * 0.1 }}
               className={`relative ${tier.featured ? 'lg:-mt-4 lg:mb-4' : ''}`}
             >
               {tier.featured && (
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-coral rounded-full text-sm font-medium text-primary-foreground flex items-center gap-1">
                   <Sparkles className="w-3 h-3" />
                   Most Popular
                 </div>
               )}
               <div className={`glass-card rounded-2xl p-8 h-full flex flex-col ${
                 tier.featured ? 'border-coral/50 bg-coral/5' : ''
               }`}>
                 <h3 className="font-creata text-xl font-medium text-foreground mb-2">
                   {tier.name}
                 </h3>
                 <div className="flex items-baseline gap-1 mb-2">
                   <span className="font-creata text-4xl font-medium text-foreground">
                     {tier.price}
                   </span>
                   <span className="text-muted-foreground text-sm">{tier.period}</span>
                 </div>
                 <p className="text-muted-foreground text-sm mb-6">
                   {tier.description}
                 </p>
                 
                 <ul className="space-y-3 mb-8 flex-1">
                   {tier.features.map((feature, fIndex) => (
                     <li key={fIndex} className="flex items-start gap-3 text-sm">
                       <Check className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
                       <span className="text-foreground/80">{feature}</span>
                     </li>
                   ))}
                 </ul>
                 
                 <Button 
                   className={`w-full ${
                     tier.featured 
                       ? 'bg-coral hover:bg-coral-glow text-primary-foreground glow-coral' 
                       : 'bg-card hover:bg-muted border border-border'
                   }`}
                 >
                   {tier.cta}
                 </Button>
               </div>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   );
 };