import { exportToSvg } from '@excalidraw/excalidraw';
import { AppState } from '@excalidraw/excalidraw/types/types';
import { useEffect } from 'react';

export default function ExcalidrawExport({
  loadData,
  onCreate,
  exportOptions,
  autoLoad,
}: {
  loadData: () => Promise<{
    appState: string | null;
    contents: string | null;
    files: string | null;
  }>;
  onCreate: (url: string | SVGSVGElement) => void;
  exportOptions?: {
    maxWidthOrHeight?: number;
    getDimensions?: () => { width: number; height: number };
    exportPadding?: number;
    appState?: Partial<AppState>;
  };
  autoLoad?: boolean;
  children?: React.ReactNode;
}) {
  async function loadCanvas() {
    const { appState, contents, files } = await loadData();
    const j_appState = JSON.parse(appState ?? '{}');
    const j_contents = JSON.parse(contents ?? '[]');
    const j_files = JSON.parse(files ?? '{}');
    const canvas = await exportToSvg({
      elements: j_contents,
      appState: {
        ...j_appState,
        ...(exportOptions?.appState ?? {}),
      },
      files: j_files,
    });
    onCreate(canvas);
  }

  useEffect(() => {
    if (autoLoad) {
      loadCanvas();
    }
  }, []);

  return <></>;
}
