'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type MediaCarouselProps = {
  images: string[]
  altBase: string
  className?: string
  imageClassName?: string
  showThumbs?: boolean
}

export default function MediaCarousel({
  images,
  altBase,
  className = 'h-64 rounded-2xl',
  imageClassName = 'object-cover',
  showThumbs = true,
}: MediaCarouselProps) {
  const cleanImages = useMemo(
    () => Array.from(new Set((images || []).filter((img) => typeof img === 'string' && img.length > 0))),
    [images]
  )
  const [index, setIndex] = useState(0)

  if (cleanImages.length === 0) return null

  const hasMultiple = cleanImages.length > 1
  const active = cleanImages[index % cleanImages.length]

  const prev = () => setIndex((v) => (v - 1 + cleanImages.length) % cleanImages.length)
  const next = () => setIndex((v) => (v + 1) % cleanImages.length)

  return (
    <div>
      <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
        <img src={active} alt={`${altBase} image ${index + 1}`} className={`w-full h-full ${imageClassName}`} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur border border-white/70 shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur border border-white/70 shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {hasMultiple && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {cleanImages.map((_, i) => (
              <button
                key={`dot-${i}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-white' : 'w-2 bg-white/60 hover:bg-white/80'}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {showThumbs && hasMultiple && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {cleanImages.slice(0, 3).map((img, i) => (
            <button
              key={`thumb-${i}`}
              onClick={() => setIndex(i)}
              className={`relative h-16 rounded-xl overflow-hidden border transition ${i === index ? 'border-mint-500 ring-2 ring-mint-200' : 'border-gray-200 hover:border-mint-300'}`}
              aria-label={`Select image ${i + 1}`}
            >
              <img src={img} alt={`${altBase} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
