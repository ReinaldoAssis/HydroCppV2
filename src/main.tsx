import { NotificationsProvider } from "@mantine/notifications";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import React, { createContext, useContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { globalState } from "./store/Store";
import "./style.css";

const actions: SpotlightAction[] = [
  // {
  //   title: "Home",
  //   description: "Get to home page",
  //   onTrigger: () => console.log("Home"),
  //   // icon: <IconHome size={18} />,
  // },
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
      globalState.example_sim?.("ppphppphhhppphp");
    },

    // icon: <IconFileText size={18} />,
  },
  {
    title: "Run random simulation",
    description: "Random protein sequence | alias: 'rsim'",
    onTrigger: () => {
      globalState.random_sim?.();
    },

    // icon: <IconFileText size={18} />,
  },
  {
    title: "Toggle sequence",
    description: "Show/hide protein sequence | alias: 'seq'",
    onTrigger: () => {
      globalState.show_sequence?.();
    },

    // icon: <IconFileText size={18} />,
  },
  {
    title: "Randomize random size",
    description: "Set random size as a random number | alias: 'rnd'",
    onTrigger: () => {
      let rnd = Math.floor(Math.random() * 20);
      if (rnd < 10) {
        let a = rnd * 2 + 2;
        let b = rnd * (rnd + 2);
        rnd = Math.sqrt(a * a + b * b);
      } else {
        rnd = Math.floor(Math.random() * 200);
      }
      globalState.rndSize = rnd;
      globalState.random_sim?.();
    },

    // icon: <IconFileText size={18} />,
  },
  {
    title: "Generate Tree",
    description: "Generate and display n-ary tree | alias: 'tree'",
    onTrigger: () => {
      globalState.show_tree?.();
    },

    // icon: <IconFileText size={18} />,
  },
];

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SpotlightProvider
      highlightQuery
      shortcut={["mod + P", "mod + K", "/"]}
      actions={actions}
    >
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </SpotlightProvider>
  </React.StrictMode>
);
