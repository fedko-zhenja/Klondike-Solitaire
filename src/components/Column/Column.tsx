import { useDrop } from "react-dnd";
import { useState } from "react";
import { ColumnCard } from "../ColumnCard/ColumnCard";
import type { TCard } from "../../helper";
import "./Column.css";

interface ColumnProps {
  columnIndex: number;
  cards: TCard[];
  onDropCardFromWasteToColumn: (card: TCard, columnIndex: number) => void;
  canMoveCardToColumn: (card: TCard, columnIndex: number) => boolean;
  onDropCardFromColumnToOtherColumn: (movingCards: TCard[], cardIndex: number, cardColumnIndex: number, columnIndex: number) => void;
  onDropCardFromFoundationColumnToColumn: (card: TCard, cardColumnIndex: number, columnIndex: number) => void;
}

type WasteDragItem = {
  type: "waste-card";
  card: TCard;
};

type ColumnDragItem = {
  type: "column-card";
  card: TCard;
  cardIndex: number;
  cardColumnIndex: number;
  movingCards: TCard[];
};

type FoundationDragItem = {
  type: "foundation-card";
  card: TCard;
  cardColumnIndex: number;
};

type DragItem = WasteDragItem | ColumnDragItem | FoundationDragItem;

export const Column = ({ columnIndex, cards, onDropCardFromWasteToColumn, canMoveCardToColumn, onDropCardFromColumnToOtherColumn, onDropCardFromFoundationColumnToColumn }: ColumnProps) => {
  const [draggingCardIndex, setDraggingCardIndex] = useState<number | null>(null);

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: ["waste-card", "column-card", "foundation-card"],

      canDrop: (item: DragItem) => {
        return canMoveCardToColumn(item.card, columnIndex);
      },

      drop: (item: DragItem) => {
        if (item.type === "waste-card") {
          onDropCardFromWasteToColumn(item.card, columnIndex);
        }

        if (item.type === "column-card") {
          onDropCardFromColumnToOtherColumn(item.movingCards, item.cardIndex, item.cardColumnIndex, columnIndex);
        }

        if (item.type === "foundation-card") {
          onDropCardFromFoundationColumnToColumn(item.card, item.cardColumnIndex, columnIndex);
        }
      },

      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [columnIndex, cards, canMoveCardToColumn, onDropCardFromWasteToColumn, onDropCardFromColumnToOtherColumn, onDropCardFromFoundationColumnToColumn],
  );

  return (
    <div className={isOver ? "game__column dragging" : "game__column"} ref={dropRef as unknown as React.Ref<HTMLDivElement>}>
      {cards.map((card, index) => {
        const isHidden = draggingCardIndex !== null && index >= draggingCardIndex;

        return <ColumnCard key={card.id} card={card} cards={cards} columnIndex={columnIndex} index={index} isHidden={isHidden} setDraggingCardIndex={setDraggingCardIndex} />;
      })}
    </div>
  );
};
