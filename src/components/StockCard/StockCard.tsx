import type { TCard } from "../../helper";
import "./StockCard.css";

interface StockCardProps {
  card: TCard;
  stockCardClick: (value: TCard) => void;
}

export const StockCard = ({ card, stockCardClick }: StockCardProps) => {
  const handleClick = () => {
    stockCardClick(card);
  };

  //   console.log("StockCard", card);

  return <div className="card-stock card-stock_back" onClick={handleClick}></div>;
};
