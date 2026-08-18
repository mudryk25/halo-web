import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clippings } from '../lib/clippings';
import { preloadImage } from '../lib/preloadImage';

gsap.registerPlugin(ScrollTrigger);

const positions = [
  { top: '5%',  left: '1%',  rotate: -7,  width: 236, paper: 0,  zIndex: 4 },
  { top: '4%',  left: '76%', rotate:  5,  width: 194, paper: 1,  zIndex: 7 },
  { top: '49%', left: '1%',  rotate:  9,  width: 214, paper: 2,  zIndex: 6 },
  { top: '56%', left: '79%', rotate: -4,  width: 252, paper: 3,  zIndex: 5 },
  { top: '14%', left: '5%',  rotate:  3,  width: 208, paper: 4,  zIndex: 8 },
  { top: '32%', left: '82%', rotate: -8,  width: 188, paper: 5,  zIndex: 10 },
  { top: '0%',  left: '32%', rotate:  6,  width: 232, paper: 6,  zIndex: 9 },
  { top: '19%', left: '85%', rotate: -5,  width: 176, paper: 7,  zIndex: 11 },
  { top: '1%',  left: '50%', rotate:  8,  width: 204, paper: 8,  zIndex: 12 },
  { top: '37%', left: '4%',  rotate: -3,  width: 226, paper: 9,  zIndex: 13 },
  { top: '1%',  left: '12%', rotate:  4,  width: 186, paper: 10, zIndex: 14 },
  { top: '2%',  left: '41%', rotate: -10, width: 248, paper: 11, zIndex: 15 },
  { top: '28%', left: '0%',  rotate:  2,  width: 172, paper: 12, zIndex: 16 },
  { top: '7%',  left: '87%', rotate:  11, width: 156, paper: 13, zIndex: 17 },
  { top: '81%', left: '5%',  rotate: -6,  width: 196, paper: 14, zIndex: 18 },
  { top: '44%', left: '84%', rotate:  7,  width: 182, paper: 15, zIndex: 19 },
  { top: '0%',  left: '8%',  rotate: -12, width: 164, paper: 16, zIndex: 20 },
  { top: '25%', left: '78%', rotate:  13, width: 218, paper: 17, zIndex: 21 },
  { top: '69%', left: '86%', rotate: -9,  width: 166, paper: 18, zIndex: 22 },
  { top: '62%', left: '5%',  rotate:  12, width: 202, paper: 19, zIndex: 23 },
  { top: '0%',  left: '59%', rotate: -2,  width: 242, paper: 20, zIndex: 24 },
  { top: '1%',  left: '25%', rotate:  9,  width: 154, paper: 21, zIndex: 25 },
  { top: '19%', left: '0%',  rotate:  8,  width: 184, paper: 22, zIndex: 26 },
  { top: '80%', left: '86%', rotate:  4,  width: 144, paper: 23, zIndex: 27 },
  { top: '70%', left: '78%', rotate: -13, width: 218, paper: 24, zIndex: 28 },
  { top: '35%', left: '90%', rotate: -1,  width: 160, paper: 25, zIndex: 29 },
  { top: '89%', left: '0%',  rotate: -8,  width: 224, paper: 3,  zIndex: 30 },
  { top: '86%', left: '17%', rotate:  5,  width: 178, paper: 11, zIndex: 31 },
  { top: '88%', left: '32%', rotate: -3,  width: 214, paper: 18, zIndex: 32 },
  { top: '90%', left: '49%', rotate:  7,  width: 198, paper: 7,  zIndex: 33 },
  { top: '87%', left: '64%', rotate: -6,  width: 232, paper: 16, zIndex: 34 },
  { top: '89%', left: '82%', rotate:  4,  width: 190, paper: 22, zIndex: 35 },
  { top: '15%', left: '22%', rotate: -5,  width: 206, paper: 6,  zIndex: 36 },
  { top: '17%', left: '61%', rotate:  4,  width: 220, paper: 14, zIndex: 37 },
  { top: '40%', left: '25%', rotate:  6,  width: 184, paper: 2,  zIndex: 38 },
  { top: '41%', left: '58%', rotate: -7,  width: 238, paper: 9,  zIndex: 39 },
  { top: '58%', left: '28%', rotate: -4,  width: 208, paper: 21, zIndex: 40 },
  { top: '60%', left: '55%', rotate:  8,  width: 194, paper: 5,  zIndex: 41 },
  { top: '74%', left: '25%', rotate:  3,  width: 224, paper: 13, zIndex: 42 },
  { top: '74%', left: '57%', rotate: -8,  width: 188, paper: 1,  zIndex: 43 },
  { top: '30%', left: '38%', rotate: -2,  width: 216, paper: 19, zIndex: 44 },
  { top: '28%', left: '52%', rotate:  10, width: 168, paper: 24, zIndex: 45 },
  { top: '51%', left: '42%', rotate:  2,  width: 232, paper: 0,  zIndex: 46 },
  { top: '66%', left: '41%', rotate: -11, width: 176, paper: 12, zIndex: 47 },
];

const papers = [
  { bg: 'linear-gradient(135deg, #f2e0b0 0%, #e8d090 60%, #f0dca8 100%)', ink: '#1a1208', muted: '#5a4a30', rule: '#b09060', tag: '#6b5030', body: '#2a1e0e', radius: '1px', padding: '18px 16px 20px', minHeight: 'unset', shadow: '3px 4px 16px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.15)', shape: 'polygon(0% 2%, 2% 0%, 6% 1.5%, 12% 0%, 19% 1%, 27% 0%, 35% 1.5%, 44% 0%, 53% 1%, 62% 0%, 70% 1.5%, 78% 0%, 85% 1%, 92% 0%, 97% 1.5%, 100% 0%, 99% 8%, 100% 18%, 99% 28%, 100% 40%, 99% 52%, 100% 64%, 99% 76%, 100% 88%, 99% 97%, 100% 100%, 94% 99%, 86% 100%, 78% 98.5%, 70% 100%, 62% 99%, 54% 100%, 46% 98.5%, 38% 100%, 30% 99%, 22% 100%, 14% 98.5%, 6% 100%, 2% 99%, 0% 100%, 1% 90%, 0% 78%, 1% 66%, 0% 54%, 1% 42%, 0% 30%, 1% 18%)' },
  { bg: 'linear-gradient(160deg, #fbf8ee 0%, #ece6d8 100%)', ink: '#12100c', muted: '#696257', rule: '#c8bda8', tag: '#514739', body: '#29241b', radius: '0 8px 2px 0', padding: '16px 15px 18px', minHeight: 'unset', shadow: '2px 5px 14px rgba(0,0,0,0.48), inset 0 0 0 1px rgba(0,0,0,0.06)', shape: 'polygon(0 0, 100% 2%, 98% 18%, 100% 36%, 97% 53%, 100% 72%, 98% 100%, 3% 98%, 0 82%, 2% 66%, 0 49%, 3% 31%, 0 14%)' },
  { bg: 'linear-gradient(145deg, #d8d8d2 0%, #bfc2bc 100%)', ink: '#101312', muted: '#525854', rule: '#92988f', tag: '#3f4743', body: '#202725', radius: '10px 1px 8px 2px', padding: '17px 16px 21px', minHeight: 'unset', shadow: '4px 6px 18px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.2)', shape: 'polygon(1% 4%, 14% 0, 29% 3%, 43% 0, 59% 2%, 74% 0, 100% 5%, 96% 23%, 100% 42%, 97% 61%, 100% 82%, 94% 100%, 77% 97%, 59% 100%, 40% 96%, 22% 100%, 0 95%, 4% 73%, 0 52%, 3% 31%)' },
  { bg: 'linear-gradient(135deg, #fffdf7 0%, #f0f0ed 62%, #dedbd2 100%)', ink: '#141414', muted: '#5f5f5f', rule: '#b7b7b7', tag: '#444', body: '#272727', radius: '2px', padding: '15px 16px 18px', minHeight: 'unset', shadow: '2px 3px 12px rgba(0,0,0,0.52)', shape: 'polygon(0 7%, 7% 0, 100% 0, 97% 27%, 100% 51%, 96% 76%, 100% 100%, 8% 97%, 0 100%, 3% 69%, 0 42%)' },
  { bg: 'linear-gradient(150deg, #efe7d0 0%, #d2c2a2 100%)', ink: '#170f07', muted: '#67573c', rule: '#aa956c', tag: '#6a512b', body: '#30210e', radius: '12px 2px 1px 12px', padding: '20px 15px 17px', minHeight: '168px', shadow: '5px 7px 20px rgba(0,0,0,0.5)', shape: 'polygon(3% 0, 96% 2%, 100% 16%, 96% 32%, 100% 47%, 97% 63%, 100% 84%, 94% 100%, 3% 96%, 0 78%, 4% 58%, 0 38%, 5% 18%)' },
  { bg: 'linear-gradient(155deg, #f7f3e8 0%, #e2dccf 100%)', ink: '#18130d', muted: '#70675a', rule: '#bfb3a2', tag: '#574a39', body: '#2a241a', radius: '999px 999px 12px 12px / 28px 28px 12px 12px', padding: '18px 17px 19px', minHeight: 'unset', shadow: '3px 5px 15px rgba(0,0,0,0.45)', shape: 'polygon(4% 0, 22% 4%, 44% 0, 68% 3%, 97% 0, 100% 100%, 0 96%)' },
  { bg: 'linear-gradient(140deg, #cfcac0 0%, #aeb0aa 100%)', ink: '#111', muted: '#4d504d', rule: '#858982', tag: '#323734', body: '#1d211f', radius: '1px 14px 1px 1px', padding: '14px 14px 18px', minHeight: 'unset', shadow: '2px 6px 18px rgba(0,0,0,0.5)', shape: 'polygon(0 0, 92% 0, 100% 9%, 98% 31%, 100% 57%, 95% 100%, 6% 98%, 0 88%, 2% 64%, 0 37%)' },
  { bg: 'linear-gradient(145deg, #fafafa 0%, #e7e7e2 100%)', ink: '#161616', muted: '#656565', rule: '#bbbbbb', tag: '#4d4d4d', body: '#262626', radius: '0', padding: '13px 13px 15px', minHeight: '156px', shadow: '4px 4px 13px rgba(0,0,0,0.46)', shape: 'polygon(0 0, 100% 6%, 94% 100%, 0 93%)' },
  { bg: 'linear-gradient(135deg, #ead7a6 0%, #c8a96b 100%)', ink: '#1d1307', muted: '#64502c', rule: '#9d7d42', tag: '#5c3f18', body: '#2a1a08', radius: '6px 1px 16px 1px', padding: '19px 16px 19px', minHeight: 'unset', shadow: '5px 5px 18px rgba(0,0,0,0.54)', shape: 'polygon(0 3%, 19% 0, 36% 4%, 58% 0, 77% 3%, 100% 0, 96% 22%, 100% 45%, 94% 69%, 100% 98%, 78% 100%, 55% 96%, 33% 100%, 9% 96%, 0 100%, 4% 71%, 0 44%, 4% 20%)' },
  { bg: 'linear-gradient(160deg, #e6e2d7 0%, #cac6bb 100%)', ink: '#161513', muted: '#5d5a52', rule: '#aaa499', tag: '#464137', body: '#2a2824', radius: '18px 3px 18px 3px', padding: '17px 14px 19px', minHeight: 'unset', shadow: '2px 4px 16px rgba(0,0,0,0.5)', shape: 'polygon(3% 0, 100% 0, 97% 12%, 100% 28%, 96% 44%, 100% 63%, 96% 82%, 100% 100%, 0 96%, 4% 77%, 0 58%, 5% 39%, 0 19%)' },
  { bg: 'linear-gradient(145deg, #f5f2ea 0%, #ded8cc 100%)', ink: '#17110a', muted: '#61594c', rule: '#b2a794', tag: '#4d4232', body: '#262016', radius: '2px 2px 24px 2px', padding: '15px 15px 20px', minHeight: 'unset', shadow: '4px 6px 15px rgba(0,0,0,0.48)', shape: 'polygon(0 0, 100% 0, 96% 22%, 100% 42%, 95% 61%, 100% 100%, 14% 96%, 0 100%, 5% 74%, 0 49%, 4% 24%)' },
  { bg: 'linear-gradient(140deg, #bfc1bb 0%, #e4e2da 45%, #b8bab5 100%)', ink: '#101211', muted: '#4e5651', rule: '#8b918b', tag: '#39433e', body: '#1c2420', radius: '4px', padding: '16px 16px 18px', minHeight: '172px', shadow: '3px 7px 18px rgba(0,0,0,0.52)', shape: 'polygon(6% 2%, 31% 0, 59% 4%, 82% 0, 100% 5%, 98% 33%, 100% 62%, 96% 100%, 71% 96%, 44% 100%, 19% 96%, 0 100%, 2% 65%, 0 31%)' },
  { bg: 'linear-gradient(135deg, #fffdfa 0%, #eeeeec 100%)', ink: '#141414', muted: '#606060', rule: '#bdbdbd', tag: '#464646', body: '#252525', radius: '1px 1px 1px 18px', padding: '14px 13px 16px', minHeight: '140px', shadow: '2px 5px 13px rgba(0,0,0,0.46)', shape: 'polygon(2% 0, 100% 4%, 98% 100%, 0 96%)' },
  { bg: 'linear-gradient(150deg, #d9c184 0%, #efe2bd 100%)', ink: '#1a1005', muted: '#65512b', rule: '#ab8948', tag: '#644416', body: '#291907', radius: '28px 4px 4px 4px', padding: '16px 14px 17px', minHeight: 'unset', shadow: '4px 4px 14px rgba(0,0,0,0.48)', shape: 'polygon(8% 0, 100% 0, 94% 20%, 100% 39%, 96% 61%, 100% 82%, 92% 100%, 0 94%, 3% 70%, 0 46%, 5% 23%)' },
  { bg: 'linear-gradient(145deg, #d6d5cf 0%, #f2f0ea 50%, #c9c8c2 100%)', ink: '#111', muted: '#595955', rule: '#a3a29c', tag: '#41413d', body: '#222', radius: '2px 18px 2px 18px', padding: '18px 15px 16px', minHeight: 'unset', shadow: '3px 5px 17px rgba(0,0,0,0.5)', shape: 'polygon(0 0, 88% 0, 100% 14%, 96% 40%, 100% 67%, 92% 100%, 0 100%, 4% 75%, 0 51%, 3% 24%)' },
  { bg: 'linear-gradient(135deg, #f1e0b5 0%, #ddc586 100%)', ink: '#160d03', muted: '#604d2b', rule: '#a88c56', tag: '#5b3f19', body: '#2a1c0a', radius: '2px', padding: '21px 16px 16px', minHeight: 'unset', shadow: '2px 7px 16px rgba(0,0,0,0.52)', shape: 'polygon(0 8%, 17% 0, 35% 5%, 54% 0, 72% 4%, 100% 0, 97% 100%, 0 94%)' },
  { bg: 'linear-gradient(150deg, #ece9df 0%, #d2d0ca 100%)', ink: '#151515', muted: '#5b5d5a', rule: '#aaaca8', tag: '#414540', body: '#252827', radius: '14px 14px 1px 1px', padding: '15px 14px 19px', minHeight: '150px', shadow: '3px 6px 15px rgba(0,0,0,0.5)', shape: 'polygon(1% 2%, 24% 0, 51% 3%, 79% 0, 100% 3%, 94% 99%, 0 100%, 5% 76%, 0 52%, 4% 27%)' },
  { bg: 'linear-gradient(145deg, #fffaf0 0%, #ece3d2 100%)', ink: '#17110a', muted: '#6f6252', rule: '#c1b39b', tag: '#554735', body: '#2c2419', radius: '4px 20px 4px 4px', padding: '17px 16px 20px', minHeight: 'unset', shadow: '5px 6px 18px rgba(0,0,0,0.48)', shape: 'polygon(0 0, 100% 0, 96% 16%, 100% 34%, 94% 52%, 100% 73%, 95% 96%, 72% 100%, 45% 96%, 19% 100%, 0 96%)' },
  { bg: 'linear-gradient(135deg, #c9cbc6 0%, #eff0eb 100%)', ink: '#101212', muted: '#555b57', rule: '#9ca29d', tag: '#37413c', body: '#1f2723', radius: '0 0 22px 0', padding: '14px 15px 17px', minHeight: 'unset', shadow: '2px 4px 14px rgba(0,0,0,0.49)', shape: 'polygon(0 0, 100% 5%, 99% 100%, 9% 95%, 0 100%, 3% 74%, 0 50%, 4% 24%)' },
  { bg: 'linear-gradient(155deg, #eee0bc 0%, #cdb07a 100%)', ink: '#1b1207', muted: '#655131', rule: '#a68a5d', tag: '#5d421d', body: '#2d1e0d', radius: '16px 1px 1px 16px', padding: '18px 16px 17px', minHeight: '164px', shadow: '4px 7px 18px rgba(0,0,0,0.54)', shape: 'polygon(4% 0, 100% 3%, 95% 25%, 100% 48%, 96% 69%, 100% 100%, 3% 96%, 0 80%, 4% 60%, 0 39%, 4% 18%)' },
  { bg: 'linear-gradient(145deg, #f8f8f4 0%, #dcdedb 100%)', ink: '#101010', muted: '#5b5d5c', rule: '#aeb2ae', tag: '#404441', body: '#202322', radius: '1px 10px 10px 1px', padding: '16px 13px 17px', minHeight: 'unset', shadow: '3px 5px 16px rgba(0,0,0,0.47)', shape: 'polygon(0 0, 96% 0, 100% 19%, 96% 38%, 100% 59%, 95% 81%, 100% 100%, 0 97%, 4% 72%, 0 47%, 4% 22%)' },
  { bg: 'linear-gradient(135deg, #d2d0c7 0%, #b5b8b3 100%)', ink: '#111513', muted: '#515a55', rule: '#8d958e', tag: '#36403a', body: '#1e2722', radius: '3px 3px 3px 24px', padding: '14px 14px 19px', minHeight: '146px', shadow: '3px 4px 15px rgba(0,0,0,0.5)', shape: 'polygon(3% 0, 100% 0, 97% 28%, 100% 54%, 96% 100%, 0 96%, 4% 69%, 0 36%)' },
  { bg: 'linear-gradient(145deg, #f3e6c1 0%, #e2c78f 100%)', ink: '#190f05', muted: '#654f2a', rule: '#aa8b50', tag: '#60431b', body: '#2b1b09', radius: '2px 24px 2px 2px', padding: '18px 15px 17px', minHeight: 'unset', shadow: '5px 5px 17px rgba(0,0,0,0.5)', shape: 'polygon(0 2%, 21% 0, 43% 3%, 64% 0, 100% 4%, 95% 26%, 100% 52%, 96% 79%, 100% 100%, 0 95%, 3% 70%, 0 46%, 5% 22%)' },
  { bg: 'linear-gradient(135deg, #fbfaf6 0%, #e9e9e4 100%)', ink: '#111', muted: '#62615d', rule: '#b9b7b1', tag: '#494640', body: '#25231f', radius: '20px 2px 20px 2px', padding: '13px 13px 15px', minHeight: '142px', shadow: '2px 6px 14px rgba(0,0,0,0.48)', shape: 'polygon(0 0, 100% 0, 94% 100%, 6% 96%)' },
  { bg: 'linear-gradient(155deg, #bfc4c1 0%, #ecece7 100%)', ink: '#101211', muted: '#515956', rule: '#929b96', tag: '#35413d', body: '#1c2422', radius: '1px 1px 18px 18px', padding: '15px 16px 18px', minHeight: 'unset', shadow: '4px 4px 15px rgba(0,0,0,0.51)', shape: 'polygon(0 5%, 15% 0, 34% 4%, 55% 0, 79% 3%, 100% 0, 96% 100%, 2% 95%)' },
  { bg: 'linear-gradient(145deg, #edd6a0 0%, #f4e3b7 45%, #caaa69 100%)', ink: '#1b1106', muted: '#604a27', rule: '#a27c3f', tag: '#5c3d15', body: '#2f1d08', radius: '2px 12px 2px 12px', padding: '16px 15px 18px', minHeight: '154px', shadow: '4px 7px 19px rgba(0,0,0,0.53)', shape: 'polygon(5% 0, 100% 4%, 96% 31%, 100% 58%, 95% 100%, 0 96%, 4% 67%, 0 35%)' },
];

export default function MissionNewsClippings() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [decodedCount, setDecodedCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const visibleCountRef = useRef(0);
  const decodedCountRef = useRef(0);

  useEffect(() => {
    let trigger: ScrollTrigger | null = null;
    let didSetup = false;
    let cancelled = false;
    const loaded = new Array(clippings.length).fill(false);
    const concurrency = 5;
    let activeRequests = 0;
    let nextPreloadIndex = 0;
    let desiredPreloadCount = 0;

    const updateDecodedCount = () => {
      let nextDecodedCount = decodedCountRef.current;

      while (loaded[nextDecodedCount]) {
        nextDecodedCount += 1;
      }

      if (nextDecodedCount !== decodedCountRef.current) {
        decodedCountRef.current = nextDecodedCount;
        setDecodedCount(nextDecodedCount);
      }
    };

    const pumpPreloadQueue = () => {
      if (cancelled) return;

      while (
        activeRequests < concurrency &&
        nextPreloadIndex < desiredPreloadCount &&
        nextPreloadIndex < clippings.length
      ) {
        const index = nextPreloadIndex;
        nextPreloadIndex += 1;
        activeRequests += 1;

        preloadImage(clippings[index].src, index < 12 ? 'high' : 'low').then(() => {
          activeRequests -= 1;

          if (cancelled) return;

          loaded[index] = true;
          updateDecodedCount();
          pumpPreloadQueue();
        });
      }
    };

    const preloadThrough = (count: number) => {
      desiredPreloadCount = Math.max(
        desiredPreloadCount,
        Math.min(clippings.length, count),
      );
      pumpPreloadQueue();
    };

    const setup = () => {
      if (didSetup) return;
      didSetup = true;
      preloadThrough(12);
      setMounted(true);

      // Pin lasts exactly as long as it takes to reveal all clippings.
      // After the pin releases, #mission (and the absolutely-positioned
      // clippings inside it) scroll naturally with the page — no exit
      // animation needed; the clippings just ride the section upward.
      const revealDistance = clippings.length * 80;

      trigger = ScrollTrigger.create({
        id: 'mission-clippings',
        trigger: '#mission',
        start: 'top top',
        end: `+=${revealDistance}`,
        pin: true,
        onUpdate(self) {
          const target = Math.min(
            clippings.length,
            Math.ceil(self.progress * clippings.length),
          );

          if (target !== visibleCountRef.current) {
            visibleCountRef.current = target;
            preloadThrough(target + 10);
            setVisibleCount(target);
          }
        },
      });

      // Refresh after the mission pin is added, with the hero pin already measured.
      ScrollTrigger.refresh();

      // Set the flag before dispatching so late-mounting components
      // can check it synchronously and avoid the race condition.
      (window as any).__haloMissionPinReady = true;
      window.dispatchEvent(new CustomEvent('mission-pin-ready'));
    };

    if ((window as any).__haloHeroPinReady) {
      setup();
    } else {
      window.addEventListener('hero-pin-ready', setup, { once: true });
    }

    const preloadTimer = window.setTimeout(() => preloadThrough(12), 600);

    return () => {
      cancelled = true;
      window.clearTimeout(preloadTimer);
      window.removeEventListener('hero-pin-ready', setup);
      trigger?.kill();
    };
  }, []);

  if (!mounted) return null;

  // Portal into #mission so the clippings are absolute children of the section.
  // During the GSAP pin, #mission is position:fixed so the absolute clippings
  // cover the full viewport — identical to the old body portal.
  // After the pin releases, #mission flows normally and the clippings ride up
  // with it, keeping the mission text hidden as the user scrolls to About.
  const missionEl = document.getElementById('mission');
  if (!missionEl) return null;

  return createPortal(
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
      aria-hidden="true"
    >
      {clippings.slice(0, Math.min(visibleCount, decodedCount)).map((clipping, i) => {
        const pos = positions[i];
        const paper = papers[pos.paper];
        const cardHeight = Math.round(pos.width * 1.18);
        const cardStyle = {
          background: '#f5f0e6',
          clipPath: paper.shape,
          borderRadius: paper.radius,
          height: `clamp(150px, ${Math.round(cardHeight / 12)}vw, ${cardHeight}px)`,
          boxShadow: paper.shadow,
        } as CSSProperties;
        const topPercent = parseFloat(pos.top);
        const leftPercent = parseFloat(pos.left);
        const mobileSafe = (leftPercent <= 8 || leftPercent >= 76) && (topPercent <= 22 || topPercent >= 78);
        const wrapperStyle = {
          position: 'absolute',
          top: pos.top,
          left: pos.left,
          width: `clamp(144px, ${Math.round(pos.width / 12)}vw, ${pos.width}px)`,
          transform: `rotate(${pos.rotate}deg)`,
          zIndex: pos.zIndex,
          '--mobile-card-width': `${Math.round(pos.width * 0.54)}px`,
          '--mobile-card-height': `${Math.round(cardHeight * 0.54)}px`,
        } as CSSProperties & Record<string, string | number>;

        return (
          <div
            key={clipping.id}
            className="newspaper-clipping-wrap"
            data-mobile-safe={mobileSafe}
            style={wrapperStyle}
          >
            <div className="newspaper-card newspaper-card--image" style={cardStyle}>
              <img
                className="newspaper-card-image"
                src={clipping.src}
                alt={clipping.alt}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                draggable={false}
              />
            </div>
          </div>
        );
      })}
    </div>,
    missionEl,
  );
}
