'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { toast } from 'sonner';

type Player = 'X' | 'O' | null;

interface SquareProps {
  value: Player;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ value, onClick }) => (
  <Button
    className="w-20 h-20 text-4xl font-bold"
    variant={value ? 'default' : 'outline'}
    onClick={onClick}
  >
    {value}
  </Button>
);

const TicTacToe: React.FC = () => {
  const [squares, setSquares] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [xWins, setXWins] = useState<number>(0);
  const [oWins, setOWins] = useState<number>(0);

  useEffect(() => {
    // Load win counts from localStorage
    const storedXWins = localStorage.getItem('xWins');
    const storedOWins = localStorage.getItem('oWins');
    if (storedXWins) setXWins(parseInt(storedXWins));
    if (storedOWins) setOWins(parseInt(storedOWins));
  }, []);

  useEffect(() => {
    if (winner) {
      setShowConfetti(true);
      toast.success(`Player ${winner} wins!`);
      setTimeout(() => setShowConfetti(false), 5000);

      // Update win counts
      if (winner === 'X') {
        const newXWins = xWins + 1;
        setXWins(newXWins);
        localStorage.setItem('xWins', newXWins.toString());
      } else {
        const newOWins = oWins + 1;
        setOWins(newOWins);
        localStorage.setItem('oWins', newOWins.toString());
      }
    } else if (squares.every((square) => square !== null)) {
      toast.info("It's a draw!");
    }
  }, [winner]); // Only depend on winner state change

  const handleClick = (i: number) => {
    if (winner || squares[i]) return;

    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);

    const newWinner = calculateWinner(newSquares);
    if (newWinner) setWinner(newWinner);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setShowConfetti(false);
  };

  const resetScores = () => {
    setXWins(0);
    setOWins(0);
    localStorage.removeItem('xWins');
    localStorage.removeItem('oWins');
    toast.success('Scores reset!');
  };

  const renderSquare = (i: number) => (
    <Square value={squares[i]} onClick={() => handleClick(i)} />
  );

  const status = winner
    ? `Winner: ${winner}`
    : squares.every((square) => square !== null)
    ? "It's a draw!"
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <Card className="p-6 space-y-4">
      {showConfetti && <Confetti />}
      <div className="text-2xl font-bold text-center">{status}</div>
      <div className="grid grid-cols-3 gap-2">
        {Array(9)
          .fill(null)
          .map((_, i) => (
            <div key={i}>{renderSquare(i)}</div>
          ))}
      </div>
      <div className="flex justify-between text-lg font-semibold">
        <span>X Wins: {xWins}</span>
        <span>O Wins: {oWins}</span>
      </div>
      <Button onClick={resetGame} className="w-full">
        Reset Game
      </Button>
      <Button onClick={resetScores} variant="outline" className="w-full">
        Reset Scores
      </Button>
    </Card>
  );
};

function calculateWinner(squares: Player[]): Player {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default TicTacToe;
