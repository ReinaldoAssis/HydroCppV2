export type hydro = {
  charge: number;
  tipo: string;
  x: number;
  y: number;
};

export type HydroMatrix = Array<Array<hydro>>;

export default class Protein {
  private _size: number;
  private matrix: HydroMatrix;
  private err: (_err: string) => void;

  constructor(size: number, errorPipe: (_err: string) => void) {
    this.err = errorPipe;
    this._size = size;
    this.matrix = new Array(size);
    for (let i = 0; i < size; i++) {
      this.matrix[i] = new Array(size);
    }
  }

  set(el: hydro, x: number, y: number): boolean {
    if (this.matrix[x][y] != null) {
      this.err(`There are already an element in this position [${x},${y}]`);
      return false;
    }
    this.matrix[x][y] = el;
    return true;
  }

  append(sequence: string, start?: number): boolean {
    if (start == null) start = 0;
    if (sequence.length + start > this._size) {
      this.err(`The sequence is too long for the matrix`);
      return false;
    }

    let x = start;
    let y = 0;
    for (let i = 0; i < sequence.length; i++) {
      this.matrix[start + i][0] = {
        charge: 0,
        tipo: sequence[i],
        x: x,
        y: y,
      };
      x++;
      if (x >= this._size) {
        x = 0;
        y++;
      }
    }
    return true;
  }

  get size(): number {
    return this._size;
  }

  get protein_matrix(): HydroMatrix {
    return this.matrix;
  }
}
