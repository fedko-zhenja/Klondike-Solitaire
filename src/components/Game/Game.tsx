import { useState, useEffect, useCallback } from "react";
// import { Card } from "../Card/Card";
import { Column } from "../Column/Column";
import { StockCard } from "../StockCard/StockCard";
import { WasteCard } from "../WasteCard/WasteCard";
import { createDeck, shuffleDeck, fillColumnsWithCards, getCardSuitColor, getCardRankValue, openCard } from "../../helper";
import type { TCard } from "../../helper";
import "./Game.css";

export interface ICard {
  name: string;
}

export const Game = () => {
  const [wasteDeck, setWasteDeck] = useState<TCard[]>([]);
  const [stockDeck, setStockDeck] = useState<TCard[]>([]);
  const [columns, setColumns] = useState<TCard[][]>([[], [], [], [], [], [], []]);

  const stockCardClick = (card: TCard) => {
    if (stockDeck.length === 0) {
      return;
    }

    const lastCard = stockDeck[stockDeck.length - 1]; // или card из аргумента ?

    // const openedCard = {
    //   ...lastCard,
    //   isFaceUp: true,
    // };

    const openedCard = openCard(lastCard); //проверить правильно ли работает

    // console.log("openedCard", openedCard);

    setWasteDeck((prev) => [...prev, openedCard]);
    setStockDeck((prev) => prev.slice(0, prev.length - 1));
  };

  const handleRestartStockDeck = () => {
    const closedCards = [...wasteDeck].reverse().map((card) => ({
      ...card,
      isFaceUp: false,
    }));

    setStockDeck(closedCards);
    setWasteDeck([]);
  };

  useEffect(() => {
    console.log("wasteDeck", wasteDeck);
    console.log("stockDeck", stockDeck);
    console.log("columns", columns);
  }, [wasteDeck, stockDeck, columns]);

  const onDropCardFromWasteToColumn = (card: TCard, columnIndex: number) => {
    setWasteDeck((prev) => prev.filter((item) => item.id !== card.id));

    setColumns((prev) =>
      prev.map((column, index) => {
        if (index === columnIndex) {
          return [...column, card];
        }

        return column;
      }),
    );
  };

  const canMoveCardToColumn = useCallback(
    (card: TCard, columnIndex: number) => {
      console.log("canMoveCardToColumn");

      const lastCardInColumn = columns[columnIndex][columns[columnIndex].length - 1];

      if (!lastCardInColumn) {
        return card.rank === "K";
      }

      if (getCardSuitColor(card.suit) === getCardSuitColor(lastCardInColumn.suit)) {
        return false;
      }

      if (getCardRankValue(card.rank) !== getCardRankValue(lastCardInColumn.rank) - 1) {
        return false;
      }

      return true;
    },
    [columns],
  );

  const onDropCardFromColumnToOtherColumn = (card: TCard, cardColumnIndex: number, columnIndex: number) => {
    console.log("onDropCardFromColumnToOtherColumn", card, cardColumnIndex, columnIndex);

    setColumns((prev) =>
      prev.map((column, index) => {
        if (index === cardColumnIndex) {
          const newColumn = column.filter((item) => item.id !== card.id);
          if (newColumn.length === 0) return newColumn;

          const lastIndex = newColumn.length - 1;

          const updatedLastCard = openCard(newColumn[lastIndex]);

          return [...newColumn.slice(0, lastIndex), updatedLastCard];
        } else if (index === columnIndex) {
          return [...column, card];
        }
        return column;
      }),
    );
  };

  useEffect(() => {
    // setElements(startDeck);
    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck); //добавить в стейт?

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
              {stockDeck.map((card) => (
                <StockCard key={card.id} card={card} stockCardClick={stockCardClick} />
              ))}

              {stockDeck.length ? (
                ""
              ) : (
                <div className="game__stock_restart-btn" onClick={handleRestartStockDeck}>
                  ↻
                </div>
              )}
            </div>

            <div className="game__waste">
              {wasteDeck.map((card) => (
                <WasteCard key={card.id} card={card} />
              ))}
              {/* {elements.map((data, index) => (
                <Card key={index} data={data} />
              ))} */}
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
              <Column key={index} columnIndex={index} cards={column} onDropCardFromWasteToColumn={onDropCardFromWasteToColumn} canMoveCardToColumn={canMoveCardToColumn} onDropCardFromColumnToOtherColumn={onDropCardFromColumnToOtherColumn} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
