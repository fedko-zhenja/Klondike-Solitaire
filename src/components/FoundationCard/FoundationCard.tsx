import type { TCard } from "../../helper";
import { suitSymbols } from "../../helper";
import { useDrag } from "react-dnd";
import "./FoundationCard.css";

interface FoundationsCardProps {
  card: TCard;
  columnIndex: number;
}

export const FoundationsCard = ({ card, columnIndex }: FoundationsCardProps) => {
  const [{ isDragStart }, dragRef] = useDrag(
    {
      type: "foundation-card",
      item: { type: "foundation-card", card, cardColumnIndex: columnIndex },
      collect: (monitor) => ({
        isDragStart: monitor.isDragging(),
      }),
    },
    [card, columnIndex],
  );

  return (
    <div className={isDragStart ? `card-foundation card-foundation_${card.suit} card-foundation_dragging` : `card-foundation card-foundation_${card.suit}`} ref={dragRef as unknown as React.Ref<HTMLDivElement>}>
      <span>{card.rank}</span>
      <span>{suitSymbols[card.suit]}</span>
    </div>
  );
};
