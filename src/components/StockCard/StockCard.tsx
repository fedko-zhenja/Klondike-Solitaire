import "./StockCard.css";

interface StockCardProps {
  stockCardClick: () => void;
}

export const StockCard = ({ stockCardClick }: StockCardProps) => {
  const handleClick = () => {
    stockCardClick();
  };

  return <div className="card-stock card-stock_back" onClick={handleClick}></div>;
};
