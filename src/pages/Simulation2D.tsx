import React, { MutableRefObject, RefObject, useRef } from "react";
import { useEffect } from "react";
import p5 from "p5";
import { Switch } from "@mantine/core";

import { hydro, HydroMatrix } from "../processing/Protein";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 675;

function Engine(props: { vibrant: boolean; sequence: string; p5ref: any }) {
  let myp5: any = null;
  let p5ref: any = null;

  let radius: number = 30;
  let sequence: string = "";

  p5ref = props.p5ref; //React.createRef()
  sequence = props.sequence;

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
  }, [props.sequence, props.vibrant]);

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

      let x = 80;
      let y = 80;
      let x_limit = CANVAS_WIDTH - 80;
      //let y_limit = CANVAS_HEIGHT - 80;
      for (var i = 0; i < sequence.length; i++) {
        if (sequence[i].toLowerCase() == "h") {
          drawH(x, y, radius);
        } else if (sequence[i].toLowerCase() == "p") {
          drawP(x, y, radius);
        }
        x += 2 * radius;
        if (x > x_limit) {
          x = 80;
          y += 2 * radius;
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

  useEffect(() => {
    console.log("use effect force: " + seq);
  }, [seq]);

  function forceUpdate() {
    setSeq(props.sequence);
    console.log("force update");
  }

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
          <Engine sequence={seq} vibrant={vibrant} p5ref={rf} />
        </div>
        <div style={{ width: "90%", paddingLeft: 20, paddingTop: 20 }}>
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
        </div>
      </div>
    </>
  );
}
