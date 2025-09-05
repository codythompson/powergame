export interface Rated {
  rate: number;
}

export interface Node extends Rated {
  slots: Rated[];
}

export interface Buffer extends Rated {
  in: Node;
  out: Node;
}
