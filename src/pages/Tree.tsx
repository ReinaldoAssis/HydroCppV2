import { Group, Text } from "@mantine/core";
import { randInt } from "three/src/math/MathUtils";
import { pVector } from "../processing/Protein";

interface NAryTreeProps {
  tree: Array<pVector>;
  showTitle?: boolean;
}

export default function NAryTree(props: NAryTreeProps) {
  //down, left, up, right
  return (
    <div
      style={{
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {props.showTitle && <h3>N-ary Tree</h3>}
      {props.tree.map((node, index) => {
        let h = node.c.toLowerCase() == "h";

        return (
          <div style={{ width: "fit-content", margin: 0 }}>
            <Text
              className={h ? "blueSeq" : "redSeq"}
              size="xl"
              color={h ? "blue" : "red"}
            >
              {node.c.toUpperCase()}
            </Text>
          </div>
        );
      })}
    </div>
  );
}
