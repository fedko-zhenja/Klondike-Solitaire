import type { TCard } from "../../helper";
import "./StockCard.css";

interface StockCardProps {
  card: TCard;
  index: number;
  stockCardClick: (value: TCard) => void;
}

export const StockCard = ({ card, index, stockCardClick }: StockCardProps) => {
  const handleClick = () => {
    stockCardClick(card);
  };

  //   console.log("StockCard", card);

  return <div className="card-stock card-stock_back" onClick={handleClick}></div>;
};
