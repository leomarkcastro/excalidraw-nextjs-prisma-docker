export interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = (props) => {
  return <div className="min-h-screen w-full font-mono">{props.children}</div>;
};

export default DefaultLayout;
