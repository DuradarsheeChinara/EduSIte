import type { World, SubjectId } from '@/types';
import { ChemicalDetective } from '@/worlds/ChemicalDetective';
import { BioDetective } from '@/worlds/BioDetective';
import { CircuitRescue } from '@/worlds/CircuitRescue';
import { MathsExplorer } from '@/worlds/MathsExplorer';
import { TechWorkshop } from '@/worlds/TechWorkshop';
import { EngineeringHub } from '@/worlds/EngineeringHub';
import { DataCodeLab } from '@/worlds/DataCodeLab';

interface MissionViewProps {
  world: World;
  onComplete: (score: number, concepts: string[]) => void;
  onExit: () => void;
}

const WORLD_COMPONENTS: Record<SubjectId, React.ComponentType<{ world: World; onComplete: (score: number) => void; onExit: () => void }>> = {
  chemistry: ChemicalDetective,
  biology: BioDetective,
  physics: CircuitRescue,
  mathematics: MathsExplorer,
  technology: TechWorkshop,
  engineering: EngineeringHub,
  coding: DataCodeLab,
};

export function MissionView({ world, onComplete, onExit }: MissionViewProps) {
  const GameComponent = WORLD_COMPONENTS[world.id];

  if (!GameComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="text-center">
          <p className="text-lg font-bold text-stone-700">This world is coming soon!</p>
          <button onClick={onExit} className="mt-4 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl">
            Back to Map
          </button>
        </div>
      </div>
    );
  }

  return <GameComponent world={world} onComplete={(score) => onComplete(score, world.recap)} onExit={onExit} />;
}
