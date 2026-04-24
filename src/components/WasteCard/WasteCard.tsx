// import type { ICard } from "../Game/Game";
import type { TCard } from "../../helper";
import { suitSymbols } from "../../helper";
import "./WasteCard.css";

import { useDrag } from "react-dnd";

interface WasteCardProps {
  card: TCard;
  index: number;
}
export const WasteCard = ({ card, index }: WasteCardProps) => {
  const [{ isDragStart }, dragRef] = useDrag({
    type: "waste-card",
    item: card,
    collect: (monitor) => ({
      isDragStart: monitor.isDragging(),
    }),
  });

  return (
    <div className={isDragStart ? `card-waste card-waste_${card.suit} card-waste-dragged` : `card-waste card-waste_${card.suit}`} ref={dragRef as unknown as React.Ref<HTMLDivElement>}>
      <span>{card.rank}</span>
      <span>{suitSymbols[card.suit]}</span>
    </div>
  );
};
