import type { TCard } from "../../helper";
import { suitSymbols } from "../../helper";
import { useDrag } from "react-dnd";
import "./ColumnCard.css";

interface ColumnCardProps {
  card: TCard;
  cards: TCard[];
  columnIndex: number;
  index: number;
}

export const ColumnCard = ({ card, cards, columnIndex, index }: ColumnCardProps) => {
  const [{ isDragStart }, dragRef] = useDrag(
    {
      type: "column-card",
      item: { type: "column-card", card, cardIndex: index, cardColumnIndex: columnIndex, movingCards: cards.slice(index) },
      canDrag: () => card.isFaceUp,
      collect: (monitor) => ({
        isDragStart: monitor.isDragging(),
      }),
    },
    [card, index, columnIndex, cards],
  );

  if (!card.isFaceUp) {
    return (
      <div className="card column-card card-back" style={{ top: index * 38 }} ref={dragRef as unknown as React.Ref<HTMLDivElement>}>
        {/* рубашка */}
      </div>
    );
  }

  return (
    <div className={`card column-card card-${card.suit}`} style={{ top: index * 38, opacity: isDragStart ? 0 : 1 }} ref={dragRef as unknown as React.Ref<HTMLDivElement>}>
      <span>{card.rank}</span>
      <span>{suitSymbols[card.suit]}</span>
    </div>
  );
};
