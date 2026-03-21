import { useState, useEffect, useCallback, useRef } from 'react';
import { Puzzle, RotateCcw, Trophy, Clock, Shuffle, Grid3X3, Brain, Hash } from 'lucide-react';
import styles from './PuzzleBox.module.css';

type PuzzleType = 'sliding' | 'memory' | 'wordsearch';
type Difficulty = 'easy' | 'medium' | 'hard';

// ============ SLIDING PUZZLE ============
interface SlidingTile {
  value: number;
  position: number;
  isEmpty: boolean;
}

function SlidingPuzzle({ difficulty, onComplete }: { difficulty: Difficulty; onComplete: () => void }) {
  const size = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
  const totalTiles = size * size;
  
  const [tiles, setTiles] = useState<SlidingTile[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  const initializeTiles = useCallback(() => {
    const newTiles: SlidingTile[] = [];
    const values = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
    
    // Fisher-Yates shuffle
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    
    // Ensure solvability
    let inversions = 0;
    for (let i = 0; i < values.length; i++) {
      for (let j = i + 1; j < values.length; j++) {
        if (values[i] > values[j]) inversions++;
      }
    }
    
    const isEvenSize = size % 2 === 0;
    const emptyRow = Math.floor(values.length / size);
    
    if (isEvenSize && (inversions + emptyRow) % 2 !== 0) {
      [values[0], values[1]] = [values[1], values[0]];
    } else if (!isEvenSize && inversions % 2 !== 0) {
      [values[0], values[1]] = [values[1], values[0]];
    }
    
    values.forEach((value, index) => {
      newTiles.push({
        value,
        position: index,
        isEmpty: false,
      });
    });
    
    // Add empty tile
    newTiles.push({
      value: 0,
      position: totalTiles - 1,
      isEmpty: true,
    });
    
    setTiles(newTiles);
    setMoves(0);
    setStartTime(null);
    setIsSolved(false);
  }, [totalTiles, size]);

  useEffect(() => {
    initializeTiles();
  }, [initializeTiles]);

  const checkSolved = (currentTiles: SlidingTile[]) => {
    for (let i = 0; i < totalTiles - 1; i++) {
      const tile = currentTiles.find(t => t.position === i);
      if (!tile || tile.value !== i + 1) return false;
    }
    return true;
  };

  const moveTile = (position: number) => {
    if (isSolved) return;
    
    const emptyTile = tiles.find(t => t.isEmpty);
    if (!emptyTile) return;
    
    const adjacentPositions: number[] = [];
    const row = Math.floor(position / size);
    const col = position % size;
    
    if (row > 0) adjacentPositions.push(position - size);
    if (row < size - 1) adjacentPositions.push(position + size);
    if (col > 0) adjacentPositions.push(position - 1);
    if (col < size - 1) adjacentPositions.push(position + 1);
    
    if (!adjacentPositions.includes(emptyTile.position)) return;
    
    if (!startTime) setStartTime(Date.now());
    
    const newTiles = tiles.map(tile => {
      if (tile.position === position) {
        return { ...tile, position: emptyTile.position };
      }
      if (tile.position === emptyTile.position) {
        return { ...tile, position };
      }
      return tile;
    });
    
    setTiles(newTiles);
    setMoves(prev => prev + 1);
    
    if (checkSolved(newTiles)) {
      setIsSolved(true);
      onComplete();
    }
  };

  const getTileAtPosition = (pos: number) => tiles.find(t => t.position === pos);

  return (
    <div className={styles.slidingPuzzle}>
      <div className={styles.puzzleHeader}>
        <span>Moves: {moves}</span>
        {startTime && <span>Time: {Math.floor((Date.now() - startTime) / 1000)}s</span>}
      </div>
      
      <div 
        className={styles.puzzleGrid} 
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {Array.from({ length: totalTiles }).map((_, index) => {
          const tile = getTileAtPosition(index);
          if (tile?.isEmpty) {
            return <div key={index} className={styles.emptyTile} />;
          }
          return (
            <button
              key={tile?.value}
              className={`${styles.tile} ${isSolved ? styles.solved : ''}`}
              onClick={() => moveTile(tile!.position)}
              style={{
                background: `linear-gradient(135deg, 
                  hsl(${(tile!.value * 360) / (totalTiles - 1)}, 70%, 60%), 
                  hsl(${(tile!.value * 360) / (totalTiles - 1)}, 70%, 45%))`,
              }}
            >
              {tile?.value}
            </button>
          );
        })}
      </div>
      
      {isSolved && (
        <div className={styles.victoryOverlay}>
          <Trophy size={48} />
          <span>Puzzle Solved!</span>
          <span>{moves} moves in {startTime ? Math.floor((Date.now() - startTime) / 1000) : 0}s</span>
        </div>
      )}
      
      <button className={styles.resetButton} onClick={initializeTiles}>
        <RotateCcw size={16} /> Shuffle
      </button>
    </div>
  );
}

// ============ MEMORY GAME ============
interface MemoryCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const memorySymbols = ['🌸', '🌺', '🌻', '🌷', '🌹', '🍀', '🌈', '⭐', '🌙', '☀️', '🦋', '🐢'];

function MemoryGame({ difficulty, onComplete }: { difficulty: Difficulty; onComplete: () => void }) {
  const pairs = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const initializeCards = useCallback(() => {
    const shuffledSymbols = [...memorySymbols]
      .sort(() => Math.random() - 0.5)
      .slice(0, pairs);
    
    const newCards: MemoryCard[] = [];
    shuffledSymbols.forEach((symbol, index) => {
      newCards.push(
        { id: index * 2, symbol, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, symbol, isFlipped: false, isMatched: false }
      );
    });
    
    setCards(newCards.sort(() => Math.random() - 0.5));
    setSelected([]);
    setMoves(0);
    setIsLocked(false);
  }, [pairs]);

  useEffect(() => {
    initializeCards();
  }, [initializeCards]);

  useEffect(() => {
    if (selected.length === 2) {
      setIsLocked(true);
      const [first, second] = selected;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);
      
      if (firstCard?.symbol === secondCard?.symbol) {
        setCards(prev => prev.map(c => 
          c.id === first || c.id === second 
            ? { ...c, isMatched: true }
            : c
        ));
        setSelected([]);
        setIsLocked(false);
        
        // Check win
        if (cards.filter(c => !c.isMatched).length === 2) {
          setTimeout(onComplete, 500);
        }
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isFlipped: false }
              : c
          ));
          setSelected([]);
          setIsLocked(false);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [selected, cards, onComplete]);

  const flipCard = (id: number) => {
    if (isLocked) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;
    
    setCards(prev => prev.map(c => 
      c.id === id ? { ...c, isFlipped: true } : c
    ));
    setSelected(prev => [...prev, id]);
  };

  return (
    <div className={styles.memoryGame}>
      <div className={styles.puzzleHeader}>
        <span>Moves: {moves}</span>
        <span>Pairs: {cards.filter(c => c.isMatched).length / 2} / {pairs}</span>
      </div>
      
      <div 
        className={styles.memoryGrid}
        style={{ gridTemplateColumns: `repeat(${difficulty === 'easy' ? 4 : 4}, 1fr)` }}
      >
        {cards.map(card => (
          <button
            key={card.id}
            className={`${styles.memoryCard} ${card.isFlipped || card.isMatched ? styles.flipped : ''} ${card.isMatched ? styles.matched : ''}`}
            onClick={() => flipCard(card.id)}
            disabled={card.isFlipped || card.isMatched}
          >
            <span className={styles.cardBack}>?</span>
            <span className={styles.cardFront}>{card.symbol}</span>
          </button>
        ))}
      </div>
      
      <button className={styles.resetButton} onClick={initializeCards}>
        <RotateCcw size={16} /> New Game
      </button>
    </div>
  );
}

// ============ WORD SEARCH ============
interface WordGrid {
  letters: string[][];
  words: string[];
  foundWords: string[];
  selectedCells: { row: number; col: number }[];
}

const wordLists = {
  nature: ['TREE', 'LEAF', 'RAIN', 'WIND', 'FLOWER', 'RIVER', 'MOUNTAIN', 'FOREST'],
  space: ['STAR', 'MOON', 'PLANET', 'COMET', 'GALAXY', 'NEBULA', 'ASTEROID'],
  garden: ['SEED', 'SOIL', 'GROW', 'BLOOM', 'GARDEN', 'PLANT', 'WATER', 'SUN'],
};

function WordSearch({ difficulty, onComplete }: { difficulty: Difficulty; onComplete: () => void }) {
  const gridSize = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 10 : 12;
  const [grid, setGrid] = useState<WordGrid | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ row: number; col: number } | null>(null);

  const generateGrid = useCallback(() => {
    const wordListKeys = ['nature', 'space', 'garden'] as const;
    const wordListKey = wordListKeys[Math.floor(Math.random() * wordListKeys.length)];
    const wordList = wordLists[wordListKey] || wordLists.garden;
    const words = wordList.slice(0, difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6);
    
    const letters: string[][] = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill('')
    );
    
    // Place words
    words.forEach(word => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        let row = Math.floor(Math.random() * gridSize);
        let col = Math.floor(Math.random() * gridSize);
        
        if (direction === 'horizontal' && col + word.length > gridSize) {
          col = gridSize - word.length;
        }
        if (direction === 'vertical' && row + word.length > gridSize) {
          row = gridSize - word.length;
        }
        
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const r = direction === 'horizontal' ? row : row + i;
          const c = direction === 'horizontal' ? col + i : col;
          if (letters[r][c] !== '' && letters[r][c] !== word[i]) {
            canPlace = false;
            break;
          }
        }
        
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            const r = direction === 'horizontal' ? row : row + i;
            const c = direction === 'horizontal' ? col + i : col;
            letters[r][c] = word[i];
          }
          placed = true;
        }
        attempts++;
      }
    });
    
    // Fill empty cells
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (letters[r][c] === '') {
          letters[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }
    
    setGrid({ letters, words, foundWords: [], selectedCells: [] });
  }, [gridSize, difficulty]);

  useEffect(() => {
    generateGrid();
  }, [generateGrid]);

  const getSelectedCells = (start: { row: number; col: number }, end: { row: number; col: number }) => {
    const cells: { row: number; col: number }[] = [];
    const dr = Math.sign(end.row - start.row);
    const dc = Math.sign(end.col - start.col);
    
    if (dr === 0 && dc === 0) {
      return [start];
    }
    
    let r = start.row;
    let c = start.col;
    
    while (r !== end.row || c !== end.col) {
      cells.push({ row: r, col: c });
      r += dr;
      c += dc;
    }
    cells.push({ row: r, col: c });
    
    return cells;
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectionStart({ row, col });
    setGrid(prev => prev ? { ...prev, selectedCells: [{ row, col }] } : null);
  };

  const handleMouseUp = (row: number, col: number) => {
    if (!selectionStart || !grid) return;
    
    const selectedCells = getSelectedCells(selectionStart, { row, col });
    const selectedWord = selectedCells.map(c => grid.letters[c.row][c.col]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    
    const foundWord = grid.words.find(w => 
      w === selectedWord || w === reversedWord
    );
    
    if (foundWord && !grid.foundWords.includes(foundWord)) {
      const newFoundWords = [...grid.foundWords, foundWord];
      setGrid(prev => prev ? { ...prev, foundWords: newFoundWords, selectedCells: [] } : null);
      
      if (newFoundWords.length === grid.words.length) {
        onComplete();
      }
    } else {
      setGrid(prev => prev ? { ...prev, selectedCells: [] } : null);
    }
    
    setIsSelecting(false);
    setSelectionStart(null);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !selectionStart) return;
    const selectedCells = getSelectedCells(selectionStart, { row, col });
    setGrid(prev => prev ? { ...prev, selectedCells } : null);
  };

  if (!grid) return null;

  return (
    <div className={styles.wordSearch}>
      <div className={styles.puzzleHeader}>
        <span>Found: {grid.foundWords.length} / {grid.words.length}</span>
      </div>
      
      <div 
        className={styles.wordGrid}
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        onMouseUp={() => isSelecting && grid && handleMouseUp(
          grid.selectedCells[grid.selectedCells.length - 1]?.row || 0,
          grid.selectedCells[grid.selectedCells.length - 1]?.col || 0
        )}
      >
        {grid.letters.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const isSelected = grid.selectedCells.some(
              c => c.row === rowIndex && c.col === colIndex
            );
            const isFound = grid.foundWords.some(word => {
              const cells = grid.selectedCells;
              const foundCells: { row: number; col: number }[] = [];
              // Check if this cell is part of any found word
              return false; // Simplified for now
            });
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`${styles.wordCell} ${isSelected ? styles.selected : ''}`}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>
      
      <div className={styles.wordList}>
        {grid.words.map(word => (
          <span
            key={word}
            className={`${styles.wordItem} ${grid.foundWords.includes(word) ? styles.found : ''}`}
          >
            {word}
          </span>
        ))}
      </div>
      
      <button className={styles.resetButton} onClick={generateGrid}>
        <Shuffle size={16} /> New Puzzle
      </button>
    </div>
  );
}

// ============ MAIN PUZZLE BOX ============
export default function PuzzleBox() {
  const [puzzleType, setPuzzleType] = useState<PuzzleType>('sliding');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [completedCount, setCompletedCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const handlePuzzleComplete = () => {
    setCompletedCount(prev => prev + 1);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  return (
    <section className={styles.puzzleBox}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          <Puzzle className={styles.icon} size={28} />
          Puzzle Box
        </h2>
        <p className={styles.subtitle}>
          Challenge your mind with classic puzzles
        </p>
      </header>

      <div className={styles.controls}>
        <div className={styles.puzzleSelector}>
          <button
            className={`${styles.typeButton} ${puzzleType === 'sliding' ? styles.active : ''}`}
            onClick={() => setPuzzleType('sliding')}
          >
            <Grid3X3 size={18} />
            Sliding Tiles
          </button>
          <button
            className={`${styles.typeButton} ${puzzleType === 'memory' ? styles.active : ''}`}
            onClick={() => setPuzzleType('memory')}
          >
            <Brain size={18} />
            Memory Match
          </button>
          <button
            className={`${styles.typeButton} ${puzzleType === 'wordsearch' ? styles.active : ''}`}
            onClick={() => setPuzzleType('wordsearch')}
          >
            <Hash size={18} />
            Word Search
          </button>
        </div>

        <div className={styles.difficultySelector}>
          <span>Difficulty:</span>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(level => (
            <button
              key={level}
              className={`${styles.difficultyButton} ${difficulty === level ? styles.active : ''}`}
              onClick={() => setDifficulty(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.puzzleArea}>
        {puzzleType === 'sliding' && (
          <SlidingPuzzle difficulty={difficulty} onComplete={handlePuzzleComplete} />
        )}
        {puzzleType === 'memory' && (
          <MemoryGame difficulty={difficulty} onComplete={handlePuzzleComplete} />
        )}
        {puzzleType === 'wordsearch' && (
          <WordSearch difficulty={difficulty} onComplete={handlePuzzleComplete} />
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <Trophy size={20} />
          <span>Puzzles Solved</span>
          <strong>{completedCount}</strong>
        </div>
      </div>

      {showCelebration && (
        <div className={styles.celebration}>
          <Trophy size={48} />
          <span>Puzzle Completed!</span>
        </div>
      )}
    </section>
  );
}
