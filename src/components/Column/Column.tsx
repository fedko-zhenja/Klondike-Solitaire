import { useDrop } from "react-dnd";
import { DraggedCard } from "../DraggedCard/DraggedCard";
// import type { ICard } from "../Game/Game";
import type { TCard } from "../../helper";
import "./Column.css";

interface ColumnProps {
  columnIndex: number;
  cards: TCard[];
  onDropCardFromWasteToColumn: (card: TCard, columnIndex: number) => void;
  canMoveCardToColumn: (card: TCard, columnIndex: number) => boolean;
  onDropCardFromColumnToOtherColumn: (movingCards: TCard[], cardIndex: number, cardColumnIndex: number, columnIndex: number) => void;
}

// type WasteDragItem = {
//   card: TCard;
// };

// type ColumnDragItem = {
//   card: TCard;
//   cardColumnIndex: number;
// };

// type DragItem = WasteDragItem | ColumnDragItem;

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

type DragItem = WasteDragItem | ColumnDragItem;

export const Column = ({ columnIndex, cards, onDropCardFromWasteToColumn, canMoveCardToColumn, onDropCardFromColumnToOtherColumn }: ColumnProps) => {
  const [{ isDragging }, dropRef] = useDrop(
    () => ({
      // accept: "waste-card",
      accept: ["waste-card", "column-card"],
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
      },
      collect: (monitor) => ({
        isDragging: monitor.isOver(),
      }),
    }),
    [columnIndex, cards, canMoveCardToColumn, onDropCardFromWasteToColumn],
  );

  return (
    <div className={isDragging ? "game__column dragging" : "game__column"} ref={dropRef as unknown as React.Ref<HTMLDivElement>}>
      {cards.map((card, index) => (
        <DraggedCard key={card.id} card={card} cards={cards} columnIndex={columnIndex} index={index} />
      ))}
    </div>
  );
};
