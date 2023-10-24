import { ReactElement, ReactNode } from 'react';

export interface LayoutImplementerProps {
  children: React.ReactElement;
  getLayout: (_page: ReactElement) => ReactNode;
}

const LayoutImplementer: React.FC<LayoutImplementerProps> = (props) => {
  const { children, getLayout } = props;

  return <>{getLayout(children)}</>;
};

export default LayoutImplementer;
