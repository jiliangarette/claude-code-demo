import { useProfile } from '@/hooks/useProfile'
import { VisualProfileEditor } from '@/components/profile/VisualProfileEditor'
import { Skeleton } from '@/components/ui/skeleton'

export function ProfileEditPage() {
  const {
    profile,
    credentials,
    isLoading,
    updateProfile,
    uploadPhoto,
    addCredential,
    deleteCredential,
  } = useProfile()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <Skeleton className="h-40 w-40 rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-32 w-full max-w-2xl mx-auto" />
        <Skeleton className="h-48 w-full max-w-2xl mx-auto" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Profile not found</h2>
        <p className="text-muted-foreground">
          Unable to load your profile. Please try refreshing the page.
        </p>
      </div>
    )
  }

  return (
    <VisualProfileEditor
      profile={profile}
      credentials={credentials}
      onUpdateProfile={updateProfile}
      onUploadPhoto={uploadPhoto}
      onAddCredential={addCredential}
      onDeleteCredential={deleteCredential}
    />
  )
}
