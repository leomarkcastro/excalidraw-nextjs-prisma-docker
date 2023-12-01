import { trpc } from '@/lib/server/trpc';
import dynamic from 'next/dynamic';
import { useState } from 'react';
const ExcalidrawExportCanvas = dynamic(
  () => import('@/components/excalidraw/export-canvas'),
  {
    ssr: false,
  }
);

export default function App(props: { uriID: string }) {
  const [canvasUrl, setCanvasUrl] = useState<SVGSVGElement | null>(null);
  const uriSave = trpc.excalidraw.uri_get.useQuery({
    uriId: props.uriID,
  });

  function parsingSvgString(svgString: string) {
    // parse svgstring to svg
    const parser = new DOMParser();
    const dom = parser.parseFromString(svgString, 'image/svg+xml');
    // get svg element
    const svg = dom.getElementsByTagName('svg')[0];
    return svg;
  }

  if (!uriSave.data) {
    return <></>;
  }

  const svgString = uriSave.data;
  const svgElement = parsingSvgString(svgString.uri);
  // set svg width and height to fit screen
  svgElement.setAttribute('width', `100%`);
  svgElement.setAttribute('height', `100%`);
  // declare fonts inside svg
  const style = document.createElement('style');
  style.innerHTML = `
    @font-face {
      font-family: 'Virgil';
      src: url('/fonts/Virgil.woff2') format('woff2');
    }
  `;
  svgElement.appendChild(style);

  return (
    <div className="h-screen w-screen overflow-hidden p-8">
      {/* unsafely set html of div */}
      <div
        className="h-full w-full"
        dangerouslySetInnerHTML={{ __html: svgElement.outerHTML }}
      ></div>
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  // get uriID from param
  const { uriID } = context.params;

  return {
    props: {
      uriID,
    },
  };
};
