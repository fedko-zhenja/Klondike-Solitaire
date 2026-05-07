export const suitSymbols = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

export type TCard = {
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  rank: "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
  id: string;
  isFaceUp: boolean;
};

export const arraySuits = ["hearts", "diamonds", "clubs", "spades"] as const;
export const arrayRanks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] as const;

export const createDeck = (): TCard[] => {
  const deck: TCard[] = [];

  arraySuits.forEach((suit) => {
    arrayRanks.forEach((rank) => {
      deck.push({
        suit,
        rank,
        id: `${rank}-${suit}`,
        isFaceUp: false,
      });
    });
  });

  return deck;
};

export const shuffleDeck = (deck: TCard[]): TCard[] => {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

export const fillColumnsWithCards = (deck: TCard[], columns: TCard[][]) => {
  const halfDeckForColumns = deck.slice(0, 28);

  let currentIndex = 0;

  const arrayColumnsWithCards = columns.map((_, index: number) => {
    const count = index + 1; // сколько карт в колонке

    const columnCards = halfDeckForColumns.slice(currentIndex, currentIndex + count);

    columnCards[columnCards.length - 1].isFaceUp = true;

    currentIndex += count; // сдвигаем указатель

    return columnCards;
  });

  return arrayColumnsWithCards;
};

const getCardSuitColor = (suit: TCard["suit"]) => {
  return suit === "hearts" || suit === "diamonds" ? "red" : "black";
};

const getCardRankValue = (rank: TCard["rank"]): number => {
  if (rank === "A") return 1;
  if (rank === "J") return 11;
  if (rank === "Q") return 12;
  if (rank === "K") return 13;
  return parseInt(rank);
};

export const openCard = (card: TCard): TCard => {
  return { ...card, isFaceUp: true };
};

export const canMoveCardToColumn = (card: TCard, columnIndex: number, columns: TCard[][]): boolean => {
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
};

export const isWin = (foundationsColumns: TCard[][]): boolean => {
  return foundationsColumns.every((column) => column.length === 13);
};

export const canMoveCardToFoundationColumn = (card: TCard, columnIndex: number, foundationsColumns: TCard[][]): boolean => {
  const lastCardInColumn = foundationsColumns[columnIndex][foundationsColumns[columnIndex].length - 1];

  if (!lastCardInColumn) {
    return card.rank === "A";
  }

  if (getCardSuitColor(card.suit) !== getCardSuitColor(lastCardInColumn.suit)) {
    return false;
  }

  if (getCardRankValue(card.rank) !== getCardRankValue(lastCardInColumn.rank) + 1) {
    return false;
  }

  return true;
};
