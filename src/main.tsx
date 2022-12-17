import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";

export let Config = {
  example_sim: (s: string) => {},
  go_home: () => {},
  set_matrix_size: () => {},
};

const Root = () => {
  const UserContext = createContext(Config);

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
        Config.example_sim("ppphppphhhppphp");
      },
      // icon: <IconFileText size={18} />,
    },
  ];

  return (
    <SpotlightProvider shortcut={["mod + P", "mod + K", "/"]} actions={actions}>
      <UserContext.Provider value={Config}>
        <App />
      </UserContext.Provider>
    </SpotlightProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
