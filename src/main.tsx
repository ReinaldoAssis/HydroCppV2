import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import React, { createContext, useContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Store, { Context } from "./store/Store";
import "./style.css";

const Root = () => {
  // const [state, setState] = useContext(Context);

  const actions: SpotlightAction[] = [
    {
      title: "Home",
      description: "Get to home page",
      onTrigger: () => console.log("Home"),
      // icon: <IconHome size={18} />,
    },
    {
      title: "Set custom matrix size",
      description: "Get full information about current system status",
      onTrigger: () => console.log("Dashboard"),
      // icon: <IconDashboard size={18} />,
    },
    {
      //ppphppphhhppphp
      title: "Run basic simulation",
      description: "Example simulation",
      onTrigger: () => {
        console.log("Running example");
        // Config.example_sim("ppphppphhhppphp");
      },
      // icon: <IconFileText size={18} />,
    },
  ];

  return (
    <Store>
      <SpotlightProvider
        shortcut={["mod + P", "mod + K", "/"]}
        actions={actions}
      >
        <App />
      </SpotlightProvider>
    </Store>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
