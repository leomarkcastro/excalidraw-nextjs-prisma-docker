import { trpc } from '@/lib/server/trpc';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
const ExcalidrawExportCanvas = dynamic(
  () => import('@/components/excalidraw/export-canvas'),
  {
    ssr: false,
  }
);

export default function App(props: { page_id: string; content_id: string }) {
  const isCloudFetched = !!props.page_id;
  const [canvasUrl, setCanvasUrl] = useState<SVGSVGElement | null>(null);
  const svg = useRef<HTMLDivElement>(null);
  const uriSave = trpc.excalidraw.uri_save.useMutation();

  function serializeSvgString(svg: SVGSVGElement) {
    const svgString = new XMLSerializer().serializeToString(svg);
    console.log(svgString);
    return svgString;
  }

  const pageGetLatest = trpc.excalidraw.content_get.useQuery(
    {
      pageId: props.page_id,
      contentId: props.content_id,
    },
    {
      enabled: isCloudFetched,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retryOnMount: false,
    }
  );

  return (
    <div className="h-screen w-screen overflow-hidden p-8">
      <ExcalidrawExportCanvas
        exportOptions={{
          appState: {
            viewBackgroundColor: '#ffffff00',
            exportWithDarkMode: true,
          },
        }}
        loadData={async () => {
          const { data } = await pageGetLatest;
          if (!data) {
            return {
              appState: null,
              contents: null,
              files: null,
            };
          }
          const { content } = data;
          const { appState, content: contents, files } = content;
          return {
            appState: appState,
            contents: contents,
            files: files,
          };
        }}
        autoLoad={true}
        onCreate={async (url) => {
          const svgString = serializeSvgString(url as SVGSVGElement);
          const result = await uriSave.mutateAsync({
            uri: svgString,
          });
          // redirect to new page via location.href
          window.location.href = `view/${result}`;

          // const svg = parsingSvgString(svgString);
          setCanvasUrl(svg as unknown as SVGSVGElement);
        }}
      />
      <div className="relative h-full w-full">
        <div ref={svg} className="h-full w-full" />
      </div>
      {!canvasUrl && (
        <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
          <div className="text-2xl text-gray-400">Loading...</div>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  const page_id = context.query.page as string;
  const content_id = context.query.version as string;

  return {
    props: {
      page_id: page_id ?? null,
      content_id: content_id ?? null,
    },
  };
};
