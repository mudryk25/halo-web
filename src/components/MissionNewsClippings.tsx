import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Story {
  id: number;
  source: string;
  title: string;
  body: string;
  tag: string;
}

const stories: Story[] = [
  { id: 1, source: 'BBC News',        title: 'Late Night Commute',     tag: 'Personal Safety', body: 'A student walking home late at night found herself followed. With her phone nearly dead and no one around, she had to think fast to reach safety.' },
  { id: 2, source: 'The Guardian',    title: 'Unsafe Streets',         tag: 'Urban Safety',    body: 'Reports show a steep rise in anxiety among nighttime workers commuting through urban areas with inadequate lighting and no visible security.' },
  { id: 3, source: 'Local News',      title: 'Campus Alert',           tag: 'Campus Safety',   body: 'A university issued warnings after a series of incidents near the library, urging students to walk in pairs and keep emergency contacts ready.' },
  { id: 4, source: 'TechCrunch',      title: 'Safety Tech Gap',        tag: 'Technology',      body: 'Consumer devices have prioritized fitness tracking while neglecting the real need: a reliable, discreet way to signal distress in dangerous moments.' },
  { id: 5, source: 'NY Times',        title: 'Domestic Concerns',      tag: 'Domestic Safety', body: 'Advocates are calling for tools built for those in unsafe home situations — ones that work without an open phone call or any visible signal.' },
  { id: 6, source: 'NPR',             title: 'Community Watch',        tag: 'Community',       body: 'Neighborhood groups are adopting digital tools to collaboratively monitor streets and respond faster to safety incidents after dark.' },
  { id: 7, source: 'Reuters',         title: 'Elderly Isolation',      tag: 'Elder Safety',    body: 'Seniors living alone face heightened risk with no quick, reliable way to call for help during a fall or medical emergency at home.' },
  { id: 8, source: 'AP News',         title: 'Night Shift Workers',    tag: 'Workplace Safety',body: 'Hospital and service staff finishing after midnight report feeling exposed and unsupported during the final stretch of their commute home.' },
  { id: 9, source: 'ABC News',        title: 'Teen Safety',            tag: 'Youth Safety',    body: 'Parents and teens alike feel the gap between digital check-ins and being genuinely secure in public spaces and on the way home from school.' },
  { id: 10, source: 'CNN',            title: 'Trail Incidents',        tag: 'Outdoor Safety',  body: 'Hikers and runners on popular trails describe feeling vulnerable in areas with poor cell coverage and no reliable way to summon emergency help.' },
  { id: 11, source: 'Forbes',         title: 'Solo Travel Risk',       tag: 'Travel Safety',   body: 'Solo travelers — especially women — navigate unfamiliar cities with little protection beyond local knowledge and the hope that nothing goes wrong.' },
  { id: 12, source: 'City Desk',      title: 'Parking Lot Panic',      tag: 'Public Spaces',   body: 'After a late grocery run, a shopper realized the walk to her car was more isolated than expected, with no staff or bystanders nearby.' },
  { id: 13, source: 'Healthline',     title: 'Medical Emergency Alone',tag: 'Health Safety',   body: 'For people living independently, a fall or sudden symptom can turn frightening fast when the phone is across the room.' },
  { id: 14, source: 'The Verge',      title: 'Wearables Miss Distress',tag: 'Devices',         body: 'Most wearables count steps and sleep, but still make emergency contact feel too visible, too slow, or too dependent on a phone screen.' },
  { id: 15, source: 'USA Today',      title: 'Ride Share Worries',     tag: 'Transit Safety',  body: 'Passengers describe the unease of realizing a route has changed and wanting a quiet way to alert someone before things escalate.' },
  { id: 16, source: 'Metro Times',    title: 'Dim Platform Reports',   tag: 'Commuting',       body: 'Transit riders say poorly lit platforms and long waits make the last train home feel like the most vulnerable part of the day.' },
  { id: 17, source: 'CNBC',           title: 'Caregiver Check-ins',    tag: 'Family Safety',   body: 'Families coordinating care need signals that are immediate and clear, especially when a loved one cannot explain what happened.' },
  { id: 18, source: 'Al Jazeera',     title: 'Crowd Crush Concern',    tag: 'Event Safety',    body: 'Large events can shift from exciting to dangerous in seconds, leaving attendees searching for help through noise and confusion.' },
  { id: 19, source: 'Vox',            title: 'Safety Anxiety Rises',   tag: 'Mental Load',     body: 'The constant habit of texting locations, checking exits, and planning escape routes has become invisible labor for many people.' },
  { id: 20, source: 'Bloomberg',      title: 'Office-to-Home Risk',    tag: 'After Hours',     body: 'Hybrid schedules mean more workers leave offices at irregular times, often crossing quiet business districts after support staff have gone.' },
  { id: 21, source: 'CBC',            title: 'Remote Trail Gaps',      tag: 'Outdoors',        body: 'Outdoor recreation groups warn that weak coverage and delayed response times make simple incidents more serious outside city limits.' },
  { id: 22, source: 'The Atlantic',   title: 'Small Signals Matter',   tag: 'Prevention',      body: 'Experts say the safest interventions often happen early, before someone has to make a loud call for help in front of a threat.' },
  { id: 23, source: 'MarketWatch',    title: 'Parents Seek Assurance', tag: 'Family Tech',     body: 'Parents want more than location dots. They want confidence that a child can reach trusted people quickly when something feels wrong.' },
  { id: 24, source: 'Morning Edition',title: 'Walking Alone',          tag: 'Everyday Safety', body: 'For many people, the simple act of walking somewhere alone still carries a calculation: who knows where I am, and how quickly could help arrive?' },
  { id: 25, source: 'Wired',          title: 'Quiet Emergency Tools',  tag: 'Design',          body: 'The next wave of safety tech is being judged by whether it works discreetly, reliably, and without asking people to unlock a screen.' },
  { id: 26, source: 'Local Bulletin', title: 'Neighborhood Response',  tag: 'Rapid Help',      body: 'Community responders say the hardest moments are the silent ones, when someone needs support but cannot safely explain the situation.' },
  { id: 27, source: 'Evening Post',    title: 'Last Block Home',        tag: 'Street Safety',   body: 'Residents say the final stretch home often feels the most exposed, especially when stores close and sidewalks empty out.' },
  { id: 28, source: 'Daily Record',    title: 'Stairwell Concern',      tag: 'Building Safety', body: 'Apartment tenants report feeling uneasy in isolated stairwells where cameras, lighting, and response plans are inconsistent.' },
  { id: 29, source: 'Public Radio',    title: 'Signal Lost',            tag: 'Connectivity',    body: 'Spotty service can leave people unsure whether a message, call, or emergency alert actually reached anyone.' },
  { id: 30, source: 'City Journal',    title: 'Empty Station',          tag: 'Transit',         body: 'Late-night riders describe platforms where a few extra minutes of waiting can feel much longer than they should.' },
  { id: 31, source: 'Dispatch',        title: 'Check-in Fatigue',       tag: 'Everyday Safety', body: 'People are tired of constant manual check-ins, but still want trusted contacts to know when something is wrong.' },
  { id: 32, source: 'Newswire',        title: 'Faster Help Needed',     tag: 'Emergency',       body: 'First responders and families both point to the same problem: the first alert often comes too late.' },
];

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
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const visibleCountRef = useRef(0);
  const overlayOpacityRef = useRef(1);

  useEffect(() => {
    setMounted(true);

    const revealDistance = stories.length * 135;
    const fadeDistance = 620;
    const revealProgressEnd = revealDistance / (revealDistance + fadeDistance);

    const trigger = ScrollTrigger.create({
      trigger: '#mission',
      start: 'top top',
      end: `+=${revealDistance + fadeDistance}`,
      pin: true,
      onUpdate(self) {
        const revealProgress = Math.min(self.progress / revealProgressEnd, 1);
        const target = Math.min(stories.length, Math.ceil(revealProgress * stories.length));

        if (target !== visibleCountRef.current) {
          visibleCountRef.current = target;
          setVisibleCount(target);
        }

        const fadeProgress = Math.max(0, (self.progress - revealProgressEnd) / (1 - revealProgressEnd));
        const nextOpacity = 1 - fadeProgress;

        if (Math.abs(nextOpacity - overlayOpacityRef.current) > 0.01) {
          overlayOpacityRef.current = nextOpacity;
          setOverlayOpacity(nextOpacity);
        }
      },
    });

    // Refresh to account for the hero pin having already set positions
    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 60, opacity: overlayOpacity }}
      aria-hidden="true"
    >
      {stories.slice(0, visibleCount).map((story, i) => {
        const pos = positions[i];
        const paper = papers[pos.paper];
        const cardStyle = {
          background: paper.bg,
          color: paper.ink,
          clipPath: paper.shape,
          borderRadius: paper.radius,
          padding: paper.padding,
          minHeight: paper.minHeight,
          boxShadow: paper.shadow,
          '--card-source-color': paper.muted,
          '--card-rule-color': paper.rule,
          '--card-title-color': paper.ink,
          '--card-tag-color': paper.tag,
          '--card-body-color': paper.body,
        } as CSSProperties & Record<string, string>;

        return (
          <div
            key={story.id}
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              width: `clamp(144px, ${Math.round(pos.width / 12)}vw, ${pos.width}px)`,
              transform: `rotate(${pos.rotate}deg)`,
              zIndex: pos.zIndex,
            }}
          >
            <div className="newspaper-card" style={cardStyle}>
              <p className="card-source">{story.source}</p>
              <h3 className="card-title">{story.title}</h3>
              <span className="card-tag">{story.tag}</span>
              <p className="card-body">{story.body}</p>
            </div>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
