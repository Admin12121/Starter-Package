import { Empty } from "./empty"

export const NoResult = () => {
  return (
    <div className="lg:col-span-3 md:col-span-2 flex flex-col items-center justify-center gap-y-10 h-full w-full">
      <span className="mt-24 invert">
        <Empty />
      </span>
    </div>
  )
}
