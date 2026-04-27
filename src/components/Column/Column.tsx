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
}

export const Column = ({ columnIndex, cards, onDropCardFromWasteToColumn, canMoveCardToColumn }: ColumnProps) => {
  const [{ isDragging }, dropRef] = useDrop(
    () => ({
      accept: "waste-card",
      canDrop: (card: TCard) => {
        return canMoveCardToColumn(card, columnIndex);
      },
      drop: (card: TCard) => {
        onDropCardFromWasteToColumn(card, columnIndex); //нужно чтоб дроп был именно на нижнюю карту
      },
      collect: (monitor) => ({
        isDragging: monitor.isOver(),
      }),
    }),
    [columnIndex, cards, canMoveCardToColumn, onDropCardFromWasteToColumn],
  );

  // console.log("Column", cards);

  return (
    <div className={isDragging ? "game__column dragging" : "game__column"} ref={dropRef as unknown as React.Ref<HTMLDivElement>}>
      {cards.map((card, index) => (
        <DraggedCard key={card.id} card={card} index={index} />
      ))}
    </div>
  );
};
