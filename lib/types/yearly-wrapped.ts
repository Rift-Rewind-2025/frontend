export interface YearlyWrapped {
  cards: {
    id: string;
    title: string;
    subtitle: string;
    body: string;
    explanations: {
      metric: string;
      text: string;
    }[];
    joke: string;
    emoji: string;
    sourceNotes: string[];
  }[];
  weaknesses: {
    metric: string;
    label: string;
    specific_fix: string;
    why: string;
  }[];
}
