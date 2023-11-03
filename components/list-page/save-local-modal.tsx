import { trpc } from '@/lib/server/trpc';
import { useRouter } from 'next/router';

export interface SaveLocalFileModalProps {
  content: string;
  files: string;
  appState: string;
}

const SaveLocalFileModal: React.FC<SaveLocalFileModalProps> = (props) => {
  const router = useRouter();
  const notebookList = trpc.excalidraw.notebook_list.useQuery();
  const notebookCreate = trpc.excalidraw.notebook_create.useMutation();
  const pageCreate = trpc.excalidraw.page_create.useMutation();
  const contentCreate = trpc.excalidraw.content_update.useMutation();

  return (
    <>
      <input type="checkbox" id="save-local-file" className="d-modal-toggle" />
      <label
        htmlFor="save-local-file"
        className="d-modal cursor-pointer font-mono"
      >
        <label className="d-modal-box relative" htmlFor="">
          <form
            onSubmit={async (eve) => {
              eve.preventDefault();
              // get form name and description
              let notebookName = eve.currentTarget.nBNotebook.value;
              const name = eve.currentTarget.nBname.value;
              const description = eve.currentTarget.nBdescription.value;

              // if user select ((none)), check if it already exists, else create the notebook
              if (notebookName === '((none))') {
                // check if notebook exists
                const notebook = notebookList.data?.find(
                  (notebook) => notebook.name === '((none))'
                );
                if (notebook) {
                  // notebook already exists, use it
                  notebookName = notebook.id;
                } else {
                  // notebook doesn't exist, create it
                  const newNotebook = notebookCreate.mutateAsync({
                    name: '((none))',
                    description: '',
                  });
                  notebookName = (await newNotebook).id;
                }
              }

              // create page
              const newPage = await pageCreate.mutateAsync({
                name: name,
                description: description,
                notebookId: notebookName,
              });

              // create content
              await contentCreate.mutateAsync({
                pageId: newPage,
                content: props.content,
                files: props.files,
                appState: props.appState,
              });

              window.localStorage.removeItem('excalidraw_elements');
              window.localStorage.removeItem('excalidraw_files');
              window.location.href = `/editor?page=${newPage}`;
            }}
          >
            <h3 className="text-xl font-bold">Create Page</h3>
            <div className="d-form-control w-full">
              <label className="d-label">
                <span className="d-label-text">Notebook to Save At</span>
              </label>
              <select
                className="d-select-bordered d-select w-full"
                name="nBNotebook"
                defaultValue={'((none))'}
              >
                <option value="((none))">(None)</option>
                {notebookList.data?.map((notebook) => {
                  return (
                    <option key={notebook.id} value={notebook.id}>
                      {notebook.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="d-form-control w-full">
              <label className="d-label">
                <span className="d-label-text">Page Name</span>
              </label>
              <input
                type="text"
                name="nBname"
                placeholder="Page Name"
                className="d-input-bordered d-input w-full"
              />
            </div>
            <div className="d-form-control w-full">
              <label className="d-label">
                <span className="d-label-text">Page Description</span>
              </label>
              <textarea
                className="d-textarea-bordered d-textarea"
                name="nBdescription"
                placeholder="Page Description"
              ></textarea>
            </div>
            <button
              className="d-btn-sm d-btn mx-auto mt-4 ml-auto w-full"
              type="submit"
            >
              Create
            </button>
          </form>
        </label>
      </label>
    </>
  );
};

export default SaveLocalFileModal;
