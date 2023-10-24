import { trpc } from '@/lib/server/trpc';

export interface UpdateModalProps {
  notebookId: string;
  updateNotebook: (vars: { name: string; description: string }) => void;
}

const UpdateModal: React.FC<UpdateModalProps> = (props) => {
  const { notebookId, updateNotebook } = props;

  const notebookGet = trpc.excalidraw.notebook_get.useQuery(
    {
      notebookId: notebookId,
    },
    {
      enabled: !!notebookId,
    }
  );

  return (
    <>
      <input type="checkbox" id="update-modal" className="d-modal-toggle" />
      <label
        htmlFor="update-modal"
        className="d-modal cursor-pointer font-mono"
      >
        <label className="d-modal-box relative" htmlFor="">
          <form
            onSubmit={(eve) => {
              eve.preventDefault();
              // get form name and description
              const name = eve.currentTarget.nBname.value;
              const description = eve.currentTarget.nBdescription.value;
              updateNotebook({
                name: name,
                description: description,
              });
              // simulate click to close modal
              document.getElementById('update-modal')?.click();
            }}
          >
            <h3 className="text-xl font-bold">Update Notebook</h3>
            <div className="d-form-control w-full">
              <label className="d-label">
                <span className="d-label-text">Notebook Name</span>
              </label>
              <input
                type="text"
                name="nBname"
                placeholder="Notebook Title"
                defaultValue={notebookGet.data?.name || ''}
                className="d-input-bordered d-input w-full"
              />
            </div>
            <div className="d-form-control w-full">
              <label className="d-label">
                <span className="d-label-text">Notebook Description</span>
              </label>
              <textarea
                className="d-textarea-bordered d-textarea"
                name="nBdescription"
                defaultValue={notebookGet.data?.description || ''}
                placeholder="Notebook Description"
              ></textarea>
            </div>
            <button
              className="d-btn-sm d-btn mx-auto mt-4 ml-auto w-full"
              type="submit"
            >
              Update
            </button>
          </form>
        </label>
      </label>
    </>
  );
};

export default UpdateModal;
