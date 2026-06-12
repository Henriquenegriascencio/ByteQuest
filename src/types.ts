export type Difficulty = 'Iniciante' | 'Médio' | 'Profissional';

export interface Question {
  id: string;
  type: 'multiple-choice' | 'block-order' | 'fill-blank' | 'bug-hunt';
  instruction: string;
  codeContext?: string; // Code template to show
  // For multiple-choice
  options?: string[];
  correctAnswer?: string; // used for multiple-choice and fill-blank
  // For block-order
  blocks?: string[]; // Code blocks the user can tap to arrange
  correctBlocks?: string[]; // The matching correct sequence
  // For fill-blank
  blankTextBefore?: string;
  blankTextAfter?: string;
  // For bug-hunt
  buggyCode?: string[]; // Array of strings (lines of code), clicking one selects it
  correctLineIndex?: number; // Zero-based index of the buggy line
  explanation: string; // Explanation of the concept/error
  xpReward: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  icon: string; // Lucide icon name string
  color: string; // Tailwind class name or hex representation (e.g., 'emerald', 'sky')
  questions: Question[];
}

export interface Certificate {
  id: string; // e.g. 'cert-iniciante', 'cert-medio', 'cert-profissional'
  title: string;
  difficulty: Difficulty;
  recipientName: string;
  issueDate: string;
  averageGrade: number;
  percentageCompleted: number;
}

export interface UserProgress {
  xp: number;
  hearts: number;
  streak: number;
  streakShields: number; // For keeping streak active on failure
  completedModules: string[]; // List of module IDs completed
  unlockedDifficulties: Difficulty[];
  gems: number; // For shopping
  activeTheme: string; // custom theme
  purchasedThemes: string[];
  moduleProgress?: Record<string, number>; // Mapping module IDs to highest percentage completed (0-100)
  moduleGrades?: Record<string, number>; // Mapping module IDs to highest grade achieved (0-10)
  certificates?: Certificate[]; // User's certificates in inventory
  lastHeartsUpdateTime?: number; // Milliseconds timestamp of the last heart update
}
