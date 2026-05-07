/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { Column } from "../Column/Column";
import { StockCard } from "../StockCard/StockCard";
import { WasteCard } from "../WasteCard/WasteCard";
import { FoundationsColumns } from "../FoundationsColumns/FoundationsColumns";
import { CustomDragLayer } from "../CustomDragLayer/CustomDragLayer";
import { createDeck, shuffleDeck, fillColumnsWithCards, openCard, isWin, canMoveCardToColumn, canMoveCardToFoundationColumn } from "../../helper";
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

  const stockCardClick = useCallback(() => {
    if (stockDeck.length === 0) {
      return;
    }

    const lastCard = stockDeck[stockDeck.length - 1];
    const openedCard = openCard(lastCard);

    setWasteDeck((prev) => [...prev, openedCard]);
    setStockDeck((prev) => prev.slice(0, prev.length - 1));
  }, [stockDeck]);

  const handleRestartStockDeck = useCallback(() => {
    const closedCards = [...wasteDeck].reverse().map((card) => ({
      ...card,
      isFaceUp: false,
    }));

    setStockDeck(closedCards);
    setWasteDeck([]);
  }, [wasteDeck]);

  const onDropCardFromWasteToColumn = useCallback((card: TCard, columnIndex: number) => {
    setWasteDeck((prev) => prev.filter((item) => item.id !== card.id));

    setColumns((prev) =>
      prev.map((column, index) => {
        if (index === columnIndex) {
          return [...column, card];
        }

        return column;
      }),
    );
  }, []);

  const handleCanMoveCardToColumn = useCallback(
    (card: TCard, columnIndex: number) => {
      return canMoveCardToColumn(card, columnIndex, columns);
    },
    [columns],
  );

  const onDropCardFromColumnToOtherColumn = useCallback((movingCards: TCard[], cardIndex: number, cardColumnIndex: number, columnIndex: number) => {
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
  }, []);

  const handleCanMoveCardToFoundationColumn = useCallback(
    (card: TCard, columnIndex: number) => {
      return canMoveCardToFoundationColumn(card, columnIndex, foundationsColumns);
    },
    [foundationsColumns],
  );

  const onDropCardFromWasteToFoundationColumn = useCallback((card: TCard, columnIndex: number) => {
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
  }, []);

  const onDropCardFromColumnToFoundationColumn = useCallback((card: TCard, cardColumnIndex: number, columnIndex: number) => {
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
  }, []);

  const onDropCardFromFoundationColumnToColumn = useCallback((card: TCard, cardColumnIndex: number, columnIndex: number) => {
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
  }, []);

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
                canMoveCardToFoundationColumn={handleCanMoveCardToFoundationColumn}
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
                canMoveCardToColumn={handleCanMoveCardToColumn}
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
