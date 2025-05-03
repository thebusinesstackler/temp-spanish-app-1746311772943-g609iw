
import { Button } from "@/components/ui/button";

interface StudyControlsProps {
  cardCount: number;
  currentCardIndex: number;
  correctCount: number;
  incorrectCount: number;
  onReset: () => void;
}

const StudyControls = ({
  cardCount,
  currentCardIndex,
  correctCount,
  incorrectCount,
  onReset,
}: StudyControlsProps) => {
  const progress = cardCount > 0 ? ((currentCardIndex) / cardCount) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-500">
          Card {currentCardIndex + 1} of {cardCount}
        </span>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-spanish-red"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-sm">Correct: {correctCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-sm">Incorrect: {incorrectCount}</span>
        </div>
      </div>
    </div>
  );
};

export default StudyControls;
