"use client"

import { useState } from "react"
import { BookOpen } from "lucide-react"

type Props = {
  isbn?: string | null
  title: string
  className?: string
}

export default function BookCover({
  isbn,
  title,
  className = ""
}: Props) {
  const [failed, setFailed] = useState(false)
  const cleanISBN = (isbn || "").replace(/[^0-9Xx]/g, "")

  const coverUrl = cleanISBN
    ? `https://covers.openlibrary.org/b/isbn/${cleanISBN}-M.jpg?default=false`
    : null

  return (
    <div className={`flex items-center justify-center overflow-hidden rounded-md bg-[#eee9db] ${className}`}>
      {coverUrl && !failed ? (
        <img
          src={coverUrl}
          alt={`Portada de ${title}`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="library-cover h-full w-full object-contain"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#45637c] to-[#253c50] p-3 text-center text-white">
          <BookOpen size={35} />
          <span className="line-clamp-3 font-serif text-xs font-semibold">
            {title}
          </span>
        </div>
      )}
    </div>
  )
}
