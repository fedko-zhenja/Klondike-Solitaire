// import type { ICard } from "../Game/Game";
import type { TCard } from "../../helper";
import { suitSymbols } from "../../helper";
import { useDrag } from "react-dnd";
import "./WasteCard.css";

interface WasteCardProps {
  card: TCard;
}

export const WasteCard = ({ card }: WasteCardProps) => {
  const [{ isDragStart }, dragRef] = useDrag({
    type: "waste-card",
    item: { type: "waste-card", card },
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
