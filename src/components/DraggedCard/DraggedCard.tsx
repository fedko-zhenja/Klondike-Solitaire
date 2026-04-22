// import type { ICard } from "../Game/Game";
import type { TCard } from "../../helper";
import { suitSymbols } from "../../helper";

import "./DraggedCard.css";

interface DraggedCardProps {
  card: TCard;
  index: number;
}

// export const DraggedCard = ({ card, index }: DraggedCardProps) => {
//   if (!card.isFaceUp) {
//     return (
//       <div className={`card column-card card-back ${index === 0 ? "first-card" : ""}`} style={{ top: (index + 1) * 20 }}>
//         {/* рубашка */}
//       </div>
//     );
//   }

//   return (
//     <div className={`card column-card card-${card.suit} card-face ${index === 0 ? "first-card" : ""}`} style={{ top: (index + 1) * 20 }}>
//       <span>{card.rank}</span>
//       <span>{suitSymbols[card.suit]}</span>
//     </div>
//   );
// };

export const DraggedCard = ({ card, index }: DraggedCardProps) => {
  if (!card.isFaceUp) {
    return (
      <div className="card column-card card-back" style={{ top: index * 20 }}>
        {/* рубашка */}
      </div>
    );
  }

  return (
    <div className={`card column-card card-${card.suit}`} style={{ top: index * 20 }}>
      <span>{card.rank}</span>
      <span>{suitSymbols[card.suit]}</span>
    </div>
  );
};
