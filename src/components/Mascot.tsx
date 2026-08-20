import type { SubjectId } from '@/types';
import moruMayurImage from '../../Core character assets/character_moru_mayur.png';
import gyaanGajImage from '../../Core character assets/character_gyaan_gaj.png';
import tinkaTotaImage from '../../Core character assets/character_tinku_tota.png';
import mistriGendaImage from '../../Core character assets/character_bablu_buffallo.png';
import gintiGilahariImage from '../../Core character assets/character_ginti_gilhari.png';
import jugnuByteImage from '../../Core character assets/character_jugnu_byte.png';
import bholuDonkeyImage from '../../Core character assets/character_bholu_the_donkey.png';

const MASCOT_IMAGES: Partial<Record<SubjectId, string>> = {
  biology: moruMayurImage,
  chemistry: gyaanGajImage,
  technology: tinkaTotaImage,
  engineering: mistriGendaImage,
  mathematics: gintiGilahariImage,
  coding: jugnuByteImage,
  physics: bholuDonkeyImage,
};

interface MascotProps {
  subject: SubjectId;
  className?: string;
  size?: number;
}

export function Mascot({ subject, className = '', size = 120 }: MascotProps) {
  const props = { width: size, height: size, className, viewBox: '0 0 200 200', xmlns: 'http://www.w3.org/2000/svg' };
  const image = MASCOT_IMAGES[subject];

  if (image) {
    return <img src={image} alt="" width={size} height={size} className={`${className} object-contain`} />;
  }

  switch (subject) {
    case 'biology':
      return <PeacockMascot {...props} />;
    case 'chemistry':
      return <ElephantMascot {...props} />;
    case 'technology':
      return <ParrotMascot {...props} />;
    case 'engineering':
      return <RhinoMascot {...props} />;
    case 'mathematics':
      return <SquirrelMascot {...props} />;
    case 'coding':
      return <BeeMascot {...props} />;
    case 'physics':
      return <DonkeyMascot {...props} />;
  }
}

type SVGProps = {
  width: number;
  height: number;
  className?: string;
  viewBox: string;
  xmlns: string;
};

function PeacockMascot(props: SVGProps) {
  return (
    <svg {...props} role="img" aria-label="Mayur the Peacock mascot">
      {/* Fan tail */}
      <g>
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + Math.cos(rad) * 30;
          const y1 = 100 + Math.sin(rad) * 30;
          const x2 = 100 + Math.cos(rad) * 75;
          const y2 = 100 + Math.sin(rad) * 75;
          return (
            <g key={angle}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#15803D" strokeWidth="2" />
              <circle cx={x2} cy={y2} r="8" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
              <circle cx={x2} cy={y2} r="4" fill="#0D9488" />
              <circle cx={x2} cy={y2} r="2" fill="#0F766E" />
            </g>
          );
        })}
      </g>
      {/* Body */}
      <ellipse cx="100" cy="120" rx="22" ry="28" fill="#16A34A" stroke="#15803D" strokeWidth="2" />
      {/* Head */}
      <circle cx="100" cy="85" r="16" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
      {/* Eyes */}
      <circle cx="94" cy="82" r="3" fill="#1A1A1A" />
      <circle cx="106" cy="82" r="3" fill="#1A1A1A" />
      <circle cx="95" cy="81" r="1" fill="#FFF" />
      <circle cx="107" cy="81" r="1" fill="#FFF" />
      {/* Beak */}
      <path d="M 100 88 L 96 95 L 104 95 Z" fill="#F97316" stroke="#EA580C" strokeWidth="1" />
      {/* Crown crest */}
      <g>
        <line x1="100" y1="69" x2="100" y2="60" stroke="#15803D" strokeWidth="1.5" />
        <circle cx="100" cy="58" r="3" fill="#0D9488" />
      </g>
      {/* Folk-art dots */}
      <circle cx="88" cy="115" r="2" fill="#F97316" />
      <circle cx="112" cy="115" r="2" fill="#F97316" />
      <circle cx="100" cy="130" r="2" fill="#F97316" />
    </svg>
  );
}

function ElephantMascot(props: SVGProps) {
  return (
    <svg {...props} role="img" aria-label="Gaj the Elephant mascot">
      {/* Body */}
      <ellipse cx="100" cy="115" rx="38" ry="30" fill="#E0C98A" stroke="#9A3412" strokeWidth="2" />
      {/* Head */}
      <circle cx="100" cy="75" r="28" fill="#EDDDB3" stroke="#9A3412" strokeWidth="2" />
      {/* Ears */}
      <ellipse cx="72" cy="72" rx="14" ry="20" fill="#E0C98A" stroke="#9A3412" strokeWidth="2" />
      <ellipse cx="128" cy="72" rx="14" ry="20" fill="#E0C98A" stroke="#9A3412" strokeWidth="2" />
      {/* Eyes */}
      <circle cx="90" cy="70" r="4" fill="#1A1A1A" />
      <circle cx="110" cy="70" r="4" fill="#1A1A1A" />
      <circle cx="91" cy="69" r="1.5" fill="#FFF" />
      <circle cx="111" cy="69" r="1.5" fill="#FFF" />
      {/* Trunk */}
      <path d="M 100 85 Q 95 100 90 110 Q 88 118 92 120 Q 96 118 98 112 Q 100 108 100 100"
        fill="none" stroke="#9A3412" strokeWidth="6" strokeLinecap="round" />
      {/* Tusks */}
      <path d="M 88 88 L 82 98" stroke="#FFFCF5" strokeWidth="3" strokeLinecap="round" />
      <path d="M 112 88 L 118 98" stroke="#FFFCF5" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <rect x="78" y="135" width="10" height="20" rx="3" fill="#D4B565" stroke="#9A3412" strokeWidth="1.5" />
      <rect x="95" y="138" width="10" height="20" rx="3" fill="#D4B565" stroke="#9A3412" strokeWidth="1.5" />
      <rect x="112" y="135" width="10" height="20" rx="3" fill="#D4B565" stroke="#9A3412" strokeWidth="1.5" />
      {/* Forehead decoration */}
      <circle cx="100" cy="60" r="3" fill="#CC5238" />
      <path d="M 92 58 Q 100 52 108 58" fill="none" stroke="#CC5238" strokeWidth="1.5" />
      {/* Folk dots */}
      <circle cx="85" cy="105" r="2" fill="#CC5238" />
      <circle cx="115" cy="105" r="2" fill="#CC5238" />
      <circle cx="100" cy="120" r="2" fill="#CC5238" />
    </svg>
  );
}

function DonkeyMascot(props: SVGProps) {
  return (
    <svg {...props} role="img" aria-label="Gadha the Donkey mascot">
      {/* Body */}
      <ellipse cx="100" cy="120" rx="35" ry="25" fill="#D4B565" stroke="#8B6914" strokeWidth="2" />
      {/* Head */}
      <ellipse cx="100" cy="80" rx="22" ry="25" fill="#E0C98A" stroke="#8B6914" strokeWidth="2" />
      {/* Ears (long donkey ears) */}
      <path d="M 82 62 L 76 35 L 88 55 Z" fill="#D4B565" stroke="#8B6914" strokeWidth="2" />
      <path d="M 118 62 L 124 35 L 112 55 Z" fill="#D4B565" stroke="#8B6914" strokeWidth="2" />
      <path d="M 82 60 L 78 42 L 86 55 Z" fill="#E0C98A" />
      <path d="M 118 60 L 122 42 L 114 55 Z" fill="#E0C98A" />
      {/* Eyes */}
      <circle cx="92" cy="78" r="4" fill="#1A1A1A" />
      <circle cx="108" cy="78" r="4" fill="#1A1A1A" />
      <circle cx="93" cy="77" r="1.5" fill="#FFF" />
      <circle cx="109" cy="77" r="1.5" fill="#FFF" />
      {/* Muzzle */}
      <ellipse cx="100" cy="95" rx="12" ry="8" fill="#EDDDB3" stroke="#8B6914" strokeWidth="1.5" />
      {/* Nostrils */}
      <circle cx="96" cy="93" r="1.5" fill="#5A3E1A" />
      <circle cx="104" cy="93" r="1.5" fill="#5A3E1A" />
      {/* Mouth */}
      <path d="M 94 98 Q 100 100 106 98" fill="none" stroke="#8B6914" strokeWidth="1.5" />
      {/* Legs */}
      <rect x="78" y="138" width="8" height="20" rx="2" fill="#D4B565" stroke="#8B6914" strokeWidth="1.5" />
      <rect x="114" y="138" width="8" height="20" rx="2" fill="#D4B565" stroke="#8B6914" strokeWidth="1.5" />
      {/* Tail */}
      <path d="M 135 115 Q 145 120 142 135" fill="none" stroke="#8B6914" strokeWidth="3" strokeLinecap="round" />
      {/* Dorsal stripe */}
      <path d="M 100 95 Q 100 110 100 135" fill="none" stroke="#8B6914" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Folk dots */}
      <circle cx="88" cy="110" r="2" fill="#CC5238" />
      <circle cx="112" cy="110" r="2" fill="#CC5238" />
    </svg>
  );
}

function ParrotMascot(props: SVGProps) {
  return (
    <svg {...props} role="img" aria-label="Tota the Parrot mascot">
      {/* Tail feathers */}
      <path d="M 100 130 L 85 165 L 95 155 L 100 170 L 105 155 L 115 165 Z" fill="#16A34A" stroke="#15803D" strokeWidth="1.5" />
      {/* Body */}
      <ellipse cx="100" cy="110" rx="28" ry="32" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
      {/* Wing */}
      <path d="M 75 95 Q 60 110 70 130 Q 80 125 85 115 Z" fill="#16A34A" stroke="#15803D" strokeWidth="2" />
      <path d="M 72 100 Q 68 115 75 125" fill="none" stroke="#15803D" strokeWidth="1" />
      {/* Head */}
      <circle cx="100" cy="72" r="20" fill="#4ADE80" stroke="#15803D" strokeWidth="2" />
      {/* Beak (parrot curved beak) */}
      <path d="M 115 72 Q 130 75 125 88 Q 118 85 115 80 Z" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />
      {/* Eye */}
      <circle cx="108" cy="66" r="5" fill="#FFF" stroke="#15803D" strokeWidth="1" />
      <circle cx="109" cy="67" r="3" fill="#1A1A1A" />
      <circle cx="110" cy="66" r="1" fill="#FFF" />
      {/* Head crest */}
      <path d="M 88 55 Q 92 48 95 55" fill="#16A34A" stroke="#15803D" strokeWidth="1.5" />
      {/* Feet */}
      <line x1="92" y1="140" x2="88" y2="150" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
      <line x1="108" y1="140" x2="112" y2="150" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
      {/* Folk dots */}
      <circle cx="90" cy="105" r="2" fill="#F97316" />
      <circle cx="110" cy="115" r="2" fill="#F97316" />
      <circle cx="100" cy="125" r="2" fill="#F97316" />
    </svg>
  );
}

function RhinoMascot(props: SVGProps) {
  return (
    <svg {...props} role="img" aria-label="Gainda the Rhino mascot">
      {/* Body */}
      <ellipse cx="105" cy="120" rx="40" ry="30" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2" />
      {/* Head */}
      <ellipse cx="75" cy="90" rx="25" ry="22" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2" />
      {/* Horn */}
      <path d="M 62 72 L 55 55 L 68 70 Z" fill="#6B7280" stroke="#4B5563" strokeWidth="1.5" />
      <path d="M 68 75 L 62 58 L 74 72 Z" fill="#9CA3AF" stroke="#4B5563" strokeWidth="1" />
      {/* Ears */}
      <ellipse cx="68" cy="72" rx="5" ry="8" fill="#6B7280" stroke="#4B5563" strokeWidth="1.5" transform="rotate(-20 68 72)" />
      <ellipse cx="82" cy="70" rx="5" ry="8" fill="#6B7280" stroke="#4B5563" strokeWidth="1.5" transform="rotate(15 82 70)" />
      {/* Eye */}
      <circle cx="78" cy="88" r="4" fill="#1A1A1A" />
      <circle cx="79" cy="87" r="1.5" fill="#FFF" />
      {/* Mouth */}
      <path d="M 58 98 Q 65 102 72 98" fill="none" stroke="#4B5563" strokeWidth="1.5" />
      {/* Legs */}
      <rect x="85" y="142" width="10" height="20" rx="3" fill="#6B7280" stroke="#4B5563" strokeWidth="1.5" />
      <rect x="105" y="142" width="10" height="20" rx="3" fill="#6B7280" stroke="#4B5563" strokeWidth="1.5" />
      <rect x="125" y="142" width="10" height="20" rx="3" fill="#6B7280" stroke="#4B5563" strokeWidth="1.5" />
      {/* Tail */}
      <path d="M 145 115 Q 155 110 150 125" fill="none" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
      {/* Folk dots */}
      <circle cx="95" cy="110" r="2" fill="#CC5238" />
      <circle cx="115" cy="115" r="2" fill="#CC5238" />
      <circle cx="105" cy="130" r="2" fill="#CC5238" />
      {/* Fold lines on body */}
      <path d="M 90 100 Q 100 105 110 100" fill="none" stroke="#6B7280" strokeWidth="1" />
    </svg>
  );
}

function SquirrelMascot(props: SVGProps) {
  return (
    <svg {...props} role="img" aria-label="Gilehri the Squirrel mascot">
      {/* Big bushy tail */}
      <path d="M 120 100 Q 155 70 150 40 Q 135 35 130 55 Q 125 75 115 90 Z"
        fill="#CC5238" stroke="#8F2F1F" strokeWidth="2" />
      <path d="M 125 95 Q 145 75 140 50" fill="none" stroke="#8F2F1F" strokeWidth="1" strokeDasharray="3 3" />
      {/* Body */}
      <ellipse cx="90" cy="115" rx="25" ry="28" fill="#E0745C" stroke="#8F2F1F" strokeWidth="2" />
      {/* Belly (lighter) */}
      <ellipse cx="90" cy="120" rx="14" ry="18" fill="#FAE5DC" />
      {/* Head */}
      <circle cx="80" cy="80" r="20" fill="#E0745C" stroke="#8F2F1F" strokeWidth="2" />
      {/* Ears */}
      <path d="M 68 65 L 63 50 L 73 58 Z" fill="#CC5238" stroke="#8F2F1F" strokeWidth="1.5" />
      <path d="M 88 65 L 93 50 L 83 58 Z" fill="#CC5238" stroke="#8F2F1F" strokeWidth="1.5" />
      {/* Eyes */}
      <circle cx="73" cy="78" r="4" fill="#1A1A1A" />
      <circle cx="87" cy="78" r="4" fill="#1A1A1A" />
      <circle cx="74" cy="77" r="1.5" fill="#FFF" />
      <circle cx="88" cy="77" r="1.5" fill="#FFF" />
      {/* Nose */}
      <circle cx="80" cy="86" r="2" fill="#5A1A0A" />
      {/* Mouth */}
      <path d="M 76 92 Q 80 95 84 92" fill="none" stroke="#8F2F1F" strokeWidth="1.5" />
      {/* Feet */}
      <ellipse cx="78" cy="145" rx="6" ry="4" fill="#CC5238" stroke="#8F2F1F" strokeWidth="1.5" />
      <ellipse cx="100" cy="145" rx="6" ry="4" fill="#CC5238" stroke="#8F2F1F" strokeWidth="1.5" />
      {/* Acorn in hand */}
      <ellipse cx="65" cy="110" rx="6" ry="8" fill="#D4B565" stroke="#8B6914" strokeWidth="1.5" />
      <path d="M 59 106 Q 65 102 71 106" fill="#8B6914" />
      {/* Folk dots */}
      <circle cx="90" cy="105" r="2" fill="#F97316" />
      <circle cx="100" cy="120" r="2" fill="#F97316" />
    </svg>
  );
}

function BeeMascot(props: SVGProps) {
  return (
    <svg {...props} role="img" aria-label="Madhu the Bee mascot">
      {/* Wings */}
      <ellipse cx="80" cy="70" rx="22" ry="14" fill="#FFFCF5" stroke="#F97316" strokeWidth="2" opacity="0.8" transform="rotate(-25 80 70)" />
      <ellipse cx="120" cy="70" rx="22" ry="14" fill="#FFFCF5" stroke="#F97316" strokeWidth="2" opacity="0.8" transform="rotate(25 120 70)" />
      <ellipse cx="85" cy="72" rx="16" ry="10" fill="#FED7AA" opacity="0.5" transform="rotate(-25 85 72)" />
      <ellipse cx="115" cy="72" rx="16" ry="10" fill="#FED7AA" opacity="0.5" transform="rotate(25 115 72)" />
      {/* Body */}
      <ellipse cx="100" cy="110" rx="28" ry="32" fill="#F97316" stroke="#EA580C" strokeWidth="2" />
      {/* Stripes */}
      <path d="M 72 95 Q 100 90 128 95" fill="none" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" />
      <path d="M 72 110 Q 100 105 128 110" fill="none" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" />
      <path d="M 74 125 Q 100 120 126 125" fill="none" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" />
      {/* Head */}
      <circle cx="100" cy="75" r="18" fill="#FB923C" stroke="#EA580C" strokeWidth="2" />
      {/* Eyes */}
      <circle cx="93" cy="73" r="3.5" fill="#1A1A1A" />
      <circle cx="107" cy="73" r="3.5" fill="#1A1A1A" />
      <circle cx="94" cy="72" r="1.2" fill="#FFF" />
      <circle cx="108" cy="72" r="1.2" fill="#FFF" />
      {/* Antennae */}
      <line x1="92" y1="58" x2="86" y2="42" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <line x1="108" y1="58" x2="114" y2="42" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      <circle cx="86" cy="40" r="3" fill="#1A1A1A" />
      <circle cx="114" cy="40" r="3" fill="#1A1A1A" />
      {/* Smile */}
      <path d="M 94 82 Q 100 86 106 82" fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
      {/* Stinger */}
      <path d="M 100 142 L 100 152" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      {/* Folk dots on wings */}
      <circle cx="75" cy="68" r="2" fill="#F97316" />
      <circle cx="125" cy="68" r="2" fill="#F97316" />
    </svg>
  );
}
