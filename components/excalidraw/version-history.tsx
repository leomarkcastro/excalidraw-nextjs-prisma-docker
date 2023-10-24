import { trpc } from '@/lib/server/trpc';
import { Sidebar } from '@excalidraw/excalidraw';

export interface VersionHistoryProps {
  pageId: string;
}

const VersionHistory: React.FC<VersionHistoryProps> = (props) => {
  const pageData = trpc.excalidraw.page_get.useQuery({
    pageId: props.pageId,
  });

  return (
    <>
      <Sidebar.Header>Version History</Sidebar.Header>
      {/* @ts-ignore */}
      <Sidebar.Tabs style={{ padding: '0.5rem' }}>
        <Sidebar.Tab tab="one">
          <div className="overflow-y-auto">
            {pageData.isLoading && <div>Loading...</div>}
            {pageData.data?.Content.map((version: any) => {
              return (
                <a
                  className="d-card-bordered d-card mb-2 shadow"
                  href={`/editor?page=${props.pageId}&version=${version.id}`}
                  key={version.id}
                >
                  <div className="flex justify-between p-4">
                    <div className="text-neutral-500">
                      Version saved:
                      <br /> {new Date(version.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </Sidebar.Tab>
      </Sidebar.Tabs>
    </>
  );
};

export default VersionHistory;
