export interface GameData {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  badge?: string;
  completed?: boolean;
}

export const gamesData: GameData[] = [
  {
    id: 'trivia',
    name: 'Web3 Trivia',
    description: 'Test your blockchain knowledge!',
    icon: '🎯',
    points: 10,
    badge: 'Brain Badge'
  },
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Match Web3 project logos',
    icon: '🃏',
    points: 15,
    badge: 'Memory Master'
  },
  {
    id: 'reaction',
    name: 'Quick Click',
    description: 'Test your reaction speed',
    icon: '⚡',
    points: 5,
    badge: 'Lightning Fast'
  },
  {
    id: 'rps',
    name: 'Rock Paper Scissors',
    description: 'Challenge the blockchain!',
    icon: '✌️',
    points: 8,
    badge: 'Game Master'
  },
  {
    id: 'flappy',
    name: 'Flappy Bird',
    description: 'Navigate through pipes with smooth animations!',
    icon: '🐦',
    points: 20,
    badge: 'Sky Master'
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Grow your snake with increasing speed!',
    icon: '🐍',
    points: 25,
    badge: 'Snake Charmer'
  },
  {
    id: 'breakout',
    name: 'Breakout',
    description: 'Break bricks with paddle and ball physics!',
    icon: '🏓',
    points: 30,
    badge: 'Brick Breaker'
  }
];

export const triviaQuestions = [
  {
    question: 'What is the purpose of a smart contract?',
    options: [
      'Self-executing contract with terms written in code',
      'A contract written by AI',
      'A paper contract stored digitally',
      'A contract between smart people'
    ],
    correct: 0
  },
  {
    question: 'Which of these is NOT a blockchain consensus mechanism?',
    options: [
      'Proof of Work',
      'Proof of Stake',
      'Proof of History',
      'Proof of Luck'
    ],
    correct: 3
  },
  {
    question: 'What is a blockchain fork?',
    options: [
      'A blockchain restaurant',
      'A split in the blockchain protocol',
      'A blockchain wallet',
      'A mining tool'
    ],
    correct: 1
  }
];
