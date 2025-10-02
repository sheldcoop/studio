
import { Skeleton } from "@/components/ui/skeleton";

export function TopicPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto animate-pulse">
        <div className="flex flex-col lg:flex-row lg:gap-16">
            <div className="flex-1 min-w-0">
                {/* Header */}
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-6 w-full mb-8" />
                
                {/* Progress Card */}
                <Skeleton className="h-24 w-full mb-8" />
                
                {/* Roadmap */}
                <Skeleton className="h-8 w-1/3 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
                
                {/* Content Section */}
                <Skeleton className="h-8 w-1/2 mb-8" />
                <div className="space-y-8">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
            
            {/* Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0 space-y-4">
                 <Skeleton className="h-6 w-3/4" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-5/6" />
                 <Skeleton className="h-4 w-full" />
            </div>
        </div>
    </div>
  );
}
