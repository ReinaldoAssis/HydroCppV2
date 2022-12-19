import { Group, Text } from "@mantine/core";
import { randInt } from "three/src/math/MathUtils";
import { nary_tree } from "../processing/Protein";

interface NAryTreeProps {
  tree: string;
  showTitle?: boolean;
}

export default function NAryTree(props: NAryTreeProps) {
  //down, left, up, right
  return (
    <div>
      {props.showTitle && <h3>N-ary Tree</h3>}
      <Group>
        {/* {props.tree.split("").map((char, index) => {
          return <></>;
        })} */}
      </Group>
    </div>
  );
}
