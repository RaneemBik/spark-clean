 'use client'

 import { useState } from 'react'

 type Props<T> = {
   items: T[]
   itemsPerPage?: number
   className?: string
   renderItem: (item: T, index: number, globalIndex: number) => React.ReactNode
 }

 export default function Pagination<T>({ items, itemsPerPage = 5, className = '', renderItem }: Props<T>) {
   const [page, setPage] = useState(1)
   const total = Math.max(1, Math.ceil(items.length / itemsPerPage))

   const start = (page - 1) * itemsPerPage
   const pageItems = items.slice(start, start + itemsPerPage)

   return (
     <div className={className}>
       <div>
         {pageItems.map((it, i) => renderItem(it, i, start + i))}
       </div>

       {total > 1 && (
         <div className="mt-8 flex items-center justify-center gap-2">
           {Array.from({ length: total }).map((_, i) => {
             const idx = i + 1
             const isActive = idx === page
             return (
               <button key={i} onClick={() => setPage(idx)} aria-current={isActive ? 'page' : undefined}
                 className={
                   'px-3 py-1 rounded-md text-sm border ' +
                   (isActive ? 'bg-mint-600 text-white border-mint-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50')
                 }>
                 {idx}
               </button>
             )
           })}
         </div>
       )}
     </div>
   )
 }
