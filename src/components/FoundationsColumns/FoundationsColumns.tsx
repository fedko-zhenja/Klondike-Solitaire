import { useDrop } from "react-dnd";
import type { TCard } from "../../helper";
import { FoundationsCard } from "../FoundationCard/FoundationCard";
import "./FoundationsColumns.css";

interface FoundationsColumnsProps {
  columnIndex: number;
  cards: TCard[];
  canMoveCardToFoundationColumn: (card: TCard, columnIndex: number) => boolean;
  onDropCardFromWasteToFoundationColumn: (card: TCard, columnIndex: number) => void;
  onDropCardFromColumnToFoundationColumn: (card: TCard, cardColumnIndex: number, columnIndex: number) => void;
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

type DragItem = WasteDragItem | ColumnDragItem;

export const FoundationsColumns = ({ columnIndex, cards, canMoveCardToFoundationColumn, onDropCardFromWasteToFoundationColumn, onDropCardFromColumnToFoundationColumn }: FoundationsColumnsProps) => {
  const [{ isDragging }, dropRef] = useDrop(
    () => ({
      accept: ["waste-card", "column-card"],
      canDrop: ({ card }: DragItem) => {
        return canMoveCardToFoundationColumn(card, columnIndex);
      },
      drop: (item: DragItem) => {
        console.log("drop", item);

        if (item.type === "waste-card") {
          console.log("waste-card");
          onDropCardFromWasteToFoundationColumn(item.card, columnIndex); //нужно чтоб дроп был именно на нижнюю карту?
        }

        if (item.type === "column-card") {
          console.log("column-card");
          onDropCardFromColumnToFoundationColumn(item.card, item.cardColumnIndex, columnIndex); //нужно чтоб дроп был именно на нижнюю карту?
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isOver(),
      }),
    }),
    [columnIndex, cards, canMoveCardToFoundationColumn, onDropCardFromWasteToFoundationColumn, onDropCardFromColumnToFoundationColumn],
  );
  return (
    <div className="game__foundation" ref={dropRef as unknown as React.Ref<HTMLDivElement>}>
      {cards.map((card) => (
        <FoundationsCard key={card.id} card={card} columnIndex={columnIndex} />
      ))}
    </div>
  );
};
