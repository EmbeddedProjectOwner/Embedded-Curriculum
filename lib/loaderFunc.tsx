import { Skeleton } from "@/components/shadcn";

export function LoaderFunc() {
  return (
  <>
    <div className="space-y-6 p-6 w-full mx-auto">
      <div className="space-y-4">
        <Skeleton.Skeleton className="h-8 w-1/4 bg-gray-700" />
        <Skeleton.Skeleton className="h-6 w-2/3 bg-gray-700" />
      </div>


      <div className="space-y-2">
        <Skeleton.Skeleton className="h-6 w-1/3 bg-gray-700" />
        <Skeleton.Skeleton className="h-10 w-full bg-gray-800 rounded-md" />
      </div>

      <div className="space-y-3">
        <Skeleton.Skeleton className="h-6 w-1/4 bg-gray-700" />
        <Skeleton.Skeleton className="h-4 w-full bg-gray-800 rounded-md" />
        <Skeleton.Skeleton className="h-4 w-5/6 bg-gray-800 rounded-md" />
        <Skeleton.Skeleton className="h-4 w-2/3 bg-gray-800 rounded-md" />
      </div>
    </div>
    </>)
}