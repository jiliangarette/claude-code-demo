import { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Camera, Upload, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfilePhotoEditorProps {
  photoUrl: string | null
  name: string | null
  onUpload: (file: File) => Promise<void>
  onRemove?: () => Promise<void>
  size?: 'sm' | 'md' | 'lg' | 'xl'
  editable?: boolean
}

const sizeClasses = {
  sm: 'h-16 w-16',
  md: 'h-24 w-24',
  lg: 'h-32 w-32',
  xl: 'h-40 w-40',
}

export function ProfilePhotoEditor({
  photoUrl,
  name,
  onUpload,
  onRemove,
  size = 'lg',
  editable = true,
}: ProfilePhotoEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getInitials = (name: string | null) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      await onUpload(file)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClick = () => {
    if (editable && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div
      className={cn(
        'relative inline-block',
        editable && 'cursor-pointer'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <Avatar className={cn(sizeClasses[size], 'border-4 border-background shadow-xl')}>
        <AvatarImage src={photoUrl || ''} />
        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      {/* Overlay */}
      {editable && (
        <div
          className={cn(
            'absolute inset-0 rounded-full bg-black/50 flex items-center justify-center transition-opacity duration-200',
            isHovered || isUploading ? 'opacity-100' : 'opacity-0'
          )}
        >
          {isUploading ? (
            <LoadingSpinner className="text-white" />
          ) : (
            <Camera className="h-8 w-8 text-white" />
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
    </div>
  )
}
