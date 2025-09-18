// src/components/HeroSlider.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const slideRefs = useRef([]);
  const particlesRef = useRef([]);
  const streaksRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/hero-slides/`, { cache: "no-store" })
      .then(async (res) => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          console.error("Invalid JSON:", text.slice(0, 200));
          return [];
        }
      })
      .then(setSlides)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;

      const title = slide.querySelector(".slide-title");
      const subtitle = slide.querySelector(".slide-subtitle");
      const button = slide.querySelector(".slide-button");
      const bg = slide.querySelector(".slide-bg");

      // Subtle background parallax + scale
      gsap.to(bg, {
        scale: 1.05,
        rotation: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Particles floating
      const particles = particlesRef.current[i];
      if (particles) {
        gsap.to(particles.children, {
          y: "random(-25,25)",
          x: "random(-35,35)",
          rotation: "random(-15,15)",
          opacity: 0.6,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Streaks animation
      const streaks = streaksRef.current[i];
      if (streaks) {
        gsap.to(streaks.children, {
          x: "random(-200,200)",
          y: "random(-150,150)",
          rotation: "random(-30,30)",
          opacity: "random(0.1,0.5)",
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Text animation
      const tl = gsap.timeline({ scrollTrigger: { trigger: slide, start: "top 80%" } });
      tl.from(title, { y: 50, opacity: 0, duration: 1, ease: "power3.out" })
        .from(subtitle, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
        .from(button, { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");
    });

    // Mouse-based parallax for streaks
    const handleMouseMove = (e) => {
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      streaksRef.current.forEach((streaks) => {
        if (!streaks) return;
        gsap.to(streaks, { x: mouseX * 80, y: mouseY * 60, duration: 0.5, ease: "power1.out" });
      });
      // Foreground parallax for text
      slideRefs.current.forEach((slide) => {
        if (!slide) return;
        const content = slide.querySelector(".slide-content");
        if (!content) return;
        gsap.to(content, { x: mouseX * 25, y: mouseY * 15, duration: 0.5, ease: "power1.out" });
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [slides]);

  const renderParticles = (i) => {
    const particles = [];
    for (let j = 0; j < 15; j++) {
      particles.push(
        <div
          key={j}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/50"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
        />
      );
    }
    return <div ref={(el) => (particlesRef.current[i] = el)} className="absolute inset-0 pointer-events-none">{particles}</div>;
  };

  const renderStreaks = (i) => {
    const streaks = [];
    for (let j = 0; j < 8; j++) {
      streaks.push(
        <div
          key={j}
          className="absolute w-1 h-32 rounded-full bg-gradient-to-b from-purple-400 via-pink-400 to-orange-400 opacity-40 blur-lg"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      );
    }
    return <div ref={(el) => (streaksRef.current[i] = el)} className="absolute inset-0 pointer-events-none">{streaks}</div>;
  };

  const renderButton = (text, link) => {
    if (!link) return null;
    const classes = "mt-6 inline-block px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold shadow-xl hover:scale-105 transition-all duration-500";
    return link.startsWith("/") ? <Link href={link} className={classes}>{text}</Link> : <a href={link} target="_blank" rel="noopener noreferrer" className={classes}>{text}</a>;
  };

  if (!slides.length) return null;

  return (
    <div ref={containerRef} className="w-full relative overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        className="h-[45vh] sm:h-[50vh] md:h-[60vh] w-full"
      >
        {slides.map((slide, i) => {
          const imageUrl = slide.image?.startsWith("http")
            ? slide.image
            : `${process.env.NEXT_PUBLIC_API_URL.replace("/api", "")}${slide.image}`;

          return (
            <SwiperSlide key={i}>
              <div ref={(el) => (slideRefs.current[i] = el)} className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {/* Background image sharp */}
                <div className="absolute inset-0 slide-bg bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />

                {/* Particles & streaks */}
                {renderParticles(i)}
                {renderStreaks(i)}

                {/* Content with foreground parallax */}
                <div className="slide-content relative z-10 text-center px-4 md:px-6 max-w-3xl">
                  <h1 className="slide-title text-white text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-[0_0_25px_rgba(255,215,0,0.9)] tracking-wide">
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="slide-subtitle text-purple-100/90 mt-3 text-lg md:text-xl drop-shadow-md">{slide.subtitle}</p>
                  )}
                  {slide.button_text && (
                    <div className="slide-button">{renderButton(slide.button_text, slide.button_link)}</div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}