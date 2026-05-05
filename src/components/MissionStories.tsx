import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Incident {
  id: number;
  avatar: string;
  source: string;
  title: string;
  body: string;
  tag: string;
}

const incidents: Incident[] = [
  {
    id: 1,
    avatar: '/media/avatars/halo1.webp',
    source: 'BBC News',
    title: 'Late Night Commute',
    body: 'A student walking home late at night found herself followed. With her phone nearly dead and no one around, she had to think fast to reach safety.',
    tag: 'Personal Safety',
  },
  {
    id: 2,
    avatar: '/media/avatars/halo2.webp',
    source: 'The Guardian',
    title: 'Unsafe Streets',
    body: 'Reports show a steep rise in anxiety among nighttime workers commuting through urban areas with inadequate lighting and no visible security.',
    tag: 'Urban Safety',
  },
  {
    id: 3,
    avatar: '/media/avatars/halo3.webp',
    source: 'Local News',
    title: 'Campus Alert',
    body: 'A university issued warnings after a series of incidents near the library, urging students to walk in pairs and keep emergency contacts ready.',
    tag: 'Campus Safety',
  },
  {
    id: 4,
    avatar: '/media/avatars/halo4.webp',
    source: 'TechCrunch',
    title: 'Safety Tech Gap',
    body: 'Consumer devices have prioritized fitness tracking while neglecting the real need: a reliable, discreet way to signal distress in dangerous moments.',
    tag: 'Technology',
  },
  {
    id: 5,
    avatar: '/media/avatars/halo5.webp',
    source: 'NY Times',
    title: 'Domestic Concerns',
    body: 'Advocates are calling for tools built for those in unsafe home situations — ones that work without an open phone call or any visible signal.',
    tag: 'Domestic Safety',
  },
  {
    id: 6,
    avatar: '/media/avatars/halo6.webp',
    source: 'NPR',
    title: 'Community Watch',
    body: 'Neighborhood groups are adopting digital tools to collaboratively monitor streets and respond faster to safety incidents after dark.',
    tag: 'Community',
  },
  {
    id: 7,
    avatar: '/media/avatars/halo7.webp',
    source: 'Reuters',
    title: 'Elderly Isolation',
    body: 'Seniors living alone face heightened risk with no quick, reliable way to call for help during a fall or medical emergency at home.',
    tag: 'Elder Safety',
  },
  {
    id: 8,
    avatar: '/media/avatars/halo8.webp',
    source: 'AP News',
    title: 'Night Shift Workers',
    body: 'Hospital and service staff finishing after midnight report feeling exposed and unsupported during the final stretch of their commute home.',
    tag: 'Workplace Safety',
  },
  {
    id: 9,
    avatar: '/media/avatars/halo9.webp',
    source: 'ABC News',
    title: 'Teen Safety',
    body: 'Parents and teens alike feel the gap between digital check-ins and being genuinely secure in public spaces and on the way home from school.',
    tag: 'Youth Safety',
  },
  {
    id: 10,
    avatar: '/media/avatars/halo10.webp',
    source: 'CNN',
    title: 'Trail Incidents',
    body: 'Hikers and runners on popular trails describe feeling vulnerable in areas with poor cell coverage and no reliable way to summon emergency help.',
    tag: 'Outdoor Safety',
  },
  {
    id: 11,
    avatar: '/media/avatars/halo11.webp',
    source: 'Forbes',
    title: 'Solo Travel Risk',
    body: 'Solo travelers — especially women — navigate unfamiliar cities with little protection beyond local knowledge and the hope that nothing goes wrong.',
    tag: 'Travel Safety',
  },
];

const INNER_COUNT = 5;
const OUTER_COUNT = 6;
const TAU = Math.PI * 2;

interface Config {
  innerRadius: number;
  outerRadius: number;
  yRatio: number;
}

function getConfig(): Config {
  if (typeof window === 'undefined') return { innerRadius: 240, outerRadius: 390, yRatio: 1.0 };
  const w = window.innerWidth;
  if (w < 640)  return { innerRadius: 130, outerRadius: 200, yRatio: 0.5 };
  if (w < 1024) return { innerRadius: 185, outerRadius: 295, yRatio: 0.85 };
  return { innerRadius: 240, outerRadius: 390, yRatio: 1.0 };
}

export default function MissionStories() {
  const [selected, setSelected] = useState<Incident | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const sectionRef        = useRef<HTMLElement>(null);
  const textRef           = useRef<HTMLDivElement>(null);
  const wrapperRefs       = useRef<(HTMLDivElement | null)[]>(Array(incidents.length).fill(null));
  const hoveredRef        = useRef<number | null>(null);
  const configRef         = useRef<Config>(getConfig());
  const rafRef            = useRef<number>(0);
  const avatarOrbitStarts = useRef<(number | null)[]>(Array(incidents.length).fill(null));
  const innerOrbitTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outerOrbitTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Resize ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => { configRef.current = getConfig(); };
    window.addEventListener('resize', onResize, { passive: true });
    configRef.current = getConfig();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Continuous orbit (RAF) — per-avatar orbit start times ───────────────────
  useEffect(() => {
    const tick = (now: number) => {
      const cfg = configRef.current;

      incidents.forEach((incident, i) => {
        const t0 = avatarOrbitStarts.current[i];
        if (t0 === null) { return; }

        const el = wrapperRefs.current[i];
        if (!el) return;

        const t         = (now - t0) / 1000;
        const isInner   = i < INNER_COUNT;
        const ringIndex = isInner ? i : i - INNER_COUNT;
        const total     = isInner ? INNER_COUNT : OUTER_COUNT;
        const radius    = isInner ? cfg.innerRadius : cfg.outerRadius;
        const period    = isInner ? 32 : 52;
        const dir       = isInner ? 1 : -1;
        const startAngle = (ringIndex / total) * TAU - Math.PI / 2;
        const angle      = startAngle + dir * (t / period) * TAU;
        const x          = Math.cos(angle) * radius;
        const y          = Math.sin(angle) * radius * cfg.yRatio;
        const depth      = (Math.sin(angle) + 1) / 2;

        el.style.transform = `translate(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px))`;
        el.style.opacity   = (0.45 + 0.55 * depth).toFixed(2);
        el.style.zIndex    = incident.id === hoveredRef.current ? '25' : String(Math.round(depth * 18));
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── 3-phase pinned scroll animation ─────────────────────────────────────────
  useEffect(() => {
    const cfg = configRef.current;

    const makeProxy = (i: number) => {
      const isInner    = i < INNER_COUNT;
      const ringIndex  = isInner ? i : i - INNER_COUNT;
      const total      = isInner ? INNER_COUNT : OUTER_COUNT;
      const radius     = isInner ? cfg.innerRadius : cfg.outerRadius;
      const startAngle = (ringIndex / total) * TAU - Math.PI / 2;
      const startR     = radius * 3.2;
      return {
        x:  Math.cos(startAngle) * startR,
        y:  Math.sin(startAngle) * startR,
        op: 0,
        tx: Math.cos(startAngle) * radius,
        ty: Math.sin(startAngle) * radius * cfg.yRatio,
        to: 0.45 + 0.55 * ((Math.sin(startAngle) + 1) / 2),
        el: wrapperRefs.current[i]!,
        i,
      };
    };

    const buildRingTl = (indices: number[]) => {
      const proxies = indices.map(makeProxy);
      const tl = gsap.timeline({ paused: true });
      proxies.forEach((p, idx) => {
        if (!p.el) return;
        tl.to(p, {
          x: p.tx, y: p.ty, op: p.to,
          duration: 1.2,
          ease: 'power3.out',
          onUpdate() {
            if (avatarOrbitStarts.current[p.i] !== null) return;
            p.el.style.transform = `translate(calc(-50% + ${p.x.toFixed(1)}px), calc(-50% + ${p.y.toFixed(1)}px))`;
            p.el.style.opacity   = p.op.toFixed(2);
          },
        }, idx * 0.1);
      });
      return tl;
    };

    // 1. Set initial state
    incidents.forEach((_, i) => {
      const el = wrapperRefs.current[i];
      if (!el) return;
      const p = makeProxy(i);
      el.style.transform = `translate(calc(-50% + ${p.x.toFixed(1)}px), calc(-50% + ${p.y.toFixed(1)}px))`;
      el.style.opacity = '0';
      el.style.zIndex  = '0';
    });
    gsap.set(textRef.current, { opacity: 0, y: 24 });

    const innerIndices = Array.from({ length: INNER_COUNT }, (_, i) => i);
    const outerIndices = Array.from({ length: OUTER_COUNT }, (_, i) => i + INNER_COUNT);

    const innerTl = buildRingTl(innerIndices);
    const outerTl = buildRingTl(outerIndices);

    // 2. Master timeline: inner ring → outer ring → text
    const masterTl = gsap.timeline({ paused: true });
    masterTl.add(innerTl, 0);
    masterTl.add(outerTl, '>0.2');
    masterTl.to(textRef.current, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
    }, '>0.3');

    // Phase thresholds as fractions of total masterTl duration
    const totalDur      = masterTl.duration();
    const innerThresh   = innerTl.duration() / totalDur;
    const outerThresh   = (innerTl.duration() + 0.2 + outerTl.duration()) / totalDur;

    const startInnerOrbit = () => {
      if (innerOrbitTimer.current !== null) return;
      innerOrbitTimer.current = setTimeout(() => {
        innerOrbitTimer.current = null;
        const now = performance.now();
        innerIndices.forEach(i => { if (avatarOrbitStarts.current[i] === null) avatarOrbitStarts.current[i] = now; });
      }, 1100);
    };

    const stopInnerOrbit = () => {
      if (innerOrbitTimer.current !== null) { clearTimeout(innerOrbitTimer.current); innerOrbitTimer.current = null; }
      innerIndices.forEach(i => { avatarOrbitStarts.current[i] = null; });
    };

    const startOuterOrbit = () => {
      if (outerOrbitTimer.current !== null) return;
      outerOrbitTimer.current = setTimeout(() => {
        outerOrbitTimer.current = null;
        const now = performance.now();
        outerIndices.forEach(i => { if (avatarOrbitStarts.current[i] === null) avatarOrbitStarts.current[i] = now; });
      }, 1100);
    };

    const stopOuterOrbit = () => {
      if (outerOrbitTimer.current !== null) { clearTimeout(outerOrbitTimer.current); outerOrbitTimer.current = null; }
      outerIndices.forEach(i => { avatarOrbitStarts.current[i] = null; });
    };

    // 3. Pin section; onUpdate manages orbit start/stop for both scroll directions
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger:   sectionRef.current,
        start:     'top top',
        end:       '+=220%',
        pin:       true,
        scrub:     1,
        animation: masterTl,
        onUpdate(self) {
          const p = self.progress;
          if (p >= innerThresh) { startInnerOrbit(); } else { stopInnerOrbit(); }
          if (p >= outerThresh) { startOuterOrbit(); } else { stopOuterOrbit(); }
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      stopInnerOrbit();
      stopOuterOrbit();
    };
  }, []);

  // ── Scroll-lock when modal open ──────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  return (
    <section ref={sectionRef} className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden">

      {/* Center text — starts invisible, fades in after more scrolling */}
      <div
        ref={textRef}
        className="relative z-10 text-center px-6 max-w-[260px] sm:max-w-xs mx-auto space-y-3 pointer-events-none select-none"
      >
        <p className="font-satoshi text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          Our Mission
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white leading-snug">
          Safety for everyone,<br />always within reach.
        </h2>
        <p className="font-satoshi text-xs sm:text-sm text-white/50 leading-relaxed">
          Meet the people whose stories inspire everything we build.
        </p>
      </div>

      {/* Orbital avatar halo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {incidents.map((incident, i) => (
          <div
            key={incident.id}
            ref={el => { wrapperRefs.current[i] = el; }}
            className="absolute pointer-events-auto"
            style={{ left: '50%', top: '50%', willChange: 'transform', opacity: 0 }}
          >
            <button
              type="button"
              className={[
                'block transition-all duration-300',
                'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20',
                i < INNER_COUNT ? 'lg:w-24 lg:h-24' : 'lg:w-20 lg:h-20',
                hoveredId === incident.id ? 'scale-110 brightness-125' : '',
              ].join(' ')}
              onClick={() => setSelected(incident)}
              onMouseEnter={() => { setHoveredId(incident.id); hoveredRef.current = incident.id; }}
              onMouseLeave={() => { setHoveredId(null); hoveredRef.current = null; }}
              aria-label={`View story: ${incident.title}`}
            >
              <img
                src={incident.avatar}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>

            {hoveredId === incident.id && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none whitespace-nowrap text-[10px] sm:text-xs font-satoshi font-medium text-white/90 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                {incident.title}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Incident detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
          <div
            className="relative z-10 w-full max-w-md bg-gradient-to-br from-[#1c4270] to-[#0d2240] border border-white/10 rounded-3xl p-7 sm:p-9 shadow-[0_0_80px_rgba(0,0,0,0.5)]"
            style={{ animation: 'modal-appear 0.22s ease-out' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-white/40 hover:text-white/90 transition-colors text-sm leading-none font-satoshi"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="flex items-start gap-4 mb-5">
              <img
                src={selected.avatar}
                alt=""
                className="w-16 h-16 object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-satoshi text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 mb-0.5">
                  {selected.source}
                </p>
                <h3 className="font-serif text-xl sm:text-2xl text-white leading-tight">
                  {selected.title}
                </h3>
              </div>
            </div>

            <span className="inline-flex items-center text-[11px] font-satoshi font-medium text-white/60 bg-white/10 border border-white/10 rounded-full px-3 py-1 mb-5">
              {selected.tag}
            </span>

            <p className="font-satoshi text-sm sm:text-base text-white/75 leading-relaxed">
              {selected.body}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
