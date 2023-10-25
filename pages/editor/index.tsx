import SaveLocalFileModal from '@/components/list-page/save-local-modal';
import UpdatePageModal from '@/components/list-page/update-page-modal';
import { trpc } from '@/lib/server/trpc';
import { ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const ExcalidrawComponent = dynamic(() => import('@/components/excalidraw'), {
  ssr: false,
});
const VersionHistory = dynamic(
  () => import('@/components/excalidraw/version-history'),
  {
    ssr: false,
  }
);

const saveEvery = 0.25 * 1000;

export default function App(props: { page_id: string; content_id: string }) {
  const isCloudFetched = !!props.page_id;
  const router = useRouter();
  const user = useSession();
  const contentUpdate = trpc.excalidraw.content_update.useMutation();
  const pageUpdate = trpc.excalidraw.page_update.useMutation();
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
  const [shouldSave, setShouldSave] = useState(props.content_id ? false : true);

  const [excalidrawRef, setExcalidrawRef] = useState<any>(null);
  const [lastSavedScene, setLastSavedScene] = useState<any>(null);
  const lastSave = useRef(Date.now());
  const declaredShortcuts = useRef(false);

  async function onChangeCloud() {
    if (!user.data?.user) return;
    if (!excalidrawRef) return;
    if (!shouldSave) return;
    if (!props.page_id) return;
    if (pageGetLatest.isLoading) return;
    if (Date.now() - lastSave.current < saveEvery) return;
    lastSave.current = Date.now();

    const elements = excalidrawRef.getSceneElements();
    const files = excalidrawRef.getFiles();
    const appState = excalidrawRef.getAppState();

    const elements_stringified = JSON.stringify(elements);
    const files_stringified = JSON.stringify(files);
    const appState_stringified = JSON.stringify(appState);

    const cachedState =
      elements_stringified + appState_stringified + files_stringified;

    if (cachedState === lastSavedScene) return;
    setLastSavedScene(cachedState);
    // remove version query param without reloading
    window.history.replaceState({}, '', `/editor?page=${props.page_id}`);
    const update = await contentUpdate.mutateAsync({
      pageId: props.page_id as string,
      content: elements_stringified,
      files: files_stringified,
      appState: appState_stringified,
    });
  }

  async function onChangeLocal() {
    if (!excalidrawRef) return;
    if (Date.now() - lastSave.current < saveEvery) return;
    lastSave.current = Date.now();

    const elements = excalidrawRef.getSceneElements();
    const files = excalidrawRef.getFiles();
    const appState = excalidrawRef.getAppState();

    const elements_stringified = JSON.stringify(elements);
    const files_stringified = JSON.stringify(files);
    const appState_stringified = JSON.stringify(appState);

    const cachedState =
      elements_stringified + appState_stringified + files_stringified;

    if (cachedState === lastSavedScene) return;
    setLastSavedScene(cachedState);
    localStorage?.setItem('excalidraw_elements', elements_stringified);
    localStorage?.setItem('excalidraw_files', files_stringified);
    localStorage?.setItem('excalidraw_appState', appState_stringified);
  }

  function fetchLocalSaved() {
    const localStorage = typeof window !== 'undefined' && window.localStorage;
    if (!localStorage)
      return {
        elements: [] as ExcalidrawInitialDataState['elements'],
        files: [] as any,
        appState: {} as ExcalidrawInitialDataState['appState'],
      };
    const elements = localStorage?.getItem('excalidraw_elements');
    const files = localStorage?.getItem('excalidraw_files');
    const appState = localStorage?.getItem('excalidraw_appState');
    return {
      elements: (elements
        ? JSON.parse(elements)
        : []) as ExcalidrawInitialDataState['elements'],
      files: (files
        ? JSON.parse(files)
        : []) as ExcalidrawInitialDataState['files'],
      appState: (appState
        ? JSON.parse(appState)
        : {}) as ExcalidrawInitialDataState['appState'],
    };
  }

  async function onChange() {
    if (isCloudFetched) {
      return onChangeCloud();
    } else {
      return onChangeLocal();
    }
  }

  useEffect(() => {
    // listen for keyboard shortcuts
    if (!excalidrawRef) return;
    if (declaredShortcuts.current) return;
    declaredShortcuts.current = true;

    // ctrl + shift + alt click
    const save = (e: KeyboardEvent) => {
      if (e.altKey && e.ctrlKey && e.shiftKey) {
        e.preventDefault();

        excalidrawRef.setToast({
          message: 'Saved',
          timeout: 500,
          duration: 1000,
        });
        onChange();
      }

      // ctrl+shift+q
      if (e.code === 'KeyQ' && e.ctrlKey && e.shiftKey) {
        e.preventDefault();

        router.push('/');
      }
    };

    window.addEventListener('keydown', save);
  }, [excalidrawRef]);

  if (isCloudFetched && pageGetLatest.isLoading) {
    return (
      <div className="relative flex h-screen w-screen items-center justify-center">
        <div className="tranform absolute top-1/2 left-1/2 h-fit w-fit -translate-x-1/2 -translate-y-1/2 rounded-md p-2">
          <p className="animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  function fetchOnlineSaved() {
    return {
      files: JSON.parse(
        pageGetLatest.data?.content?.files ?? '[]'
      ) as ExcalidrawInitialDataState['files'],
      elements: JSON.parse(
        pageGetLatest.data?.content?.content ?? '[]'
      ) as ExcalidrawInitialDataState['elements'],
      appState: JSON.parse(
        pageGetLatest.data?.content?.appState ?? '{}'
      ) as ExcalidrawInitialDataState['appState'],
    };
  }

  function fetchData() {
    let toRet;
    if (isCloudFetched) {
      toRet = fetchOnlineSaved();
    } else {
      toRet = fetchLocalSaved();
    }

    //
    if (Object.keys(toRet.appState?.collaborators ?? {})) {
      if (toRet.appState?.collaborators) {
        // @ts-ignore
        toRet.appState.collaborators = undefined;
      }
    }

    return toRet;
  }

  return (
    <>
      <div className="relative flex h-screen w-screen items-center justify-center">
        {!excalidrawRef && (
          <div className="tranform absolute top-1/2 left-1/2 h-fit w-fit -translate-x-1/2 -translate-y-1/2 rounded-md p-2">
            <p className="animate-pulse">Loading...</p>
          </div>
        )}
        <ExcalidrawComponent
          theme="dark"
          // handleKeyboardGlobally={true}
          setItemRef={setExcalidrawRef}
          isPublic={pageGetLatest.data?.isPublic ?? false}
          isAuthed={user.status === 'authenticated'}
          isCloudFetched={isCloudFetched}
          initialData={fetchData()}
          onChange={onChange}
          lastSaved={
            !isCloudFetched
              ? 'Local Saved'
              : !user.data?.user
              ? 'Public View'
              : 'Last Saved ' +
                new Date(
                  lastSave.current ?? pageGetLatest.data?.content.updatedAt ?? 0
                ).toLocaleTimeString()
          }
          shouldSave={shouldSave}
          setShouldSave={setShouldSave}
          documentName={
            <>
              {isCloudFetched && user.status === 'authenticated' && (
                <label htmlFor="update-page" className="cursor-pointer text-sm">
                  {pageGetLatest.data?.documentName ?? 'Untitled'}
                </label>
              )}
            </>
          }
          versionHistoryComponent={<VersionHistory pageId={props.page_id} />}
          save={onChange}
        />
      </div>
      <UpdatePageModal
        updatePage={async (data) => {
          await pageUpdate.mutateAsync({
            pageId: props.page_id,
            ...data,
          });
          pageGetLatest.refetch();
          // router.reload();
        }}
        pageId={props.page_id}
      />
      <SaveLocalFileModal
        content={JSON.stringify(excalidrawRef?.getSceneElements())}
        files={JSON.stringify(excalidrawRef?.getFiles())}
        appState={JSON.stringify(excalidrawRef?.getAppState())}
      />
    </>
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
