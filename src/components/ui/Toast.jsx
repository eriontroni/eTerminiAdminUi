import { useState, createContext, useContext, useCallback } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(({ id, message, type }) => (
          <div
            key={id}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl ring-1 pointer-events-auto min-w-[280px] max-w-sm fade-in ${
              type === 'success'
                ? 'bg-emerald-50 ring-emerald-200 text-emerald-800'
                : 'bg-red-50 ring-red-200 text-red-800'
            }`}
          >
            {type === 'success'
              ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              : <XCircle    className="w-5 h-5 text-red-500 shrink-0" />
            }
            <span className="text-sm font-medium flex-1">{message}</span>
            <button onClick={() => remove(id)} className="opacity-50 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
