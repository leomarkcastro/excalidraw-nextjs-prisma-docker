import { Excalidraw, Footer, MainMenu, Sidebar } from '@excalidraw/excalidraw';
import React, { useState } from 'react';
import { GoArchive, GoListUnordered } from 'react-icons/go';
import MainMenuComponent from './main-menu';

export type ExcalidrawProps = React.ComponentProps<typeof Excalidraw> & {
  setItemRef?: (ref: any) => void;
  lastSaved?: string;
  shouldSave?: boolean;
  setShouldSave?: (shouldSave: boolean) => void;
  documentName?: React.ReactNode;
  versionHistoryComponent?: React.ReactNode;
  save?: () => void;
  isPublic?: boolean;
  isAuthed?: boolean;
  isCloudFetched?: boolean;
};

export default function ExcalidrawComponent(props: ExcalidrawProps) {
  const [excalidrawRef, setExcalidrawRef] = useState<any>(null);
  const [docked, setDocked] = useState(false);

  // @ts-ignore
  return (
    <Excalidraw
      {...props}
      ref={(api) => {
        setExcalidrawRef(api);
        props.setItemRef?.(api);
      }}
      renderTopRightUI={() => {
        return (
          <div className="hidden sm:contents">
            {props.isAuthed && !props.shouldSave && (
              <button
                className="rounded-lg border border-neutral-600 bg-base-300 px-2 text-xs"
                onClick={() => props.setShouldSave?.(true)}
              >
                Overwrite
              </button>
            )}
            {props.lastSaved && (
              <Sidebar.Trigger
                name={
                  props.isAuthed && props.isCloudFetched
                    ? 'version-history'
                    : ''
                }
                tab="one"
                className="ml-2 px-2 pt-1"
              >
                {props.lastSaved}
              </Sidebar.Trigger>
            )}
            {props.isAuthed && !props.isCloudFetched && (
              <label
                htmlFor="save-local-file"
                className="cursor-pointer rounded-lg border border-neutral-600 bg-base-300 p-1 pt-[0.5rem] text-xs text-neutral-300 hover:bg-base-200"
              >
                Save to Cloud
              </label>
            )}
          </div>
        );
      }}
      UIOptions={{
        dockedSidebarBreakpoint: 0,
        canvasActions: {
          export: {
            onExportToBackend: !props.isPublic
              ? undefined
              : async (exportedElements, appState, files, canvas) => {
                  props.save?.();
                  // copy url to clipboard
                  const url = new URL(window.location.href);
                  await navigator.clipboard.writeText(url.toString());
                  alert(`Copied URL to clipboard [${url.toString()}]`);
                },
          },
        },
      }}
    >
      <MainMenuComponent
        isAuthed={props.isAuthed}
        mobileOnlyComponents={
          <>
            {props.isAuthed && props.isCloudFetched && (
              <>
                <MainMenu.Item
                  onSelect={() => {
                    props.save?.();
                    excalidrawRef.setToast({
                      message: 'Saved',
                      timeout: 500,
                      duration: 1000,
                    });
                  }}
                  shortcut="Ctrl+Shift+Alt"
                  icon={<GoArchive />}
                >
                  Save
                </MainMenu.Item>
                <MainMenu.Item
                  onSelect={() => {
                    excalidrawRef.toggleSidebar({
                      name: 'version-history',
                      tab: 'one',
                    });
                  }}
                  shortcut="Ctrl+Shift+V"
                  icon={<GoListUnordered />}
                >
                  Version History
                </MainMenu.Item>
              </>
            )}
          </>
        }
      />

      <Sidebar name="version-history" docked={docked} onDock={setDocked}>
        {props.versionHistoryComponent}
      </Sidebar>

      <Footer>
        <p className="mt-1 ml-2">{props.documentName}</p>
      </Footer>
    </Excalidraw>
  );
}
