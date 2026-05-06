/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { Column } from "../Column/Column";
import { StockCard } from "../StockCard/StockCard";
import { WasteCard } from "../WasteCard/WasteCard";
import { FoundationsColumns } from "../FoundationsColumns/FoundationsColumns";
import { CustomDragLayer } from "../CustomDragLayer/CustomDragLayer";
import { createDeck, shuffleDeck, fillColumnsWithCards, getCardSuitColor, getCardRankValue, openCard, isWin } from "../../helper";
import type { TCard } from "../../helper";
import "./Game.css";

export interface ICard {
  name: string;
}

export const Game = () => {
  const [wasteDeck, setWasteDeck] = useState<TCard[]>([]);
  const [stockDeck, setStockDeck] = useState<TCard[]>([]);
  const [columns, setColumns] = useState<TCard[][]>([[], [], [], [], [], [], []]);
  const [foundationsColumns, setFoundationsColumns] = useState<TCard[][]>([[], [], [], []]);
  const [isGameWon, setIsGameWon] = useState(false);

  const stockCardClick = () => {
    if (stockDeck.length === 0) {
      return;
    }

    const lastCard = stockDeck[stockDeck.length - 1];
    const openedCard = openCard(lastCard);

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
    //вынести в хелпер
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

  const onDropCardFromColumnToOtherColumn = (movingCards: TCard[], cardIndex: number, cardColumnIndex: number, columnIndex: number) => {
    console.log("onDropCardFromColumnToOtherColumn", movingCards, cardIndex, cardColumnIndex, columnIndex);

    setColumns((prev) =>
      prev.map((column, index) => {
        if (index === cardColumnIndex) {
          const newColumn = column.slice(0, cardIndex);
          if (newColumn.length === 0) return newColumn;

          const lastIndex = newColumn.length - 1;

          const updatedLastCard = openCard(newColumn[lastIndex]);

          return [...newColumn.slice(0, lastIndex), updatedLastCard];
        } else if (index === columnIndex) {
          return [...column, ...movingCards];
        }
        return column;
      }),
    );
  };

  const canMoveCardToFoundationColumn = useCallback(
    //вынести в хелпер
    (card: TCard, columnIndex: number) => {
      console.log("canMoveCardToFoundationColumn");

      const lastCardInColumn = foundationsColumns[columnIndex][foundationsColumns[columnIndex].length - 1];

      if (!lastCardInColumn) {
        console.log("First card in foundation column", card.rank);

        return card.rank === "A";
      }

      if (getCardSuitColor(card.suit) !== getCardSuitColor(lastCardInColumn.suit)) {
        return false;
      }

      if (getCardRankValue(card.rank) !== getCardRankValue(lastCardInColumn.rank) + 1) {
        return false;
      }

      return true;
    },
    [foundationsColumns],
  );

  const onDropCardFromWasteToFoundationColumn = (card: TCard, columnIndex: number) => {
    console.log("onDropCardFromWasteToFoundationColumn");
    setWasteDeck((prev) => prev.filter((item) => item.id !== card.id));

    setFoundationsColumns((prev) =>
      prev.map((column, index) => {
        if (index === columnIndex) {
          return [...column, card];
        } else {
          return column;
        }
      }),
    );
  };

  const onDropCardFromColumnToFoundationColumn = (card: TCard, cardColumnIndex: number, columnIndex: number) => {
    console.log("onDropCardFromColumnToFoundationColumn");
    setColumns((prev) =>
      prev.map((column, index) => {
        if (index === cardColumnIndex) {
          const newColumn = column.filter((item) => item.id !== card.id);
          if (newColumn.length === 0) return newColumn;
          const lastIndex = newColumn.length - 1;
          const updatedLastCard = openCard(newColumn[lastIndex]);
          return [...newColumn.slice(0, lastIndex), updatedLastCard];
        } else {
          return column;
        }
      }),
    );

    // setFoundationsColumns((prev) =>
    //   prev.map((column, index) => {
    //     if (index === columnIndex) {
    //       return [...column, card];
    //     } else {
    //       return column;
    //     }
    //   }),
    // );

    setFoundationsColumns((prev) => {
      const newFoundationsColumns = prev.map((column, index) => {
        if (index === columnIndex) {
          return [...column, card];
        }

        return column;
      });

      if (isWin(newFoundationsColumns)) {
        setIsGameWon(true);
      }

      return newFoundationsColumns;
    });
  };

  const onDropCardFromFoundationColumnToColumn = (card: TCard, cardColumnIndex: number, columnIndex: number) => {
    console.log("onDropCardFromFoundationColumnToColumn");
    setFoundationsColumns((prev) =>
      prev.map((column, index) => {
        if (index === cardColumnIndex) {
          return column.filter((item) => item.id !== card.id);
        } else {
          return column;
        }
      }),
    );

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
    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck); //добавить в стейт?

    const arrayColumnsWithCards = fillColumnsWithCards(shuffledDeck, columns);
    setColumns(arrayColumnsWithCards);

    const arrayStockDeck = shuffledDeck.slice(28, 52);
    setStockDeck(arrayStockDeck);
  }, []);

  return (
    <div className="game-wrapper">
      <div className={isGameWon ? "game-won" : ""}>{isGameWon ? "WIN!" : ""}</div>
      <div className="game">
        <div className="game__top">
          <div className="game__deck">
            <div className="game__stock">
              {stockDeck.map((card) => (
                <StockCard key={card.id} stockCardClick={stockCardClick} />
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
            </div>
          </div>

          <div className="game__foundations">
            {foundationsColumns.map((column, index) => (
              <FoundationsColumns
                key={index}
                columnIndex={index}
                cards={column}
                canMoveCardToFoundationColumn={canMoveCardToFoundationColumn}
                onDropCardFromWasteToFoundationColumn={onDropCardFromWasteToFoundationColumn}
                onDropCardFromColumnToFoundationColumn={onDropCardFromColumnToFoundationColumn}
              />
            ))}
          </div>
        </div>

        <div className="game__bottom">
          <div className="game__tableau">
            {columns.map((column, index) => (
              <Column
                key={index}
                columnIndex={index}
                cards={column}
                onDropCardFromWasteToColumn={onDropCardFromWasteToColumn}
                canMoveCardToColumn={canMoveCardToColumn}
                onDropCardFromColumnToOtherColumn={onDropCardFromColumnToOtherColumn}
                onDropCardFromFoundationColumnToColumn={onDropCardFromFoundationColumnToColumn}
              />
            ))}
          </div>
        </div>
      </div>
      <CustomDragLayer />
    </div>
  );
};
