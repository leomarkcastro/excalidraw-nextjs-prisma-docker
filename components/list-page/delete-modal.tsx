export interface DeleteModalProps {
  notebookName: string;
  notebookId: string;
  deleteNotebook: (vars: { id: string }) => void;
}

const DeleteModal: React.FC<DeleteModalProps> = (props) => {
  const { deleteNotebook } = props;

  return (
    <>
      <input type="checkbox" id="delete-modal" className="d-modal-toggle" />
      <label
        htmlFor="delete-modal"
        className="d-modal cursor-pointer font-mono"
      >
        <label className="d-modal-box relative" htmlFor="">
          <form
            onSubmit={(eve) => {
              eve.preventDefault();
              // get form name and description
              const name = eve.currentTarget.nBname.value;
              if (name !== 'delete') {
                alert('Please type `delete` to confirm');
                return;
              }
              deleteNotebook({
                id: props.notebookId,
              });
              // simulate click to close modal
              document.getElementById('delete-modal')?.click();
            }}
          >
            <h3 className="text-xl font-bold">
              Delete [{props.notebookName}]?
            </h3>
            <div className="d-form-control w-full">
              <label className="d-label">
                <span className="d-label-text">
                  Please type &lsquo;delete&lsquo; to confirm
                </span>
              </label>
              <input
                type="text"
                name="nBname"
                placeholder=""
                className="d-input-bordered d-input w-full"
              />
            </div>
            <button
              className="d-btn-sm d-btn mx-auto mt-4 ml-auto w-full"
              type="submit"
            >
              Delete
            </button>
          </form>
        </label>
      </label>
    </>
  );
};

export default DeleteModal;
