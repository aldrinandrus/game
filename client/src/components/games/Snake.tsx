import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { useAnimationFrame } from '@/hooks/useAnimationFrame';
import { GameErrorBoundary } from '@/components/GameErrorBoundary';

interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  level: number;
}

interface SnakeSegment {
  x: number;
  y: number;
}

interface Food {
  x: number;
  y: number;
}

interface SnakeProps {
  onComplete: (points: number) => void;
}

export const Snake: React.FC<SnakeProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
    level: 1
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Game objects
  const snakeRef = useRef<SnakeSegment[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Food>({ x: 15, y: 15 });
  const directionRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });

  // Game constants
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 600;
  const GRID_SIZE = 20;
  const GRID_WIDTH = CANVAS_WIDTH / GRID_SIZE;
  const GRID_HEIGHT = CANVAS_HEIGHT / GRID_SIZE;
  const INITIAL_SPEED = 150;
  const SPEED_INCREASE = 10;

  // Sound effects
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((frequency: number, duration: number, type: 'sine' | 'square' = 'sine') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  }, []);

  const initGame = useCallback(() => {
    // Reset all game state
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    spawnFood();
    
    // Reset game state
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      score: 0,
      level: 1
    }));
    
    console.debug('Snake: Game initialized');
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const gameOver = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: false, isGameOver: true }));
    
    // Update high score
    if (gameState.score > gameState.highScore) {
      const newHighScore = gameState.score;
      localStorage.setItem('snakeHighScore', newHighScore.toString());
      setGameState(prev => ({ ...prev, highScore: newHighScore }));
    }

    // Award points based on score
    const points = Math.floor(gameState.score * 3);
    onComplete(points);

    // Play game over sound
    playSound(200, 0.5, 'square');
  }, [gameState.score, gameState.highScore, onComplete, playSound]);

  const spawnFood = useCallback(() => {
    let newFood: Food;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT)
      };
    } while (snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    foodRef.current = newFood;
  }, []);

  const updateGame = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;

    const snake = snakeRef.current;
    const food = foodRef.current;
    
    // Update direction
    directionRef.current = nextDirectionRef.current;
    
    // Calculate new head position
    const head = snake[0];
    const newHead = {
      x: head.x + directionRef.current.x,
      y: head.y + directionRef.current.y
    };
    
    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GRID_WIDTH || newHead.y < 0 || newHead.y >= GRID_HEIGHT) {
      gameOver();
      return;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      gameOver();
      return;
    }
    
    // Add new head
    snake.unshift(newHead);
    
    // Check food collision
    if (newHead.x === food.x && newHead.y === food.y) {
      // Eat food
      spawnFood();
      setGameState(prev => ({ ...prev, score: prev.score + 1 }));
      
      // Increase level every 5 points
      if ((gameState.score + 1) % 5 === 0) {
        setGameState(prev => ({ ...prev, level: prev.level + 1 }));
      }
      
      // Play eating sound
      playSound(800, 0.1, 'sine');
    } else {
      // Remove tail if no food eaten
      snake.pop();
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, gameState.score, spawnFood, gameOver, playSound]);

  const renderGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Draw snake
    const snake = snakeRef.current;
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Head
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(segment.x * GRID_SIZE + 2, segment.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);
        
        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(segment.x * GRID_SIZE + 6, segment.y * GRID_SIZE + 6, 3, 3);
        ctx.fillRect(segment.x * GRID_SIZE + 11, segment.y * GRID_SIZE + 6, 3, 3);
      } else {
        // Body
        const alpha = Math.max(0.3, 1 - (index / snake.length));
        ctx.fillStyle = `rgba(37, 99, 235, ${alpha})`;
        ctx.fillRect(segment.x * GRID_SIZE + 2, segment.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);
      }
    });

    // Draw food
    const food = foodRef.current;
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw score and level
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
    ctx.fillText(`Level: ${gameState.level}`, 10, 60);
    ctx.fillText(`Best: ${gameState.highScore}`, 10, 90);
  }, [gameState.score, gameState.level, gameState.highScore]);

  const gameLoop = useCallback((timestamp: number) => {
    try {
      updateGame();
      renderGame();
    } catch (error) {
      console.error('Error in Snake game loop:', error);
      setGameState(prev => ({ ...prev, isPlaying: false, isGameOver: true }));
      return;
    }
  }, [updateGame, renderGame]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;
      
      const currentDir = directionRef.current;
      const nextDir = nextDirectionRef.current;
      
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          e.preventDefault();
          if (currentDir.y === 0) {
            nextDir.x = 0;
            nextDir.y = -1;
          }
          break;
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault();
          if (currentDir.y === 0) {
            nextDir.x = 0;
            nextDir.y = 1;
          }
          break;
        case 'ArrowLeft':
        case 'KeyA':
          e.preventDefault();
          if (currentDir.x === 0) {
            nextDir.x = -1;
            nextDir.y = 0;
          }
          break;
        case 'ArrowRight':
        case 'KeyD':
          e.preventDefault();
          if (currentDir.x === 0) {
            nextDir.x = 1;
            nextDir.y = 0;
          }
          break;
        case 'KeyP':
          e.preventDefault();
          pauseGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, pauseGame]);

  // Use custom animation frame hook with throttling
  const { start: startAnimation, stop: stopAnimation } = useAnimationFrame(
    (timestamp) => {
      // Throttle based on level for consistent speed
      const speed = Math.max(50, INITIAL_SPEED - (gameState.level - 1) * SPEED_INCREASE);
      if (timestamp % speed < 16) { // 16ms = ~60fps
        gameLoop(timestamp);
      }
    },
    gameState.isPlaying && !gameState.isPaused
  );

  // Debug logging
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      console.debug('Snake: Starting animation');
      startAnimation();
    } else {
      console.debug('Snake: Stopping animation');
      stopAnimation();
    }
  }, [gameState.isPlaying, gameState.isPaused, startAnimation, stopAnimation]);

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <GameErrorBoundary gameName="Snake">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex gap-2 mb-4">
          {!gameState.isPlaying && !gameState.isGameOver && (
            <Button onClick={initGame} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Start Game
            </Button>
          )}
          
          {gameState.isPlaying && (
            <>
              <Button onClick={pauseGame} variant="outline">
                {gameState.isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                {gameState.isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button onClick={initGame} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </Button>
            </>
          )}
          
          {gameState.isGameOver && (
            <Button onClick={initGame} className="bg-blue-600 hover:bg-blue-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          )}
          
          <Button onClick={toggleFullscreen} variant="outline">
            {isFullscreen ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </div>

        <Card className="border-2 border-gray-200 shadow-lg">
          <CardContent className="p-0">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="cursor-pointer"
              style={{ 
                maxWidth: '100%', 
                height: 'auto',
                touchAction: 'none'
              }}
            />
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Use arrow keys or WASD to move, P to pause
          </p>
          {gameState.isGameOver && (
            <div className="text-lg font-semibold text-red-600">
              Game Over! Score: {gameState.score}
            </div>
          )}
        </div>
      </div>
    </GameErrorBoundary>
  );
};

export default Snake;