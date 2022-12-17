import React from "react";

export const Context = React.createContext({});

const initialState = {
  seq: "ppphppphhhppphp",
  vibrant: false,
  example_sim: (s: string) => {},
  go_home: () => {},
  set_matrix_size: () => {},
};

interface Props {
  children: React.ReactNode;
}

const Store = ({ children, ...props }: Props) => {
  const [state, setState] = React.useState(initialState);

  return (
    <Context.Provider value={[state, setState]}>{children}</Context.Provider>
  );
};

export default Store;
