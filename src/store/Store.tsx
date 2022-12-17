import React from "react";

export interface State {
  seq?: string;
  vibrant?: boolean;
  example_sim?: (s: string) => void;
  go_home?: () => void;
  set_matrix_size?: (s: string) => void;
  random_sim?: () => void;
  text_file?: string;
}

export let globalState: State = {
  seq: "ppphppphhhppphp",
  vibrant: false,
  example_sim: (s: string) => {},
  go_home: () => {},
  set_matrix_size: () => {},
};

// interface Props {
//   children: React.ReactNode;
// }

// const Store = ({ children, ...props }: Props) => {
//   return <>{children}</>;
// };

// export default Store;
