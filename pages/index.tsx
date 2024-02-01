import Auth from '@/components/auth/Auth';
import DefaultLayout from '@/components/layout/Default.layout';
import { NextPageWithLayout } from '@/components/layout/Layout.types';
import CreateModal from '@/components/list-page/create-modal';
import DeleteModal from '@/components/list-page/delete-modal';
import DeletePageModal from '@/components/list-page/delete-page-modal';
import UpdateModal from '@/components/list-page/update-modal';
import UpdatePageModal from '@/components/list-page/update-page-modal';
import { trpc } from '@/lib/server/trpc';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaCog, FaTrash } from 'react-icons/fa';
import {
  adjectives,
  colors,
  names,
  uniqueNamesGenerator,
} from 'unique-names-generator';

export interface HomePageProps {}

const HomePage: NextPageWithLayout<HomePageProps> = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: notebook_list, refetch: notebook_list_refetch } =
    trpc.excalidraw.notebook_list.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });
  const notebookCreate = trpc.excalidraw.notebook_create.useMutation();
  const notebookUpdate = trpc.excalidraw.notebook_update_details.useMutation();
  const notebookDelete = trpc.excalidraw.notebook_delete.useMutation();
  const pageCreate = trpc.excalidraw.page_create.useMutation();
  const pageDelete = trpc.excalidraw.page_delete.useMutation();
  const pageUpdate = trpc.excalidraw.page_update.useMutation();

  const [hasPendingLocalFiles, setHasPendingLocalFiles] =
    useState<boolean>(false);
  const [notebookToEdit, setNotebookToEdit] = useState<string>('');
  const [notebookToDelete, setNotebookToDelete] = useState<{
    id: string;
    name: string;
  }>({ id: '', name: '' });
  const [pageToEdit, setPageToEdit] = useState<string>('');
  const [pageToDelete, setPageToDelete] = useState<{
    id: string;
    name: string;
  }>({ id: '', name: '' });

  async function createNotebook(vars: { name: string; description: string }) {
    await notebookCreate.mutateAsync({
      name: vars.name,
      description: vars.description,
    });
    notebook_list_refetch();
  }

  async function deleteNotebook(notebook_id: string) {
    await notebookDelete.mutateAsync({
      notebookId: notebook_id,
    });
    notebook_list_refetch();
  }

  useEffect(() => {
    const elements = localStorage?.getItem('excalidraw_elements');
    const files = localStorage?.getItem('excalidraw_files');
    if (elements || files) {
      setHasPendingLocalFiles(true);
    } else {
      setHasPendingLocalFiles(false);
    }
  }, []);

  async function createPage(notebook_id: string) {
    const shortName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, names],
      length: 3,
    });
    const page_id = await pageCreate.mutateAsync({
      name: shortName,
      description: '',
      notebookId: notebook_id,
    });

    router.push(`/editor?page=${page_id}`);
  }

  async function deletePage(page_id: string) {
    await pageDelete.mutateAsync({
      pageId: page_id,
    });
    notebook_list_refetch();
  }

  const [search, setSearch] = useState<string>('');

  // filter notebook and pages
  const _filtered_notebook_list = notebook_list?.filter((notebook) => {
    const isNotebookName = notebook.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const isPageName = notebook.Pages.some((page) => {
      return page.name.toLowerCase().includes(search.toLowerCase());
    });
    const isNotebookDescription = notebook.description
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const isPageDescription = notebook.Pages.some((page) => {
      return page.description?.toLowerCase().includes(search.toLowerCase());
    });
    return (
      isNotebookName || isPageName || isNotebookDescription || isPageDescription
    );
  });

  const filtered_notebook_list = notebook_list?.reduce((acc, notebook) => {
    const isNotebookName = notebook.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const isPageName = notebook.Pages.some((page) => {
      return page.name.toLowerCase().includes(search.toLowerCase());
    });
    const isNotebookDescription = notebook.description
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const isPageDescription = notebook.Pages.some((page) => {
      return page.description?.toLowerCase().includes(search.toLowerCase());
    });
    if (
      isNotebookName ||
      isPageName ||
      isNotebookDescription ||
      isPageDescription
    ) {
      // filter notebook pages
      const filtered_pages = notebook.Pages.filter((page) => {
        const isPageName = page.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const isPageDescription = page.description
          ?.toLowerCase()
          .includes(search.toLowerCase());
        return isPageName || isPageDescription;
      });
      if (filtered_pages.length > 0) {
        acc.push({ ...notebook, Pages: filtered_pages });
      } else {
        acc.push(notebook);
      }
    }
    return acc;
  }, [] as any);

  return (
    <>
      <div className="mx-auto mb-24 max-w-screen-lg px-6 pt-16">
        <div className="flex flex-col items-end justify-between sm:flex-row sm:items-center">
          <h1 className="text-4xl font-bold">
            Personal <Link href="https://excalidraw.com">Excalidraw</Link>
          </h1>
          <Auth />
        </div>
        <br />
        <div className="flex items-center gap-2 py-4">
          <p className="text-xl">Shortcuts: </p>
          <Link
            href="/editor"
            className="bg-primary text-sm text-primary-content"
          >
            Quick Page
          </Link>
        </div>
        {hasPendingLocalFiles && (
          <div className="mb-4">
            <h2 className="text-2xl">
              Pending Local Page
              <Link
                href="/editor"
                className="ml-8 bg-primary text-sm text-primary-content"
              >
                Continue Editing
              </Link>
            </h2>
          </div>
        )}
        {session && (
          <div className="w-fit border-t border-t-neutral-50/50 pt-4">
            <h2 className="flex items-center text-2xl">
              <span>Notebooks</span>
              <input
                type="text"
                className="d-input-bordered d-input d-input-sm mt-4 mb-4 ml-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></input>
              <label
                htmlFor="create-modal"
                className="ml-8 bg-primary text-sm text-primary-content"
              >
                + Create Notebook
              </label>
            </h2>
            {filtered_notebook_list?.map((notebook) => {
              return (
                <div
                  className="my-4 w-fit border-t border-t-neutral-50/50 pt-4 pl-4"
                  key={notebook.id}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl text-primary">
                        {notebook.name} (
                        {notebook.id.substring(0, 10).toUpperCase()})
                      </h3>
                      <button
                        className="bg-secondary text-sm text-secondary-content"
                        onClick={() => createPage(notebook.id)}
                      >
                        + Create Page
                      </button>
                    </div>
                    <div className="flex items-start gap-2 sm:items-center">
                      <label
                        htmlFor="update-modal"
                        className="cursor-pointer text-xs"
                        onClick={() => {
                          setNotebookToEdit(notebook.id);
                        }}
                      >
                        <FaCog />
                      </label>
                      <label
                        htmlFor="delete-modal"
                        className="text-xs"
                        onClick={() => {
                          setNotebookToDelete({
                            id: notebook.id,
                            name: notebook.name,
                          });
                        }}
                      >
                        <FaTrash />
                      </label>
                      {notebook.description && (
                        <p className="text-xs">{notebook.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-4 pl-8">
                    {notebook.Pages.map((page) => {
                      return (
                        <div key={page.id}>
                          <p>
                            <a
                              className="block text-secondary"
                              href={`/editor?page=${page.id}`}
                            >
                              - {page.name}(
                              {page.id.substring(0, 10).toUpperCase()})
                            </a>
                          </p>
                          <div className="mt-1 flex items-start gap-2 sm:items-center">
                            <label
                              htmlFor="update-page"
                              className="cursor-pointer text-xs"
                              onClick={() => {
                                setPageToEdit(page.id);
                              }}
                            >
                              <FaCog />
                            </label>
                            <label
                              htmlFor="delete-page-modal"
                              className="text-xs"
                              onClick={() => {
                                setPageToDelete({
                                  id: page.id,
                                  name: page.name,
                                });
                              }}
                            >
                              <FaTrash />
                            </label>
                            {/* <a
                              className="text-xs"
                              href={`/view?page=${page.id}`}
                            >
                              <FaEye />
                            </a> */}
                            <p className="text-xs">
                              (Last Edited:{' '}
                              {new Date(
                                page.Content[0]?.updatedAt ?? page.updatedAt
                              ).toLocaleString()}
                              ){page.description && `: ${page.description}`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <CreateModal createNotebook={createNotebook} />
      <UpdateModal
        updateNotebook={async (data) => {
          await notebookUpdate.mutateAsync({
            notebookId: notebookToEdit,
            ...data,
          });
          notebook_list_refetch();
          setNotebookToEdit('');
        }}
        notebookId={notebookToEdit}
      />
      <UpdatePageModal
        updatePage={async (data) => {
          await pageUpdate.mutateAsync({
            pageId: pageToEdit,
            ...data,
          });
          notebook_list_refetch();
          setNotebookToEdit('');
        }}
        pageId={pageToEdit}
      />
      <DeleteModal
        notebookId={notebookToDelete.id}
        notebookName={notebookToDelete.name}
        deleteNotebook={(vars) => {
          deleteNotebook(vars.id);
        }}
      />
      <DeletePageModal
        pageId={pageToDelete.id}
        pageName={pageToDelete.name}
        deletePage={(vars) => {
          deletePage(vars.id);
        }}
      />
    </>
  );
};

HomePage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default HomePage;
