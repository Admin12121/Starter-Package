interface ContentLayoutProps {
  title?: string;
  children: React.ReactNode;
  classname?: string;
}

export function ContentLayout({
  // title,
  children,
  classname,
}: ContentLayoutProps) {
  return (
    <div className={classname ? classname : ""}>
      <div className="h-[calc(100vh_-_25px)] m-0 p-0 flex flex-col w-full">
        {children}
      </div>
    </div>
  );
}
