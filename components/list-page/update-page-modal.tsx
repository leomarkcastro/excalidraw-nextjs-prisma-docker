import { trpc } from '@/lib/server/trpc';
import { useEffect, useState } from 'react';

export interface UpdatePageModalProps {
  pageId: string;
  updatePage: (vars: {
    name: string;
    description: string;
    public: boolean;
  }) => void;
}

const UpdatePageModal: React.FC<UpdatePageModalProps> = (props) => {
  const { pageId, updatePage } = props;

  const pageGet = trpc.excalidraw.page_get.useQuery(
    {
      pageId: pageId,
    },
    {
      enabled: !!pageId,
    }
  );

  const [isPublic, setIsPublic] = useState<boolean>(false);

  useEffect(() => {
    setIsPublic(pageGet.data?.public ?? false);
  }, [pageGet.data]);

  return (
    <>
      <input type="checkbox" id="update-page" className="d-modal-toggle" />
      <label htmlFor="update-page" className="d-modal cursor-pointer font-mono">
        <label className="d-modal-box relative" htmlFor="">
          <form
            onSubmit={(eve) => {
              eve.preventDefault();
              // get form name and description
              const name = eve.currentTarget.nBname.value;
              const description = eve.currentTarget.nBdescription.value;
              const isPublic = eve.currentTarget.nBpublic.checked;
              updatePage({
                name: name,
                description: description,
                public: isPublic,
              });
              // simulate click to close modal
              document.getElementById('update-page')?.click();
            }}
          >
            <h3 className="text-xl font-bold">Update Page</h3>
            <div className="d-form-control w-full">
              <label className="d-label">
                <span className="d-label-text">Page Name</span>
              </label>
              <input
                type="text"
                name="nBname"
                placeholder="Page Title"
                defaultValue={pageGet.data?.name || ''}
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
                defaultValue={pageGet.data?.description || ''}
                placeholder="Page Description"
              ></textarea>
            </div>
            <div className="d-form-control">
              <label className="d-label cursor-pointer">
                <span className="d-label-text">
                  Public Viewable [{JSON.stringify(isPublic)}]
                </span>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  name="nBpublic"
                  className="checkbox-primary d-checkbox"
                />
              </label>
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

export default UpdatePageModal;
