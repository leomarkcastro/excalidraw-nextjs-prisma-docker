export interface CreateModalProps {
  createNotebook: (vars: { name: string; description: string }) => void;
}

const CreateModal: React.FC<CreateModalProps> = (props) => {
  const { createNotebook } = props;

  return (
    <>
      <input type="checkbox" id="create-modal" className="d-modal-toggle" />
      <label
        htmlFor="create-modal"
        className="d-modal cursor-pointer font-mono"
      >
        <label className="d-modal-box relative" htmlFor="">
          <form
            onSubmit={(eve) => {
              eve.preventDefault();
              // get form name and description
              const name = eve.currentTarget.nBname.value;
              const description = eve.currentTarget.nBdescription.value;
              createNotebook({
                name: name,
                description: description,
              });
              // simulate click to close modal
              document.getElementById('create-modal')?.click();
            }}
          >
            <h3 className="text-xl font-bold">Create Notebook</h3>
            <div className="d-form-control w-full">
              <label className="d-label">
                <span className="d-label-text">Notebook Name</span>
              </label>
              <input
                type="text"
                name="nBname"
                placeholder="Notebook Title"
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
                placeholder="Notebook Description"
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

export default CreateModal;
