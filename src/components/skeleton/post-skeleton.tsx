const PostSkeleton = () => {
  return (
    <div className="mx-auto mb-4 w-full rounded-md p-3 shadow">
      <div className="flex animate-pulse flex-col space-y-5">
        <div className="flex items-center space-x-4">
          <div className="size-11 rounded-full bg-primary/10 bg-opacity-80"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-6 w-36 rounded-full bg-primary/10"></div>
            <div className="h-3 w-20 rounded-full bg-primary/10"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-primary/10"></div>
          <div className="h-3 w-full rounded bg-primary/10"></div>
          <div className="h-3 w-full rounded bg-primary/10"></div>
        </div>
        <div>
          <div className="h-40 w-full rounded bg-primary/10 md:h-56"></div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="h-[29px] w-full rounded bg-primary/10 md:h-[37px]"></div>
          <div className="h-[29px] w-full rounded bg-primary/10 md:h-[37px]"></div>
          <div className="h-[29px] w-full rounded bg-primary/10 md:h-[37px]"></div>
        </div>
      </div>
    </div>
  )
}

export default PostSkeleton
