export type hydro = {
  charge: number;
  tipo: string;
  x: number;
  y: number;
  id: number;
};

export type HydroMatrix = Array<Array<hydro>>;

export default class Protein {
  private _size: number;
  private matrix: HydroMatrix;
  private err: (_err: string) => void;

  emptyElement: hydro = {
    charge: -1,
    tipo: "*",
    x: -1,
    y: -1,
    id: -1,
  };

  constructor(
    size: number,
    errorPipe: (_err: string) => void,
    sequence: string
  ) {
    this.err = errorPipe;
    this._size = size;
    this.matrix = new Array(size);
    for (let i = 0; i < size; i++) {
      this.matrix[i] = new Array(size);
      for (let j = 0; j < size; j++) this.matrix[i][j] = this.emptyElement;
    }
    this.append(sequence);
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
    if (sequence.length + start > this._size * this._size) {
      this.err(`The sequence is too long for the matrix`);
      return false;
    }

    let x = start;
    let y = 0;
    for (let i = 0; i < sequence.length; i++) {
      this.matrix[x][y] = {
        charge: 0,
        tipo: sequence[i],
        x: x,
        y: y,
        id: i,
      };
      x++;
      if (x >= this._size) {
        x = 0;
        y++;
        console.log(`x ${x} y ${y}`);
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

  process_score(): number {
    let arr = Array<hydro>();
    let score = 0;
    console.log("Processing");
    //print matrix
    // for (let i = 0; i < this._size; i++) {
    //   let str = "";
    //   for (let j = 0; j < this._size; j++) {
    //     str += this.matrix[j][i].tipo;
    //   }
    //   console.log(str);
    // }
    // console.log("-------------");

    //get all Hs in the matrix
    for (let i = 0; i < this._size; i++) {
      for (let j = 0; j < this._size; j++) {
        if (this.matrix[i][j].tipo.toLowerCase() == "h")
          arr.push(this.matrix[i][j]);
      }
    }

    //calculate score for each H
    for (let i = 0; i < arr.length; i++) {
      let local_score = 0;
      //sarch horizontally
      for (let j = 0; j < this._size; j++) {
        if (arr[i].id == this.matrix[j][arr[i].y].id) continue;
        if (this.matrix[j][arr[i].y].tipo.toLowerCase() == "h") {
          let dist = Math.abs(arr[i].x - this.matrix[j][arr[i].y].x);
          local_score += 1 / dist;
          console.log(
            `pinned is ${arr[i].id}, found neighbor at [${j},${arr[i].y}] dist ${dist}`
          );
        }
      }

      //search vertically
      for (let j = 0; j < this._size; j++) {
        if (arr[i].id == this.matrix[arr[i].x][j].id) continue;
        if (this.matrix[arr[i].x][j].tipo.toLowerCase() == "h") {
          let dist = Math.abs(arr[i].y - this.matrix[arr[i].x][j].y);
          if (dist == 0) continue;
          local_score += 1 / dist;
          console.log(
            `pinned is ${arr[i].id}, found neighbor at [${j},${arr[i].y}] dist ${dist}`
          );
        }
      }

      arr[i].charge = local_score;
      score += local_score;
    }

    return score;
  }
}
