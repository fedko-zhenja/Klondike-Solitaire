// import type { ICard } from "../Game/Game";
import type { TCard } from "../../helper";
import { suitSymbols } from "../../helper";
import "./WasteCard.css";

interface WasteCardProps {
  card: TCard;
  index: number;
}
export const WasteCard = ({ card, index }: WasteCardProps) => {
  return (
    <div className={`card-waste card-waste_${card.suit}`}>
      <span>{card.rank}</span>
      <span>{suitSymbols[card.suit]}</span>
    </div>
  );
};
