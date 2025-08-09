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
  lives: number;
  level: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface Ball {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  speed: number;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  points: number;
  destroyed: boolean;
}

interface BreakoutProps {
  onComplete: (points: number) => void;
}

export const Breakout: React.FC<BreakoutProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    score: 0,
    highScore: parseInt(localStorage.getItem('breakoutHighScore') || '0'),
    lives: 3,
    level: 1
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Game objects
  const paddleRef = useRef<Paddle>({
    x: 0,
    y: 0,
    width: 100,
    height: 15,
    speed: 8
  });

  const ballRef = useRef<Ball>({
    x: 0,
    y: 0,
    radius: 8,
    dx: 0,
    dy: 0,
    speed: 5
  });

  const bricksRef = useRef<Brick[]>([]);
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  // Game constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const BRICK_ROWS = 8;
  const BRICK_COLS = 12;
  const BRICK_WIDTH = 60;
  const BRICK_HEIGHT = 20;
  const BRICK_PADDING = 5;
  const BRICK_OFFSET_TOP = 80;
  const BRICK_OFFSET_LEFT = 50;

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

  const createBricks = useCallback(() => {
    const bricks: Brick[] = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.push({
          x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
          y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          color: colors[row % colors.length],
          points: (BRICK_ROWS - row) * 10,
          destroyed: false
        });
      }
    }
    bricksRef.current = bricks;
  }, []);

  const initGame = useCallback(() => {
    // Reset all game state
    paddleRef.current = {
      x: CANVAS_WIDTH / 2 - 50,
      y: CANVAS_HEIGHT - 30,
      width: 100,
      height: 15,
      speed: 8
    };

    // Reset ball
    ballRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 50,
      radius: 8,
      dx: 4,
      dy: -4,
      speed: 5
    };

    // Reset keys
    keysRef.current = { left: false, right: false };

    createBricks();
    
    // Reset game state
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      score: 0,
      lives: 3,
      level: 1
    }));
    
    console.debug('Breakout: Game initialized');
  }, [createBricks]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const gameOver = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: false, isGameOver: true }));
    
    // Update high score
    if (gameState.score > gameState.highScore) {
      const newHighScore = gameState.score;
      localStorage.setItem('breakoutHighScore', newHighScore.toString());
      setGameState(prev => ({ ...prev, highScore: newHighScore }));
    }

    // Award points based on score
    const points = Math.floor(gameState.score * 2);
    onComplete(points);

    // Play game over sound
    playSound(200, 0.5, 'square');
  }, [gameState.score, gameState.highScore, onComplete, playSound]);

  const loseLife = useCallback(() => {
    setGameState(prev => ({ ...prev, lives: prev.lives - 1 }));
    
    if (gameState.lives <= 1) {
      gameOver();
    } else {
      // Reset ball position
      ballRef.current.x = CANVAS_WIDTH / 2;
      ballRef.current.y = CANVAS_HEIGHT - 50;
      ballRef.current.dx = 4;
      ballRef.current.dy = -4;
      
      // Play lose life sound
      playSound(400, 0.3, 'square');
    }
  }, [gameState.lives, gameOver, playSound]);

  const checkCollision = useCallback(() => {
    const ball = ballRef.current;
    const paddle = paddleRef.current;
    const bricks = bricksRef.current;

    // Ball-wall collision
    if (ball.x + ball.radius > CANVAS_WIDTH || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
      playSound(600, 0.1, 'sine');
    }
    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
      playSound(600, 0.1, 'sine');
    }

    // Ball-paddle collision
    if (ball.y + ball.radius > paddle.y && 
        ball.x > paddle.x && 
        ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy;
      
      // Adjust ball direction based on where it hits the paddle
      const hitPos = (ball.x - paddle.x) / paddle.width;
      ball.dx = (hitPos - 0.5) * 8;
      
      playSound(800, 0.1, 'sine');
    }

    // Ball-brick collision
    bricks.forEach(brick => {
      if (!brick.destroyed) {
        if (ball.x + ball.radius > brick.x && 
            ball.x - ball.radius < brick.x + brick.width &&
            ball.y + ball.radius > brick.y && 
            ball.y - ball.radius < brick.y + brick.height) {
          
          brick.destroyed = true;
          ball.dy = -ball.dy;
          
          setGameState(prev => ({ ...prev, score: prev.score + brick.points }));
          
          // Check if all bricks are destroyed
          if (bricks.every(b => b.destroyed)) {
            setGameState(prev => ({ ...prev, level: prev.level + 1 }));
            createBricks();
            // Increase ball speed
            ball.speed += 0.5;
            ball.dx = ball.dx > 0 ? ball.speed : -ball.speed;
            ball.dy = ball.dy > 0 ? ball.speed : -ball.speed;
          }
          
          playSound(1000, 0.1, 'sine');
        }
      }
    });

    // Check if ball is below paddle
    if (ball.y + ball.radius > CANVAS_HEIGHT) {
      loseLife();
    }
  }, [loseLife, playSound]);

  const updateGame = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;

    const ball = ballRef.current;
    const paddle = paddleRef.current;
    const keys = keysRef.current;

    // Update paddle position
    if (keys.left && paddle.x > 0) {
      paddle.x -= paddle.speed;
    }
    if (keys.right && paddle.x < CANVAS_WIDTH - paddle.width) {
      paddle.x += paddle.speed;
    }

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Check collisions
    checkCollision();
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, checkCollision]);

  const renderGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#334155');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bricks
    bricksRef.current.forEach(brick => {
      if (!brick.destroyed) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        
        // Add 3D effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(brick.x, brick.y, brick.width, 3);
        ctx.fillRect(brick.x, brick.y, 3, brick.height);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(brick.x + brick.width - 3, brick.y, 3, brick.height);
        ctx.fillRect(brick.x, brick.y + brick.height - 3, brick.width, 3);
      }
    });

    // Draw paddle
    const paddle = paddleRef.current;
    const paddleGradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
    paddleGradient.addColorStop(0, '#3b82f6');
    paddleGradient.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = paddleGradient;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    // Paddle shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(paddle.x + 2, paddle.y + 2, paddle.width, paddle.height);

    // Draw ball
    const ball = ballRef.current;
    const ballGradient = ctx.createRadialGradient(
      ball.x - ball.radius/3, ball.y - ball.radius/3, 0,
      ball.x, ball.y, ball.radius
    );
    ballGradient.addColorStop(0, '#ffffff');
    ballGradient.addColorStop(1, '#fbbf24');
    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Ball highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(ball.x - ball.radius/3, ball.y - ball.radius/3, ball.radius/3, 0, Math.PI * 2);
    ctx.fill();

    // Draw UI
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
    ctx.fillText(`Lives: ${gameState.lives}`, 10, 55);
    ctx.fillText(`Level: ${gameState.level}`, 10, 80);
    ctx.fillText(`Best: ${gameState.highScore}`, 10, 105);

    // Draw game over screen
    if (gameState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }

    // Draw pause screen
    if (gameState.isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
  }, [gameState.score, gameState.lives, gameState.level, gameState.highScore, gameState.isGameOver, gameState.isPaused]);

  const gameLoop = useCallback((timestamp: number) => {
    try {
      updateGame();
      renderGame();
    } catch (error) {
      console.error('Error in Breakout game loop:', error);
      setGameState(prev => ({ ...prev, isPlaying: false, isGameOver: true }));
      return;
    }
  }, [updateGame, renderGame]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;
      
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          keysRef.current.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          keysRef.current.right = true;
          break;
        case 'KeyP':
          e.preventDefault();
          pauseGame();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          keysRef.current.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          keysRef.current.right = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, pauseGame]);

  // Use custom animation frame hook
  const { start: startAnimation, stop: stopAnimation } = useAnimationFrame(
    gameLoop,
    gameState.isPlaying && !gameState.isPaused
  );

  // Debug logging
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      console.debug('Breakout: Starting animation');
      startAnimation();
    } else {
      console.debug('Breakout: Stopping animation');
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
    <GameErrorBoundary gameName="Breakout">
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
            Use A/D or arrow keys to move paddle, P to pause
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

export default Breakout;