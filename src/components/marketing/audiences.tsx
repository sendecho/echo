'use client'

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { Card } from "@/components/ui/card";
import { cn } from '@/lib/utils'
import { headingFont } from '@/app/fonts'

const audiences = [
  { title: 'Creators', description: 'Amplify your voice and nurture your audience with personalised, effortless outreach.' },
  { title: 'Developers', description: 'Integrate powerful networking tools seamlessly into your apps and workflows.' },
  { title: 'Business', description: 'Streamline relationship management and boost your professional network\'s value.' },
  { title: 'Sales', description: 'Help customers find accurate answers when and where they need them.' },
];

const Audiences = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [currentAudience, setCurrentAudience] = useState(0);
  const componentRef = useRef(null);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  useEffect(() => {
    const handleScroll = () => {
      if (componentRef.current && inView) {
        const scrollPosition = window.scrollY - componentRef.current.offsetTop;
        const newAudience = Math.floor(scrollPosition / 200) % audiences.length;
        setCurrentAudience(newAudience);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [inView]);

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#08090a] to-[#464748] flex-col justify-start items-center gap-[85px] py-48 inline-flex">

      <div className='container max-w-4xl mx-auto'>
        <h2 className={cn("text-6xl font-serif mb-8 text-white", headingFont.className)}>Echo makes it simple, personal, and powerful to connect and be heard.</h2>
      </div>
      <div className='container mx-auto'>
        <div
          ref={componentRef}
          className="flex flex-col lg:flex-row items-start justify-between p-8 bg-white rounded-lg text-left min-h-[800px]"
        >
          <div className="lg:w-1/2 h-full flex flex-col justify-between pr-8">
            <motion.h2 className={cn("text-4xl font-serif font-bold mb-8 ", headingFont.className)}>Tailored Email Solutions for Every Professional</motion.h2>
            <div>
              {audiences.map((audience, index) => (
                <motion.div
                  key={audience.title}
                  animate={{
                    opacity: currentAudience === index ? 1 : 0.5,
                    scale: currentAudience === index ? 1.05 : 1
                  }}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <h3 className={`text-xl font-semibold mb-2 ${currentAudience === index ? 'text-green-600' : 'text-gray-700'}`}>
                    {audience.title}
                  </h3>
                  <p className="text-sm text-gray-600">{audience.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <Card className="p-4 bg-orange-50">
              <Image
                src="/api/placeholder/600/400"
                alt="Professional using email solutions"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audiences;