import React, { MutableRefObject, RefObject, useRef } from "react";
import { useEffect } from "react";
import p5 from "p5";
import { Stack, Switch, Text } from "@mantine/core";

import Protein, { hydro, HydroMatrix } from "../processing/Protein";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 675;

function Engine(props: { vibrant: boolean; matrix: HydroMatrix; p5ref: any }) {
  let myp5: any = null;
  let p5ref: any = null;

  let radius: number = 30;
  let matrix: HydroMatrix;

  p5ref = props.p5ref; //React.createRef()
  matrix = props.matrix;

  useEffect(() => {
    if (document.getElementsByClassName("p5Canvas").length == 1)
      document.getElementsByClassName("p5Canvas")[0].remove();

    if (
      myp5 == null &&
      p5ref.current != null &&
      document.getElementsByClassName("p5Canvas").length == 0
    )
      //       // test if already initialized
      myp5 = new p5(Sketch, p5ref.current) as any;

    //     console.log(this.sequence);
  }, [props.matrix, props.vibrant]);

  let Sketch = (sketch: any) => {
    sketch.setup = () => {
      var canv = sketch.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
      canv.parent("canvas");
    };

    sketch.draw = () => {
      sketch.background(40, 40, 40);
      let vibrant = props.vibrant;

      function drawH(x: number, y: number, radius: number) {
        if (vibrant) sketch.fill(53, 106, 255);
        else sketch.fill(90, 90, 90);

        sketch.noStroke();
        sketch.ellipse(x, y, radius, radius);
      }

      function drawP(x: number, y: number, radius: number) {
        if (vibrant) sketch.fill(255, 43, 64);
        else sketch.fill(200, 200, 200);

        sketch.noStroke();
        sketch.ellipse(x, y, radius, radius);
      }

      let space = 5;
      let offset = 30;

      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j].tipo.toLowerCase() == "h")
            drawH(
              i * (radius + space) + offset,
              j * (radius + space) + offset,
              radius
            );
          else if (matrix[i][j].tipo.toLowerCase() == "p")
            drawP(
              i * (radius + space) + offset,
              j * (radius + space) + offset,
              radius
            );
        }
      }
    };
  };

  return <></>;
  //   return <div ref={p5ref}></div>;
}

interface SimulationProps {
  sequence: string;
}

export default function Simulation2D(props: SimulationProps) {
  const [seq, setSeq] = React.useState(props.sequence);
  const [vibrant, setVibrant] = React.useState(false);

  const rf = React.useRef();

  useEffect(() => {}, [seq]);

  function forceUpdate() {
    setSeq(props.sequence);
  }

  function logger(err: string) {
    console.log(err);
  }

  //TODO: add custom size
  let protein: Protein = new Protein(5, logger, seq);

  return (
    <>
      <div className="row">
        <div
          style={{
            width: "80vw",
            height: "90vh",
            backgroundColor: "rgb(40,40,40)",
          }}
          id="canvas"
          ref={rf as unknown as RefObject<HTMLDivElement>}
        >
          <Engine
            matrix={protein.protein_matrix}
            vibrant={vibrant}
            p5ref={rf}
          />
        </div>
        <div style={{ width: "90%", paddingLeft: 20, paddingTop: 20 }}>
          <Stack>
            <button
              type="button"
              onClick={() => forceUpdate()}
              style={{ marginBottom: 10 }}
            >
              Run
            </button>
            <Switch
              label="Vibrant"
              size="md"
              checked={vibrant}
              onChange={(event) => setVibrant(event.currentTarget.checked)}
            />
            <Text size="xl">
              Score{" "}
              {Math.round((protein.process_score() + Number.EPSILON) * 100) /
                100}{" "}
            </Text>
          </Stack>
        </div>
      </div>
    </>
  );
}
