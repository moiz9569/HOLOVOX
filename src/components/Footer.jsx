"use client";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  ArrowRight,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Hardware", "Enterprise"],
  Company: ["About", "Careers", "Press", "Contact"],
  Resources: ["Documentation", "Help Center", "Community", "Blog"],
  Legal: ["Privacy", "Terms", "Security", "Cookies"],
};

const socialLinks = [
  { icon: Twitter, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Youtube, href: "#" },
  { icon: Linkedin, href: "#" },
];

export const Footer = () => {
  return (
    <div className="min-h-screen flex flex-col mt-10 justify-between bg-[#0E0E77] border-t border-border/50 px-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col flex-1 justify-center">
        {/* CTA */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-creata text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to <span className="text-[#E51A54]">Holo</span>?
          </h2>

          <p className="text-[#8783AB] text-lg mb-6 max-w-xl mx-auto">
            Join thousands already on the waitlist. Be the first to experience
            the future of immersive communication.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 bg-white text-black"
            />
            <Button className="h-12 px-8 bg-[#E51A54] hover:bg-[#E51A54]/90 text-white">
              Join Waitlist
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </motion.div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10 md:mb-14">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/holo-new-logo.png"
                alt="HoloVox"
                className="h-8 md:h-14"
              />
              <span className="font-creata -ml-2 text-2xl font-semibold text-white hidden sm:block">
                HOLOVOX
              </span>
            </a>

            <p className="text-sm text-[#8783AB] mb-4">
              See me. Feel me. Holo me.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-black hover:text-[#E51A54]"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-white mb-3">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#8783AB] hover:text-[#E51A54]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-t border-border/50 text-[#8783AB]">
        <p className="text-sm">© 2026 HoloVox. All rights reserved.</p>
        <p className="text-sm">Made with ❤️ for a more connected world</p>
      </div>
    </div>
  );
};
