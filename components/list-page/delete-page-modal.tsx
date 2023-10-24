export interface DeletePageModalProps {
  pageName: string;
  pageId: string;
  deletePage: (vars: { id: string }) => void;
}

const DeletePageModal: React.FC<DeletePageModalProps> = (props) => {
  const { deletePage } = props;

  return (
    <>
      <input
        type="checkbox"
        id="delete-page-modal"
        className="d-modal-toggle"
      />
      <label
        htmlFor="delete-page-modal"
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
              deletePage({
                id: props.pageId,
              });
              // simulate click to close modal
              document.getElementById('delete-page-modal')?.click();
            }}
          >
            <h3 className="text-xl font-bold">Delete [{props.pageName}]?</h3>
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

export default DeletePageModal;
