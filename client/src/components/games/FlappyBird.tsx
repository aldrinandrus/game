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
}

interface Bird {
  x: number;
  y: number;
  velocity: number;
  gravity: number;
  size: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  gap: number;
  passed: boolean;
}

interface FlappyBirdProps {
  onComplete: (points: number) => void;
}

export const FlappyBird: React.FC<FlappyBirdProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    score: 0,
    highScore: parseInt(localStorage.getItem('flappyBirdHighScore') || '0')
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Game objects
  const birdRef = useRef<Bird>({
    x: 100,
    y: 300,
    velocity: 0,
    gravity: 0.5,
    size: 20
  });

  const pipesRef = useRef<Pipe[]>([]);
  const backgroundOffsetRef = useRef(0);

  // Game constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const PIPE_SPEED = 2;
  const PIPE_SPAWN_RATE = 150;
  const MIN_PIPE_HEIGHT = 50;
  const MAX_PIPE_HEIGHT = 400;

  // Sound effects (using Web Audio API)
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
    birdRef.current = {
      x: 100,
      y: 300,
      velocity: 0,
      gravity: 0.5,
      size: 20
    };
    pipesRef.current = [];
    backgroundOffsetRef.current = 0;
    
    // Reset game state
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      score: 0
    }));
    
    console.debug('FlappyBird: Game initialized');
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const gameOver = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: false, isGameOver: true }));
    
    // Update high score
    if (gameState.score > gameState.highScore) {
      const newHighScore = gameState.score;
      localStorage.setItem('flappyBirdHighScore', newHighScore.toString());
      setGameState(prev => ({ ...prev, highScore: newHighScore }));
    }

    // Award points based on score
    const points = Math.floor(gameState.score * 2);
    onComplete(points);

    // Play game over sound
    playSound(200, 0.5, 'square');
  }, [gameState.score, gameState.highScore, onComplete, playSound]);

  const flap = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;
    
    birdRef.current.velocity = -8;
    playSound(800, 0.1, 'sine');
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, playSound]);

  const spawnPipe = useCallback(() => {
    const topHeight = Math.random() * (MAX_PIPE_HEIGHT - MIN_PIPE_HEIGHT) + MIN_PIPE_HEIGHT;
    const gap = 150;
    const bottomY = topHeight + gap;

    pipesRef.current.push({
      x: CANVAS_WIDTH,
      topHeight,
      bottomY,
      width: 60,
      gap,
      passed: false
    });
  }, []);

  const updateGame = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;

    const bird = birdRef.current;
    const pipes = pipesRef.current;

    // Update bird
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Update pipes
    pipes.forEach(pipe => {
      pipe.x -= PIPE_SPEED;
      
      // Check if bird passed pipe
      if (!pipe.passed && pipe.x + pipe.width < bird.x) {
        pipe.passed = true;
        setGameState(prev => ({ ...prev, score: prev.score + 1 }));
        playSound(1000, 0.1, 'sine');
      }
    });

    // Remove off-screen pipes
    pipesRef.current = pipes.filter(pipe => pipe.x > -pipe.width);

    // Spawn new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < CANVAS_WIDTH - PIPE_SPAWN_RATE) {
      spawnPipe();
    }

    // Update background
    backgroundOffsetRef.current = (backgroundOffsetRef.current + 1) % CANVAS_WIDTH;

    // Check collisions
    if (bird.y < 0 || bird.y + bird.size > CANVAS_HEIGHT) {
      gameOver();
      return;
    }

    // Check pipe collisions
    pipes.forEach(pipe => {
      if (bird.x + bird.size > pipe.x && bird.x < pipe.x + pipe.width) {
        if (bird.y < pipe.topHeight || bird.y + bird.size > pipe.bottomY) {
          gameOver();
          return;
        }
      }
    });
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, spawnPipe, gameOver, playSound]);

  const renderGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw clouds (scrolling background)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 5; i++) {
      const x = (i * 200 - backgroundOffsetRef.current) % (CANVAS_WIDTH + 200);
      ctx.beginPath();
      ctx.arc(x, 100 + i * 30, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw pipes
    ctx.fillStyle = '#228B22';
    pipesRef.current.forEach(pipe => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, CANVAS_HEIGHT - pipe.bottomY);
      
      // Pipe caps
      ctx.fillStyle = '#006400';
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, pipe.width + 10, 20);
      ctx.fillRect(pipe.x - 5, pipe.bottomY, pipe.width + 10, 20);
      ctx.fillStyle = '#228B22';
    });

    // Draw bird
    const bird = birdRef.current;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(bird.x + bird.size / 2, bird.y + bird.size / 2, bird.size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(bird.x + bird.size / 2 + 5, bird.y + bird.size / 2 - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird wing (animated)
    ctx.fillStyle = '#FFA500';
    const wingOffset = Math.sin(Date.now() * 0.01) * 3;
    ctx.beginPath();
    ctx.arc(bird.x + bird.size / 2 - 5, bird.y + bird.size / 2 + wingOffset, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(gameState.score.toString(), CANVAS_WIDTH / 2, 80);

    // Draw high score
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Best: ${gameState.highScore}`, CANVAS_WIDTH / 2, 120);
  }, [gameState.score, gameState.highScore]);

  const gameLoop = useCallback((timestamp: number) => {
    try {
      updateGame();
      renderGame();
    } catch (error) {
      console.error('Error in FlappyBird game loop:', error);
      setGameState(prev => ({ ...prev, isPlaying: false, isGameOver: true }));
      return;
    }
  }, [updateGame, renderGame]);

  // Handle keyboard and touch events
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        flap();
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        pauseGame();
      }
    };

    const handleTouch = () => {
      flap();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouch);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [flap, pauseGame]);

  // Use custom animation frame hook
  const { start: startAnimation, stop: stopAnimation } = useAnimationFrame(
    gameLoop,
    gameState.isPlaying && !gameState.isPaused
  );

  // Debug logging
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      console.debug('FlappyBird: Starting animation');
      startAnimation();
    } else {
      console.debug('FlappyBird: Stopping animation');
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
    <GameErrorBoundary gameName="Flappy Bird">
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
              onClick={flap}
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
            {gameState.isPlaying ? 'Click or press SPACE to flap!' : 'Press SPACE to flap, P to pause'}
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