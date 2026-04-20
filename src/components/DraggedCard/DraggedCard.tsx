import type { ICard } from "../Game/Game";

interface DraggedCardProps {
  data: ICard;
}

export const DraggedCard = ({ data }: DraggedCardProps) => {
  const onDragStart = () => {
    // onDrag({ name });
  };

  return (
    <div className="card" draggable onDragStart={onDragStart}>
      {data.name}
    </div>
  );
};
