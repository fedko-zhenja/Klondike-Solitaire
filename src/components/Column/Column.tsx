import { useDrop } from "react-dnd";
import { DraggedCard } from "../DraggedCard/DraggedCard";
import type { ICard } from "../Game/Game";
import type { TCard } from "../../helper";
import "./Column.css";

interface ColumnProps {
  columnIndex: number;
  cards: TCard[];
  onDropCard: (card: ICard, columnIndex: number) => void;
}

export const Column = ({ columnIndex, cards, onDropCard }: ColumnProps) => {
  const [{ isDragging }, dropRef] = useDrop(() => ({
    accept: "card",
    drop: (card: ICard) => {
      onDropCard(card, columnIndex);
    },
    collect: (monitor) => ({
      isDragging: monitor.isOver(),
    }),
  }));

  // console.log("Column", cards);

  return (
    <div className={isDragging ? "game__column dragging" : "game__column"} ref={dropRef as unknown as React.Ref<HTMLDivElement>}>
      {cards.map((card, index) => (
        <DraggedCard key={card.id} card={card} index={index} />
      ))}
    </div>
  );
};
