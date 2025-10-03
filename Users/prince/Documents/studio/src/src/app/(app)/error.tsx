'use client' 

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/app/page-header'
import { Frown } from 'lucide-react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center text-center">
        <div>
            <Frown className="mx-auto h-16 w-16 text-destructive" />
            <PageHeader 
                title="Oops! Something Went Wrong"
                description="We're sorry, but an unexpected error occurred while loading this page."
            />
            <Button onClick={() => reset()}>
                Try again
            </Button>
        </div>
    </div>
  )
}
