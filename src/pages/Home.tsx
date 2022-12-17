import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { Dropzone } from "@mantine/dropzone";
import { Group, Text, useMantineTheme } from "@mantine/core";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons";
import { tauri } from "@tauri-apps/api";
import { WebviewWindow } from "@tauri-apps/api/window";

interface HomeProps {
  tabFunction: React.Dispatch<React.SetStateAction<string | null>>;
  setSequence: React.Dispatch<React.SetStateAction<string>>;
}

export default function Home(props: HomeProps) {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  async function run() {
    props.tabFunction("simulation");
    //const sim = new WebviewWindow("simulation");
  }

  const theme = useMantineTheme();

  return (
    <>
      <div
        className="container"
        style={{ alignContent: "center", alignItems: "center" }}
      >
        <h1>Welcome to HydroCpp!</h1>
        <div className="row">
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo vite" alt="Vite logo" />
          </a>
        </div>
        <div className="row">
          <div>
            <input
              id="greet-input"
              onChange={(e) => props.setSequence(e.currentTarget.value)}
              placeholder="Enter a sequence..."
              value={"ppphhhhhphph"}
            />
            <button type="button" onClick={() => run()}>
              Run
            </button>
          </div>
        </div>

        {/* ----------------------------------------- */}

        <Dropzone
          onDrop={(files) => console.log("accepted files", files)}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={3 * 1024 ** 2}
          style={{
            marginTop: 30,
            width: 430,
            height: 280,
            backgroundColor: "rgb(64,64,64)",
          }}
        >
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 220, pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload
                size={50}
                stroke={1.5}
                color={
                  theme.colors[theme.primaryColor][
                    theme.colorScheme === "dark" ? 4 : 6
                  ]
                }
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size={50}
                stroke={1.5}
                color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={50} stroke={1.5} />
            </Dropzone.Idle>

            <div>
              <Text size="sm" color="dimmed" inline mt={7}>
                Drop sequence files here!
              </Text>
            </div>
          </Group>
        </Dropzone>

        {/* <p>{greetMsg}</p> */}
      </div>
    </>
  );
}
