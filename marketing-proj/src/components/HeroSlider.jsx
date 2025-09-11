"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const slideRefs = useRef([]);
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const streaksRef = useRef([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/hero-slides/`, { cache: "no-store" })
      .then(async (res) => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          console.error("Invalid JSON, got HTML:", text.slice(0, 200));
          return [];
        }
      })
      .then((data) => setSlides(data))
      .catch((err) => console.error("Error fetching slides:", err));
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;
      const title = slide.querySelector(".slide-title");
      const subtitle = slide.querySelector(".slide-subtitle");
      const button = slide.querySelector(".slide-button");
      const bg = slide.querySelector(".slide-bg");

      // Premium zoom + parallax
      gsap.to(bg, {
        scale: 1.2,
        rotation: 0.3,
        ease: "power1.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Floating particles
      const particles = particlesRef.current[index];
      if (particles) {
        gsap.to(particles.children, {
          y: "random(-40, 40)",
          x: "random(-60, 60)",
          rotation: "random(-30, 30)",
          opacity: 0.8,
          duration: 7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // Gradient streaks
      const streaks = streaksRef.current[index];
      if (streaks) {
        gsap.to(streaks.children, {
          x: "random(-400, 400)",
          y: "random(-250, 250)",
          rotation: "random(-45, 45)",
          opacity: "random(0.2, 0.7)",
          duration: 12,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // Staggered text animations
      const tl = gsap.timeline({
        scrollTrigger: { trigger: slide, start: "top 70%" },
      });
      tl.from(title, { y: 60, opacity: 0, duration: 1, ease: "power3.out" })
        .from(subtitle, { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6")
        .from(button, { y: 20, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6");
    });

    // Mouse parallax for streaks
    const handleMouseMove = (e) => {
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      streaksRef.current.forEach((streaks) => {
        if (!streaks) return;
        gsap.to(streaks, { x: mouseX * 120, y: mouseY * 100, duration: 0.5, ease: "power1.out" });
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [slides]);

  const renderButton = (text, link) => {
    if (!link) return null;
    const baseClasses =
      "mt-6 md:mt-8 inline-block bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-500 text-black px-6 md:px-10 py-3 md:py-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-500 border border-white/20 backdrop-blur-lg hover:brightness-125 font-bold text-lg";
    if (link.startsWith("/")) return <Link href={link} className={baseClasses}>{text}</Link>;
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className={baseClasses}>
        {text}
      </a>
    );
  };

  const renderParticles = (index) => {
    const count = 20;
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/60"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
        />
      );
    }
    return <div ref={(el) => (particlesRef.current[index] = el)} className="absolute inset-0 pointer-events-none">{particles}</div>;
  };

  const renderStreaks = (index) => {
    const count = 10;
    const streaks = [];
    for (let i = 0; i < count; i++) {
      streaks.push(
        <div
          key={i}
          className="absolute w-1 h-40 rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-orange-400 opacity-50 blur-lg"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      );
    }
    return <div ref={(el) => (streaksRef.current[index] = el)} className="absolute inset-0 pointer-events-none">{streaks}</div>;
  };

  if (!slides.length) return null;

  return (
    <div ref={containerRef} className="w-full relative overflow-hidden pt-[64px] md:pt-[64px]">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        className="h-[65vh] md:h-[90vh]"
      >
        {slides.map((slide, index) => {
          const imageUrl = slide.image?.startsWith("http")
            ? slide.image
            : `${process.env.NEXT_PUBLIC_API_URL.replace("/api", "")}${slide.image}`;

          return (
            <SwiperSlide key={index}>
              <div ref={(el) => (slideRefs.current[index] = el)} className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 w-full h-full slide-bg bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                {/* Particles & streaks */}
                {renderParticles(index)}
                {renderStreaks(index)}

                {/* Content */}
                <div className="relative z-10 text-center px-4 md:px-6 max-w-3xl">
                  <h1 className="slide-title text-white text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-[0_0_30px_rgba(255,215,0,0.9)] tracking-wide">
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="slide-subtitle text-yellow-100/90 mt-4 text-lg md:text-2xl drop-shadow-md">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.button_text && (
                    <div className="slide-button">
                      {renderButton(slide.button_text, slide.button_link)}
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </div>
  );
}
