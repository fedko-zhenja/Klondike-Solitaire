import { useDrag } from "react-dnd";
import type { ICard } from "../Game/Game";
import "./Card.css";

interface CardProps {
  data: ICard;
}

export const Card = ({ data }: CardProps) => {
  // console.log("cardpropsdata", data);

  const [{ isDragStart }, dragRef] = useDrag({
    type: "card",
    item: data,
    collect: (monitor) => ({
      isDragStart: monitor.isDragging(),
    }),
  });

  return (
    <div className={isDragStart ? "card dragged" : "card"} ref={dragRef as unknown as React.Ref<HTMLDivElement>}>
      {data.name}
    </div>
  );
};
