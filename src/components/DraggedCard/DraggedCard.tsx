// import type { ICard } from "../Game/Game";
import type { TCard } from "../../helper";
import { suitSymbols } from "../../helper";
import { useDrag } from "react-dnd";
import "./DraggedCard.css";

interface DraggedCardProps {
  card: TCard;
  columnIndex: number;
  index: number;
}

export const DraggedCard = ({ card, columnIndex, index }: DraggedCardProps) => {
  const [{ isDragStart }, dragRef] = useDrag({
    type: "column-card",
    item: { type: "column-card", card, cardColumnIndex: columnIndex },
    collect: (monitor) => ({
      isDragStart: monitor.isDragging(),
    }),
  });

  if (!card.isFaceUp) {
    return (
      <div className={isDragStart ? `card column-card card-back` : `card column-card card-back`} style={{ top: index * 38 }} ref={dragRef as unknown as React.Ref<HTMLDivElement>}>
        {/* рубашка */}
      </div>
    );
  }

  return (
    <div className={isDragStart ? `card column-card card-${card.suit} card-column-dragged` : `card column-card card-${card.suit}`} style={{ top: index * 38 }} ref={dragRef as unknown as React.Ref<HTMLDivElement>}>
      <span>{card.rank}</span>
      <span>{suitSymbols[card.suit]}</span>
    </div>
  );
};
