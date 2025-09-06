const PostSkeleton = () => {
  return (
    <div className="mx-auto mb-4 w-full rounded-md p-3 shadow">
      <div className="flex animate-pulse flex-col space-y-5">
        <div className="flex items-center space-x-4">
          <div className="bg-accent size-11 animate-pulse rounded-full"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="bg-accent h-6 w-36 animate-pulse rounded-full"></div>
            <div className="bg-accent h-3 w-20 animate-pulse rounded-full"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-accent h-3 w-full animate-pulse rounded"></div>
          <div className="bg-accent h-3 w-full animate-pulse rounded"></div>
          <div className="bg-accent h-3 w-full animate-pulse rounded"></div>
        </div>
        <div>
          <div className="bg-accent h-40 w-full animate-pulse rounded md:h-56"></div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="bg-accent h-[29px] w-full animate-pulse rounded md:h-[37px]"></div>
          <div className="bg-accent h-[29px] w-full animate-pulse rounded md:h-[37px]"></div>
          <div className="bg-accent h-[29px] w-full animate-pulse rounded md:h-[37px]"></div>
        </div>
      </div>
    </div>
  )
}

export default PostSkeleton
