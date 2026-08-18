import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { clippingCount } from '../lib/clippings';

gsap.registerPlugin(ScrollTrigger);

// Must stay in sync with MissionNewsClippings.tsx
const CLIPPING_SCROLL_PER_CARD = 80;
const revealDistance = clippingCount * CLIPPING_SCROLL_PER_CARD;

// Highlight completes at this fraction of the total pin distance.
const HIGHLIGHT_END_FRACTION = 0.52;

const TEXT =
  'Safety should feel simple, immediate, and available to everyone. Halo helps people feel secure and reach help fast when it matters most. We are building tools that turn vulnerable moments into protected ones.';

// Build word/space token list so natural line-wrapping is preserved
function buildTokens() {
  const tokens: { type: 'word' | 'space'; value: string }[] = [];
  for (const part of TEXT.split(/(\s+)/)) {
    if (/^\s+$/.test(part)) tokens.push({ type: 'space', value: part });
    else if (part.length)   tokens.push({ type: 'word',  value: part });
  }
  return tokens;
}
const tokens = buildTokens();

export default function MissionTextHighlight() {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = Array.from(
      container.querySelectorAll<HTMLSpanElement>('[data-char]'),
    );
    if (!chars.length) return;

    const total = chars.length;
    const highlightEnd = Math.round(revealDistance * HIGHLIGHT_END_FRACTION);

    // Dim all characters initially
    chars.forEach(c => { c.style.color = 'rgba(255,255,255,0.15)'; });

    let trigger: ScrollTrigger | null = null;
    let raf = 0;

    const setup = () => {
      trigger = ScrollTrigger.create({
        id: 'mission-text-highlight',
        trigger: '#mission',
        start: 'top top',
        end: `+=${highlightEnd}`,
        scrub: true,          // immediate — no lag so reverse works perfectly
        onUpdate(self) {
          const front = self.progress * total;
          chars.forEach((char, i) => {
            if (i < front - 1) {
              char.style.color = 'rgba(255,255,255,0.85)';
            } else if (i > front) {
              char.style.color = 'rgba(255,255,255,0.15)';
            } else {
              const t = Math.max(0, Math.min(1, front - i));
              char.style.color = `rgba(255,255,255,${(0.15 + 0.70 * t).toFixed(3)})`;
            }
          });
        },
      });
    };

    // Defer one rAF so React has fully committed the DOM, then check the
    // flag (same pattern as __haloHeroPinReady in ScrollVideoBackground).
    // If the mission pin already fired before our effect ran, call setup()
    // immediately; otherwise wait for the event.
    raf = requestAnimationFrame(() => {
      if ((window as any).__haloMissionPinReady) {
        setup();
      } else {
        window.addEventListener('mission-pin-ready', setup, { once: true });
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      trigger?.kill();
      window.removeEventListener('mission-pin-ready', setup);
    };
  }, []);

  return (
    <p
      ref={containerRef}
      className="font-satoshi text-base md:text-lg leading-relaxed"
      style={{ color: 'rgba(255,255,255,0.15)' }}
    >
      {tokens.map((token, ti) => {
        if (token.type === 'space') {
          return (
            <span key={`s-${ti}`} data-char aria-hidden="true">
              {token.value}
            </span>
          );
        }
        return (
          <span key={`w-${ti}`} style={{ display: 'inline', whiteSpace: 'normal' }}>
            {Array.from(token.value).map((char, ci) => (
              <span key={ci} data-char>
                {char}
              </span>
            ))}
          </span>
        );
      })}
    </p>
  );
}
