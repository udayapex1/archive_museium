'use client';
import { motion, useReducedMotion } from 'framer-motion';

export const motionTokens = { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const, fast: 0.18 };

export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reduced ? 0 : 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={reduced ? { duration: 0 } : { duration: motionTokens.duration, delay, ease: motionTokens.ease }}>{children}</motion.div>;
}

export function MotionItem({ children, className = '', index = 0 }: { children: React.ReactNode; className?: string; index?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, y: reduced ? 0 : 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={reduced ? { duration: 0 } : { duration: motionTokens.duration, delay: Math.min(index * 0.055, 0.3), ease: motionTokens.ease }}>{children}</motion.div>;
}
