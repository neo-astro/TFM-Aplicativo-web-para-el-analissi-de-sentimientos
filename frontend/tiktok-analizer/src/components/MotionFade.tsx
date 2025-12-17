// /src/components/MotionFade.tsx
import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

type Props = {
  children: React.ReactNode;
  index?: number;
  className?: string;
};

/**
 * MotionFade
 * - Animación de entrada con delay escalonado usando `custom`.
 * - `ease` definido como array numérico (cubic-bezier) para cumplir con los tipos.
 */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.04 * i,
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const MotionFade: React.FC<Props> = ({ children, index = 0, className }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={index}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

export default MotionFade;
