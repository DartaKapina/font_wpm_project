export interface TypingResult {
  user_id: string;
  wpm: number;
  accuracy: number;
  text_length: number;
  time_taken: number;
  key_data: {
    time: number;
    value: number;
  }[];
}

export interface TypingResultResponse extends TypingResult {
  id: number;
  timestamp: string;
}
