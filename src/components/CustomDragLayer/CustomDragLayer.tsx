import { useDragLayer } from "react-dnd";
import type { TCard } from "../../helper";
import { suitSymbols } from "../../helper";
import "./CustomDragLayer.css";

type ColumnDragItem = {
  card: TCard;
  cardIndex: number;
  cardColumnIndex: number;
  movingCards: TCard[];
};

export const CustomDragLayer = () => {
  const { item, isDragging, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem() as ColumnDragItem | null,
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || !currentOffset || !item?.movingCards) {
    return null;
  }

  return (
    <div className="custom-drag-layer">
      <div
        className="custom-drag-layer__cards"
        style={{
          transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
        }}
      >
        {item.movingCards.map((card, index) => (
          <div
            key={card.id}
            className={`card column-card card-${card.suit}`}
            style={{
              top: `${index * 38}px`,
            }}
          >
            <span>{card.rank}</span>
            <span>{suitSymbols[card.suit]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
