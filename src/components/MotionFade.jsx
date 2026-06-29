"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/animations/variants";

export default function MotionFade({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
