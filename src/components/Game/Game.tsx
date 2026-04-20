import { useState, useEffect } from "react";
import { Card } from "../Card/Card";
import { Column } from "../Column/Column";
import "./Game.css";

export interface ICard {
  name: string;
}

const wasteDeck: ICard[] = [{ name: "card1" }, { name: "card2" }, { name: "card3" }];

export const Game = () => {
  const [elements, setElements] = useState<ICard[]>([]);
  const [columns, setColumns] = useState<ICard[][]>([[], [], [], [], [], [], []]);

  const onDropCard = (card: ICard, columnIndex: number) => {
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

  useEffect(() => {
    setElements(wasteDeck);
  }, []);

  return (
    <div className="game-wrapper">
      <div className="game">
        <div className="game__top">
          <div className="game__deck">
            <div className="game__stock"></div>
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
