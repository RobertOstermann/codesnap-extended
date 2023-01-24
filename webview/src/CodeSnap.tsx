import "./codeSnap.css";
import { useEffect, useState } from "react";
import Snippet, { pasteCode } from "./components/snippet";
import logo from './images/icon.png';
import Button from "@mui/material/Button";
import { CheckBoxRounded, CheckBoxOutlineBlankRounded } from "@mui/icons-material";
import { Stack } from "@mui/material";
import ConfigurationSettings from "./types/configurationSettings";
import { setVar } from "./utilities/utilities";
import { vscode } from "./utilities/vscode";

export default function CodeSnap() {
  const [data, setData] = useState<any>(false);
  const [lineNumbers, setLineNumbers] = useState(false);

  const updateConfigurationSettings = (configuration: ConfigurationSettings) => {
    console.log("update");
    setVar('ligatures', configuration.fontLigatures ? 'normal' : 'none');
    setVar('letter-spacing', configuration.letterSpacing);
    setVar('tab-size', configuration.tabSize);
    setVar('container-background', configuration.containerBackground);
    setVar('box-shadow', configuration.boxShadow);
    setVar('container-padding', configuration.containerPadding);
    setVar('window-border-radius', configuration.windowBorderRadius);
    setVar('preview-zoom', "0.75");

    if (typeof configuration.fontLigatures === 'string') {
      setVar('font-features', configuration.fontLigatures);
    }

    if (configuration.windowControlStyle === "Gray dots") {
      setVar('red-dot-background', "#555555");
      setVar('yellow-dot-background', "#555555");
      setVar('green-dot-background', "#555555");
    } else {
      setVar('red-dot-background', "#ff5f5a");
      setVar('yellow-dot-background', "#ffbe2e");
      setVar('green-dot-background', "#2aca44");
    }

    document.addEventListener('paste', (event) => {
      pasteCode(configuration, event.clipboardData);
    });

    document.execCommand('paste');
  };

  const onMessage = (event: any) => {
    const data: ConfigurationSettings = event?.data;
    console.log(data.type);
    switch (data.type) {
      case "update":
        updateConfigurationSettings(data);
        break;

      default:
        break;
    }
    setData(true);
  };

  useEffect(() => {
    console.log("message");
    window.addEventListener('message', onMessage);

    // vscode.postMessage({
    //   type: "getSettings",
    //   data: "Retrieve Configuration Settings",
    // });

    return () => {
      window.removeEventListener('message', onMessage);
    };
  });

  function postMessage() {
    vscode.postMessage({
      type: "getSettings",
      data: "Hey there partner! 🤠",
    });
  }

  return (
    <main>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        className="stack"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setLineNumbers(!lineNumbers)}
          startIcon={data ? <CheckBoxRounded /> : <CheckBoxOutlineBlankRounded />}
        >
          Line Numbers
        </Button>
        <img src={logo} alt="snap" className="shutter" />
        <Button
          variant="contained"
          color="primary"
          onClick={() => postMessage()}
          startIcon={lineNumbers ? <CheckBoxRounded /> : <CheckBoxOutlineBlankRounded />}
        >
          Line Numbers
        </Button>
      </Stack>
      <Snippet />
      <div id="flash-fx"></div>
      <div id="console-log"></div>
    </main >
  );
}
