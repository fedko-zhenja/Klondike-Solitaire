import { useState, useEffect } from "react";
import { Card } from "../Card/Card";
import { Column } from "../Column/Column";
import { StockCard } from "../StockCard/StockCard";
import { createDeck, shuffleDeck, fillColumnsWithCards } from "../../helper";
import type { TCard } from "../../helper";
import "./Game.css";

export interface ICard {
  name: string;
}

const wasteDeck: ICard[] = [{ name: "card1" }, { name: "card2" }, { name: "card3" }];

export const Game = () => {
  const [elements, setElements] = useState<ICard[]>([]);

  const [stockDeck, setStockDeck] = useState<TCard[]>([]);
  const [columns, setColumns] = useState<TCard[][]>([[], [], [], [], [], [], []]);

  const onDropCard = (card: TCard, columnIndex: number) => {
    setElements((prev) => prev.filter((item) => item.name !== card.name));

    setColumns((prev) =>
      prev.map((column, index) => {
        if (index === columnIndex) {
          return [...column, card];
        }

        return column;
      }),
    );
  };

  // useEffect(() => {
  //   console.log("columns", columns);
  // }, [columns]);

  useEffect(() => {
    setElements(wasteDeck);
    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck);

    const arrayColumnsWithCards = fillColumnsWithCards(shuffledDeck, columns);
    setColumns(arrayColumnsWithCards);

    const arrayStockDeck = shuffledDeck.slice(28, 52);
    setStockDeck(arrayStockDeck);
    // console.log("arrayStockDeck", arrayStockDeck);
  }, []);

  return (
    <div className="game-wrapper">
      <div className="game">
        <div className="game__top">
          <div className="game__deck">
            <div className="game__stock">
              {stockDeck.map((card, index) => (
                <StockCard key={card.id} card={card} index={index} />
              ))}
            </div>
            <div className="game__waste">
              {elements.map((data, index) => (
                <Card key={index} data={data} />
              ))}
            </div>
          </div>

          <div className="game__foundations">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="game__foundation"></div>
            ))}
          </div>
        </div>

        <div className="game__bottom">
          <div className="game__tableau">
            {/* {Array.from({ length: 7 }).map((_, index) => (
              <Column key={index} draggedElements={draggedElements} onDropCard={onDropCard} />
            ))} */}
            {columns.map((column, index) => (
              <Column key={index} columnIndex={index} cards={column} onDropCard={onDropCard} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
