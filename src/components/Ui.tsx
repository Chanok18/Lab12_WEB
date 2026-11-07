"use client"

import type { ReactNode } from "react"
import { LoaderCircle, X } from "lucide-react"

export const inputClass =
  "w-full rounded-xl border border-[#d9d3c3] bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"

export const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#3269b2] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#24518e] disabled:opacity-50"

export const outlineClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[#d9d3c3] bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"

export const cardClass =
  "rounded-xl border border-[#ded8c8] bg-[#faf9f5] p-5 shadow-sm"

export function Loading() {
  return (
    <div className="flex items-center justify-center gap-2 py-14 text-slate-500">
      <LoaderCircle className="animate-spin text-violet-600" />
      Cargando información...
    </div>
  )
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      {message}
    </div>
  )
}

export function Modal({
  title, children, close
}: {
  title: string
  children: ReactNode
  close: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button aria-label="Cerrar" onClick={close} className="rounded-lg p-2 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
