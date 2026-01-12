import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Pencil } from 'lucide-react'

interface EditableFieldProps {
  children: React.ReactNode
  onClick: () => void
  className?: string
  editLabel?: string
  isEmpty?: boolean
  emptyText?: string
}

export function EditableField({
  children,
  onClick,
  className,
  editLabel = 'Edit',
  isEmpty = false,
  emptyText = 'Click to add',
}: EditableFieldProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        'relative group cursor-pointer rounded-lg transition-all duration-200',
        'hover:ring-2 hover:ring-primary/50 hover:ring-offset-2',
        isEmpty && 'border-2 border-dashed border-muted-foreground/30 hover:border-primary/50',
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEmpty ? (
        <div className="flex items-center justify-center py-4 text-muted-foreground">
          <Pencil className="h-4 w-4 mr-2" />
          <span className="text-sm">{emptyText}</span>
        </div>
      ) : (
        children
      )}

      {/* Edit overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-primary/5 rounded-lg flex items-center justify-center opacity-0 transition-opacity duration-200',
          'group-hover:opacity-100'
        )}
      >
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
          <Pencil className="h-3 w-3" />
          {editLabel}
        </div>
      </div>
    </div>
  )
}
