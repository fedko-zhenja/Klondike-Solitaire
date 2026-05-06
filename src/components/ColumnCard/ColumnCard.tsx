import type { TCard } from "../../helper";
import { suitSymbols } from "../../helper";
import { useDrag } from "react-dnd";
import "./ColumnCard.css";

interface ColumnCardProps {
  card: TCard;
  cards: TCard[];
  columnIndex: number;
  index: number;
  isHidden: boolean;
  setDraggingCardIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

export const ColumnCard = ({ card, cards, columnIndex, index, isHidden, setDraggingCardIndex }: ColumnCardProps) => {
  const [, dragRef] = useDrag(
    () => ({
      type: "column-card",

      item: () => {
        setDraggingCardIndex(index);

        return {
          type: "column-card",
          card,
          cardIndex: index,
          cardColumnIndex: columnIndex,
          movingCards: cards.slice(index),
        };
      },

      canDrag: () => card.isFaceUp,

      end: () => {
        setDraggingCardIndex(null);
      },
    }),
    [card, index, columnIndex, cards],
  );

  if (!card.isFaceUp) {
    return <div className="card column-card card-back" style={{ top: index * 38 }} />;
  }

  return (
    <div
      className={`card column-card card-${card.suit}`}
      style={{
        top: index * 38,
        opacity: isHidden ? 0 : 1,
      }}
      ref={dragRef as unknown as React.Ref<HTMLDivElement>}
    >
      <span>{card.rank}</span>
      <span>{suitSymbols[card.suit]}</span>
    </div>
  );
};
