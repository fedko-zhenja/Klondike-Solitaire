import { useDrop } from "react-dnd";
import { DraggedCard } from "../DraggedCard/DraggedCard";
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
  const [{ isDragging }, dropRef] = useDrop(
    () => ({
      accept: ["waste-card", "column-card", "foundation-card"],
      canDrop: ({ card }: DragItem) => {
        return canMoveCardToColumn(card, columnIndex);
      },
      drop: (item: DragItem) => {
        if (item.type === "waste-card") {
          console.log("waste-card");
          onDropCardFromWasteToColumn(item.card, columnIndex); //нужно чтоб дроп был именно на нижнюю карту?
        }

        if (item.type === "column-card") {
          console.log("column-card");
          onDropCardFromColumnToOtherColumn(item.movingCards, item.cardIndex, item.cardColumnIndex, columnIndex); //нужно чтоб дроп был именно на нижнюю карту?
        }

        if (item.type === "foundation-card") {
          console.log("foundation-card");
          // Handle foundation card drop
          onDropCardFromFoundationColumnToColumn(item.card, item.cardColumnIndex, columnIndex);
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isOver(),
      }),
    }),
    [columnIndex, cards, canMoveCardToColumn, onDropCardFromWasteToColumn, onDropCardFromColumnToOtherColumn, onDropCardFromFoundationColumnToColumn],
  );

  return (
    <div className={isDragging ? "game__column dragging" : "game__column"} ref={dropRef as unknown as React.Ref<HTMLDivElement>}>
      {cards.map((card, index) => (
        <DraggedCard key={card.id} card={card} cards={cards} columnIndex={columnIndex} index={index} />
      ))}
    </div>
  );
};
