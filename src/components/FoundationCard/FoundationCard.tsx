import type { TCard } from "../../helper";
import { suitSymbols } from "../../helper";
// import { useDrag } from "react-dnd";
import "./FoundationCard.css";

interface FoundationsCardProps {
  card: TCard;
}

export const FoundationsCard = ({ card }: FoundationsCardProps) => {
  return (
    <div className={`card-foundation card-foundation_${card.suit}`}>
      <span>{card.rank}</span>
      <span>{suitSymbols[card.suit]}</span>
    </div>
  );
};
