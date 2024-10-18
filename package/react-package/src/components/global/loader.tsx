import Spinner from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

interface LoaderProps {
  classNames?: {
    skeleton?: string;
    spinner?: string;
  };
  props?: {
    skeleton?: React.HTMLAttributes<HTMLDivElement>;
  };
  disable?: boolean;
  children?: React.ReactNode;
  type?: 'spinner' | 'skeleton';
  [key: string]: any;
}

function Loader({   
  classNames = {},
  props = {},
  disable = false,
  children,
  type = 'skeleton',
  ...restProps
}: LoaderProps) {
  const { skeleton = '' } = classNames;
  const {  skeleton: skeletonProps = {} } = props;

  if (disable) {
    return children;
  }

  if (type === 'spinner') {
    return <div className="flex items-center justify-center h-full w-full"><Spinner/></div>;
  }

  return <Skeleton className={`${skeleton}`} {...skeletonProps} {...restProps} />;
}

export default Loader;