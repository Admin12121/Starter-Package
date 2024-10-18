import React from 'react';

import { Empty } from '../empty';
const Error = ({children}:{children: React.ReactNode}) => {
  return (
    <div className="container w-full h-full flex flex-col items-center justify-center gap-10">
      <Empty/>
      {children}
    </div>
  );
};

export default Error;

