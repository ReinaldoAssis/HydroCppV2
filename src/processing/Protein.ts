export class pVector {
  x: number;
  y: number;
  c: string;

  constructor(x: number, y: number, c: string) {
    this.x = x;
    this.y = y;
    this.c = c;
  }

  move(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  moveX(x: number) {
    this.x += x;
  }

  moveY(y: number) {
    this.y += y;
  }
}

export type hydro = {
  charge: number;
  tipo: string;
  x: number;
  y: number;
  id: number;
};

export type HydroMatrix = Array<Array<hydro>>;

export enum PROTEIN_DISTRIBUTION {
  SEQUENTIAL,
  PATH,
}

export class nary_tree {
  data: string;
  path_score: number;
  children: Array<nary_tree>; //0: down, 1: left, 2: up, 3: right

  constructor(_data: string, _children?: Array<nary_tree>) {
    this.data = _data;
    this.children = _children ?? new Array<nary_tree>(4);
    this.path_score = 0;
  }

  set score(_score: number) {
    this.path_score = _score;
  }

  get score() {
    return this.path_score;
  }

  get_nth_child(n: number) {
    return this.children[n];
  }

  make(root: nary_tree, sequence: string, index: number) {
    if (index >= sequence.length) return;
    root.data = sequence[index];
    root.children = new Array<nary_tree>(4);

    // console.log(`adding ${sequence[index]}`);

    index++;
    for (let i = 0; i < 4; i++) {
      root.children[i] = new nary_tree(sequence[index]);
      root.make(root.children[i], sequence, index);
    }
  }

  is_leaf() {
    if (this.children == undefined) return true;
    else if (this.children.length == 0) return true;

    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] != undefined) return false;
    }

    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] == undefined) continue;
      if (this.children[i].data != "") return false;
      else if (this.children[i].data.toLowerCase() != "x") return false;
    }

    return true;
  }
}

export function decompose(size: number): { width: number; height: number } {
  //stores the possible ways to represent the matrix
  //i.e 15 could be represented as 3 x 5
  let pairs: Array<number> = [];

  if (size < 1) {
    return { width: 0, height: 0 };
  }

  for (let i = 1; i <= Math.sqrt(size); i++) {
    //if length is divisible by i
    if (size % i == 0) {
      //case where the number is square (i.e 16 = 4 x 4)
      if (i == size / i) pairs.push(i);
      else {
        pairs.push(i); //first component
        pairs.push(size / i); //second component | i.e [5,3] = 15
      }
    }
  }

  //if matrix is square, rx = ry
  let ry = Math.ceil(Math.sqrt(size));
  let rx = Math.floor(Math.sqrt(size));
  if (rx != ry) {
    //case where the matrix isn't square, i.e sqrt(15) => 3 != 4
    if (pairs.length < 2) {
      return { width: 0, height: 0 };
    }
    rx = pairs[pairs.length - 1];
    ry = pairs[pairs.length - 2];
  }

  return { width: rx, height: ry };
}

export default class Protein {
  //private _size: number;
  private _width: number;
  private _height: number;
  private matrix: HydroMatrix;
  private err: (_err: string) => void;
  private _path: Array<pVector> = new Array<pVector>();

  emptyElement: hydro = {
    charge: -1,
    tipo: "*",
    x: -1,
    y: -1,
    id: -1,
  };

  constructor(
    width: number,
    height: number,
    errorPipe: (_err: string) => void,
    sequence: string,
    mode?: PROTEIN_DISTRIBUTION
  ) {
    this.err = errorPipe;
    //this._size = size;
    this._width = width;
    this._height = height;
    this.matrix = new Array(this._width);
    for (let i = 0; i < this._width; i++) {
      this.matrix[i] = new Array(this._height);
      for (let j = 0; j < this._height; j++)
        this.matrix[i][j] = this.emptyElement;
    }

    this.append(sequence, 0, mode);
  }

  get path() {
    return this._path;
  }

  add_to_path(x: number, y: number, c: string) {
    this._path.push(new pVector(x, y, c));
  }

  set(el: hydro, x: number, y: number): boolean {
    if (this.matrix[x][y].id != -1) {
      this.err(`There is already an element in this position [${x},${y}]`);
      return false;
    }

    if (x < 0 || y < 0) {
      this.err(`Negative position isn't supported by the matrix! [${x},${y}]`);
      return false;
    }

    if (x >= this._width || y >= this._height) {
      this.err(`Matrix out of bounds! [${x},${y}]`);
      return false;
    }

    if (el == undefined || el == null) {
      this.err(`Tried to set an undefined element to the matrix! [${x},${y}]`);
      return false;
    }

    this.matrix[x][y] = el;
    return true;
  }

  append(
    sequence: string,
    start?: number,
    mode?: PROTEIN_DISTRIBUTION
  ): boolean {
    if (start == null) start = 0;
    // if (sequence.length + start > this._width * this._width) {
    //   this.err(`The sequence is too long for the matrix`);
    //   return false;
    // }

    if (
      (mode ?? PROTEIN_DISTRIBUTION.SEQUENTIAL) == PROTEIN_DISTRIBUTION.PATH
    ) {
      return this.append_with_path(sequence);
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
      this.add_to_path(x, y, sequence[i]);
      x++;
      if (x >= this._width) {
        x = 0;
        y++;
        //console.log(`x ${x} y ${y}`);
      }
    }
    return true;
  }

  append_with_path(sequence: string): boolean {
    //first we discover how to best represent the matrix
    //our goal is to have a square matrix as often as possible
    //in the case were the matrix isn't square, we have to approximate

    //defaults

    class vec2 {
      public x: number = 0;
      public y: number = 0;

      constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
      }

      move(_x: number, _y: number) {
        this.x += _x;
        this.y += _y;
      }
    }

    const lenght: number = sequence.length;
    let pos: vec2 = new vec2(this._width - 1, -1);
    //console.log(`Pos ${pos.x} ${pos.y}`);

    //sets element in current position with default values
    const place = (el: string, id: number): boolean => {
      this.add_to_path(pos.x, pos.y, el);
      return this.set(
        {
          charge: 0,
          x: pos.x,
          y: pos.y,
          id: id,
          tipo: el,
        },
        pos.x,
        pos.y
      );
    };

    //stores the possible ways to represent the matrix
    //i.e 15 could be represented as 3 x 5
    let pairs: Array<number> = [];

    if (lenght < 1) {
      this.err("Error representing matrix, lenght is less or equal to 0");
      return false;
    }

    for (let i = 1; i <= Math.sqrt(lenght); i++) {
      //if length is divisible by i
      if (lenght % i == 0) {
        //case where the number is square (i.e 16 = 4 x 4)
        if (i == lenght / i) pairs.push(i);
        else {
          pairs.push(i); //first component
          pairs.push(lenght / i); //second component | i.e [5,3] = 15
        }
      }
    }

    //if matrix is square, rx = ry
    let ry = Math.ceil(Math.sqrt(lenght));
    let rx = Math.floor(Math.sqrt(lenght));
    if (rx != ry) {
      //case where the matrix isn't square, i.e sqrt(15) => 3 != 4
      if (pairs.length < 2) {
        this.err(`Error decomposing matrix, pairs length < 2.`);
        return false;
      }
      ry = pairs[pairs.length - 1];
      rx = pairs[pairs.length - 2];
    }

    // console.log(`[info] l ${lenght} rx ${rx} ry ${ry}`);

    //---------------------------

    enum Stage {
      down,
      left,
      up,
      right,
    }

    let stage: Stage = Stage.down; //initial state from sequence
    let flag: number = -1;
    let c: number = 1;

    function flag_logic() {
      flag++;
      if (flag == 2) {
        flag = 0;
        ry--;
        rx--;
      }
    }

    let n = 0;
    while (n < lenght) {
      //console.log(`n ${n} pos ${pos.x} ${pos.y} stage ${stage}`);
      c++;
      if (c >= lenght + 1) break;

      if (stage == Stage.down && flag == -1) {
        for (let i = 0; i < ry; i++) {
          pos.move(0, 1);
          place(sequence[n], n);
          n++;
        }
        flag = 0;
        stage = Stage.left;
      } else if (stage == Stage.left) {
        for (let i = 1; i < rx; i++) {
          pos.x--;
          place(sequence[n], n);
          n++;
        }
        stage = Stage.up;

        flag_logic();
      } else if (stage == Stage.up) {
        for (let i = 1; i < ry; i++) {
          pos.y--;
          place(sequence[n], n);
          n++;
        }
        stage = Stage.right;

        flag_logic();
      } else if (stage == Stage.right) {
        for (let i = 1; i < rx; i++) {
          pos.x++;
          place(sequence[n], n);
          n++;
        }
        stage = Stage.down;

        flag_logic();
      } else if (stage == Stage.down) {
        for (let i = 1; i < ry; i++) {
          pos.y++;
          place(sequence[n], n);
          n++;
        }
        stage = Stage.left;

        flag_logic();
      }
    }

    return true;
  }

  maximize(sequence: string) {
    // let wholes = Math.floor(sequence.length / 5);
    // let rest = sequence.length % 5;
    // function local_maximize(local_sequence: string) {
    //   //repeat for eacth block of 5
    //   for (let t = 0; t < wholes; t++) {}
    // }
    // //generate n-ary tree
    // //n = 5
    // let root: nary_tree = new nary_tree(sequence[0]);
    // root.make(root, sequence, 0);
    // console.log(root);
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get protein_matrix(): HydroMatrix {
    return this.matrix;
  }

  process_score(): number {
    let arr = Array<hydro>();
    let score = 0;
    //console.log("Processing");
    //matrix[x][y] <- right order

    //get all Hs in the matrix
    for (let i = 0; i < this._width; i++) {
      for (let j = 0; j < this._height; j++) {
        if (this.matrix[i][j].tipo.toLowerCase() == "h")
          arr.push(this.matrix[i][j]);
      }
    }

    //calculate score for each H
    for (let i = 0; i < arr.length; i++) {
      let local_score = 0;
      //sarch horizontally
      for (let j = 0; j < this._width; j++) {
        if (arr[i].id == this.matrix[j][arr[i].y].id) continue;
        if (this.matrix[j][arr[i].y].tipo.toLowerCase() == "h") {
          let dist = Math.abs(arr[i].x - this.matrix[j][arr[i].y].x);
          local_score += 1 / dist;
          //console.log(
          //  `pinned is ${arr[i].id}, found neighbor at [${j},${arr[i].y}] dist ${dist}`
          //);
        }
      }

      //search vertically
      for (let j = 0; j < this._height; j++) {
        if (arr[i].id == this.matrix[arr[i].x][j].id) continue;
        if (this.matrix[arr[i].x][j].tipo.toLowerCase() == "h") {
          let dist = Math.abs(arr[i].y - this.matrix[arr[i].x][j].y);
          if (dist == 0) continue;
          local_score += 1 / dist;
          //   console.log(
          //     `pinned is ${arr[i].id}, found neighbor at [${j},${arr[i].y}] dist ${dist}`
          //   );
        }
      }

      arr[i].charge = local_score;
      score += local_score;
    }

    return score;
  }
}
