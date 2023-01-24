import ConfigurationSettings from "../types/configurationSettings";
import {
  $,
  $$,
  redraw,
  once,
  setVar,
} from './utilities';
import domtoimage from "dom-to-image-more";
import { vscode } from "../utilities/vscode";

const windowNode = $('#window');
const snippetContainerNode = $('#snippet-container');

const flashFx = $('#flash-fx');

const SNAP_SCALE = 2;

export const cameraFlashAnimation = async () => {
  flashFx.style.display = 'block';
  redraw(flashFx);
  flashFx.style.opacity = '0';
  await once(flashFx, 'transitionend');
  flashFx.style.display = 'none';
  flashFx.style.opacity = '1';
};

export const takeSnap = async (config: ConfigurationSettings) => {
  windowNode.style.resize = 'none';
  if (config.transparentBackground || config.target === 'window') {
    setVar('container-background', 'transparent');
  }

  // let currentZoom = getVar('preview-zoom');
  setVar('preview-zoom', 1.0);
  const target = config.target === 'container' ? snippetContainerNode : windowNode;
  const options: DomToImage.Options = {
    bgcolor: 'transparent',
    width: target.clientWidth * SNAP_SCALE,
    height: target.clientHeight * SNAP_SCALE,
    style: {},
    // postProcess: (node: any) => {
    //   $$('#snippet-container, #snippet, .line, .line-code span', node).forEach(
    //     (span: any) => (span.style.width = 'unset')
    //   );
    //   $$('.line-code', node).forEach((span: any) => (span.style.width = '100%'));
    // }
  };

  const url = await domtoimage.toPng(target, options);

  const data = url.slice(url.indexOf(',') + 1);
  if (config.shutterAction === 'copy') {
    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    const blob = new Blob([array], {
      type: 'image/png'
    });
    navigator.clipboard.write([new ClipboardItem({
      'image/png': blob
    })]);
    cameraFlashAnimation();
  } else {
    vscode.postMessage({
      type: config.shutterAction,
      data
    });
  }

  windowNode.style.resize = 'horizontal';
  setVar('container-background', config.containerBackground);
  // setVar('preview-zoom', currentZoom);
};
