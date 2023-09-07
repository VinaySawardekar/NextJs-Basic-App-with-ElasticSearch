'use client' // Error components must be Client Components
 
export default function Error({
  reset,
}: {
  reset: () => void
}) {
 
  return (
    <div className='flex flex-col align-middle justify-center items-center m-2 p-10'>
      <h2 className='text-2xl p-5'>Something went wrong!</h2>
      <button
       className='rounded-sm  bg-teal-750 text-white px-4 py-2 m-1 hover:bg-teal-950 ...'
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}