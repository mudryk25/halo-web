import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const storiesCol1 = [
  { source: "BBC News", title: "Late Night Commute", body: "A student walking home late at night found herself followed. With no one around, she had to think fast to get to safety...", link: "#" },
  { source: "The Guardian", title: "Unsafe Streets", body: "Recent reports show a spike in anxiety among nighttime workers commuting in urban areas without adequate lighting...", link: "#" },
  { source: "Local News", title: "Campus Alert", body: "University issues warning after series of incidents near the library. Students urged to use buddy system...", link: "#" },
];

const storiesCol2 = [
  { source: "TechCrunch", title: "Safety Tech", body: "How new wearable devices are changing the landscape of personal security for vulnerable populations...", link: "#" },
  { source: "NY Times", title: "Domestic Concerns", body: "Advocates call for better discrete emergency tools for those in unsafe domestic situations who cannot make a call...", link: "#" },
  { source: "NPR", title: "Community Watch", body: "Neighborhood groups are adopting new digital tools to keep their streets safer after dark...", link: "#" },
];

const StoryCard = ({ story }: { story: any }) => (
  <div className="w-[200px] md:w-[240px] lg:w-[260px] xl:w-[300px] flex-shrink-0 rounded-3xl bg-[#2b6496]/40 backdrop-blur-md border border-white/10 p-6 flex flex-col gap-4 text-white shadow-2xl mb-6 mx-auto relative overflow-hidden pointer-events-auto">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '8px 8px' }}></div>
    <div className="relative z-10 flex flex-col h-full gap-4">
      <h3 className="font-serif text-2xl font-bold tracking-wide">{story.source}</h3>
      <div className="border-t border-dotted border-white/20 w-full" />
      <h4 className="font-satoshi font-bold text-xl leading-tight">{story.title}</h4>
      <p className="font-satoshi text-base text-gray-200 leading-relaxed line-clamp-4">{story.body}</p>
      <div className="border-t border-dotted border-white/20 w-full mt-auto pt-4" />
      <a href={story.link} className="font-satoshi text-sm font-medium hover:text-white/70 transition-colors inline-flex items-center gap-1">
        Read full story ↗
      </a>
    </div>
  </div>
);

export default function MissionStories() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const storiesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context;

    const initAnimation = () => {
      setTimeout(() => {
        if (ctx) ctx.revert();

        const aboutSection = document.querySelector('#about');

        ctx = gsap.context(() => {
          // === TEXT: Line-by-line left-to-right reveal ===
          const words = gsap.utils.toArray('.highlight-word', textRef.current) as HTMLElement[];
          const containerTop = textRef.current!.getBoundingClientRect().top;

          // Group words by visual line (round to nearest 4px for subpixel stability)
          const lineMap = new Map<number, HTMLElement[]>();
          words.forEach(word => {
            const lineKey = Math.round((word.getBoundingClientRect().top - containerTop) / 4) * 4;
            if (!lineMap.has(lineKey)) lineMap.set(lineKey, []);
            lineMap.get(lineKey)!.push(word);
          });

          const lines = [...lineMap.entries()]
            .sort(([a], [b]) => a - b)
            .map(([_, lineWords]) => lineWords);

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'bottom 30%',
              scrub: 1,
              invalidateOnRefresh: true,
            }
          });

          // Each line gets an equal slice of the timeline.
          // Within each slice: stagger fills 60% (left-to-right), each word's fade fills 40%.
          lines.forEach((lineWords, i) => {
            const sliceStart = i / lines.length;
            const sliceDuration = 1 / lines.length;

            tl.fromTo(lineWords,
              { color: 'rgba(255, 255, 255, 0.3)' },
              {
                color: 'rgba(255, 255, 255, 1)',
                stagger: { amount: sliceDuration * 0.6, from: 'start' },
                duration: sliceDuration * 0.4,
                ease: 'none',
              },
              sliceStart
            );
          });

          // === STORIES: CSS animation handles the loop; GSAP only controls visibility ===
          // Fade in when mission enters view; fade out when scrolling back above mission
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top bottom',
            onEnter: () => gsap.to(storiesContainerRef.current, { opacity: 1, duration: 0.6 }),
            onLeaveBack: () => gsap.to(storiesContainerRef.current, { opacity: 0, duration: 0.6 }),
          });

          // Fade out when About section enters view; fade back in when scrolling back above it
          ScrollTrigger.create({
            trigger: aboutSection,
            start: 'top bottom',
            onEnter: () => gsap.to(storiesContainerRef.current, { opacity: 0, duration: 0.6 }),
            onLeaveBack: () => gsap.to(storiesContainerRef.current, { opacity: 1, duration: 0.6 }),
          });

          ScrollTrigger.refresh();
        }, sectionRef);
      }, 50);
    };

    window.addEventListener('hero-pin-ready', initAnimation, { once: true });

    const fallbackTimer = setTimeout(() => {
      if (!ctx) initAnimation();
    }, 500);

    return () => {
      window.removeEventListener('hero-pin-ready', initAnimation);
      clearTimeout(fallbackTimer);
      if (ctx) ctx.revert();
    };
  }, []);

  const missionParagraphs = [
    "We believe safety should not be a luxury or something you have to worry about when you are just trying to live your life.",
    "Our mission is simple: give people the tools they need to feel secure and get help fast when it matters most.",
    "Whether someone is walking home alone, in an unsafe relationship, or facing any threat to their wellbeing, they deserve more than just hoping for the best.",
    "We are building Halo to bridge that gap between feeling vulnerable and feeling protected.",
    "Real safety features that work when you need them, designed by people who understand what it is like to feel unsafe.",
    "Everyone should be able to move through the world with confidence, knowing that help is always within reach."
  ];

  return (
    <section ref={sectionRef} className="relative w-full min-h-[100svh] py-20 md:py-32 border-y border-transparent flex items-center justify-center">

      {/* Story columns fixed to the full viewport — CSS animation drives the infinite loop */}
      <div
        ref={storiesContainerRef}
        className="fixed inset-0 flex justify-between items-start w-full px-2 md:px-4 lg:px-8 pointer-events-none overflow-hidden z-[5]"
        style={{
          opacity: 0,
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      >
        {/* Left column — loops every 16s */}
        <div
          className="hidden sm:flex flex-col gap-6 flex-shrink-0"
          style={{ animation: 'scrollUpThird 16s linear infinite' }}
        >
          {[...storiesCol1, ...storiesCol1, ...storiesCol1].map((story, i) => (
            <StoryCard key={`l-${i}`} story={story} />
          ))}
        </div>

        {/* Right column — loops every 22s, offset by half a cycle so they're out of phase */}
        <div
          className="hidden sm:flex flex-col gap-6 flex-shrink-0"
          style={{ animation: 'scrollDownThird 22s linear infinite -11s' }}
        >
          {[...storiesCol2, ...storiesCol2, ...storiesCol2].map((story, i) => (
            <StoryCard key={`r-${i}`} story={story} />
          ))}
        </div>
      </div>

      <div className="mx-auto px-4 w-full flex items-center justify-center relative z-20
        max-w-[95%]
        md:max-w-xl
        lg:max-w-[calc(100vw-620px)]
        xl:max-w-[calc(100vw-760px)]
        2xl:max-w-[900px]
      ">
        <div className="flex flex-col justify-center items-center relative p-2 sm:p-6" ref={textRef}>
          <div className="space-y-6 md:space-y-8 text-center">
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-serif text-white mb-6 md:mb-12">Our Mission</h2>
            {missionParagraphs.map((text, i) => (
              <p key={i} className="mission-paragraph font-satoshi text-xl md:text-2xl xl:text-3xl leading-relaxed font-medium">
                {text.split(' ').map((word, j) => (
                  <span key={`${i}-${j}`} className="highlight-word inline-block mr-1.5 text-white/30">
                    {word}
                  </span>
                ))}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
