import "./App.css";
import { Tabs, useMantineTheme } from "@mantine/core";
import {
  IconBox,
  IconMessageCircle,
  IconPhoto,
  IconSettings,
  IconSmartHome,
} from "@tabler/icons";
import Home from "./pages/Home";
import { useEffect, useState } from "react";
import Simulation from "./pages/Simulation2D";

const DEFAULT_TAB = "simulation";

function App() {
  const theme = useMantineTheme();
  const [activeTab, setActiveTab] = useState<null | string>(DEFAULT_TAB);

  const [sequence, setSequence] = useState<string>("");

  useEffect(() => {}, [sequence]);

  return (
    <Tabs
      variant="pills"
      onTabChange={setActiveTab}
      color="dark"
      radius="sm"
      defaultValue="home"
    >
      <Tabs.List grow>
        <Tabs.Tab
          style={{
            backgroundColor:
              activeTab == "home" ? "rgb(20,20,20)" : "rgb(64,64,64)",
            color: activeTab == "home" ? "white" : "rgb(200,200,200)",
          }}
          value="home"
          icon={<IconSmartHome size={14} />}
        >
          Home
        </Tabs.Tab>
        <Tabs.Tab
          value="simulation"
          icon={<IconBox size={14} />}
          style={{
            backgroundColor:
              activeTab == "simulation" ? "rgb(20,20,20)" : "rgb(64,64,64)",
            color: activeTab == "simulation" ? "white" : "rgb(200,200,200)",
          }}
        >
          Simulation
        </Tabs.Tab>
        <Tabs.Tab
          value="settings"
          icon={<IconSettings size={14} />}
          style={{
            backgroundColor:
              activeTab == "settings" ? "rgb(20,20,20)" : "rgb(64,64,64)",
            color: activeTab == "settings" ? "white" : "rgb(200,200,200)",
          }}
        >
          Settings
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="home" pt="xs">
        <Home tabFunction={setActiveTab} setSequence={setSequence} />
      </Tabs.Panel>

      <Tabs.Panel value="simulation" pt="xs">
        <Simulation sequence={sequence} />
      </Tabs.Panel>

      <Tabs.Panel value="settings" pt="xs">
        Settings tab content
      </Tabs.Panel>
    </Tabs>
  );
}

export default App;
