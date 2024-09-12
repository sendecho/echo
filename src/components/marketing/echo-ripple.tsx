"use client"

import React from 'react';
import { motion } from 'framer-motion';

const EchoRipple = ({ duration = 8, amplitude = 10 }) => {
  const numRipples = 7;
  const baseSpacing = 20;
  const initialColor = '#6887DC'; // Matches the first color of the gradient


  return (
    <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" className='absolute top-0 right-0 h-[720px] w-full opacity-50'>
      <defs>
        <linearGradient id="rippleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <motion.stop
            offset="0%"
            animate={{
              stopColor: ['#6887DC', '#91F2A3', '#6887DC'],
            }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.stop
            offset="100%"
            animate={{
              stopColor: ['#91F2A3', '#6887DC', '#91F2A3'],
            }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
          />
        </linearGradient>
      </defs>
      {[...Array(numRipples)].map((_, index) => {
        const centerX = 100 + (index - (numRipples - 1) / 2) * baseSpacing;
        return (
          <motion.ellipse
            key={index}
            cx={centerX}
            cy="150"
            rx="40"
            ry="140"
            fill="none"
            stroke={initialColor}
            strokeWidth="0.5"
            animate={{
              cx: [
                centerX,
                centerX + amplitude * Math.sin((index / numRipples) * Math.PI),
                centerX
              ],
            }}
            transition={{
              duration: duration / 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: (index * duration) / (2 * numRipples),
            }}
          />
        );
      })}
    </svg>
  );
};

export default EchoRipple;