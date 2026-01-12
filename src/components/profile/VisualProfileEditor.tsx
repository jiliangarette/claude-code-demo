import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { EditableField } from './EditableField'
import { EditPanel } from './EditPanel'
import { ProfilePhotoEditor } from './ProfilePhotoEditor'
import { toast } from '@/hooks/useToast'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import type { Profile, Credential } from '@/types/database.types'
import {
  MessageCircle,
  Mail,
  Linkedin,
  Twitter,
  Globe,
  MapPin,
  Award,
  GraduationCap,
  Medal,
  Star,
  Eye,
  EyeOff,
  Share2,
  QrCode,
  Copy,
  Check,
  Plus,
  Trash2,
  Save,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface VisualProfileEditorProps {
  profile: Profile
  credentials: Credential[]
  onUpdateProfile: (updates: Partial<Profile>) => Promise<void>
  onUploadPhoto: (file: File) => Promise<void>
  onAddCredential: (credential: Omit<Credential, 'id' | 'profile_id' | 'created_at'>) => Promise<void>
  onDeleteCredential: (id: string) => Promise<void>
}

type EditingField =
  | 'name'
  | 'headline'
  | 'bio'
  | 'contact'
  | 'social'
  | 'credentials'
  | null

const credentialIcons: Record<string, typeof Award> = {
  degree: GraduationCap,
  certification: Award,
  license: Medal,
  award: Star,
}

export function VisualProfileEditor({
  profile,
  credentials,
  onUpdateProfile,
  onUploadPhoto,
  onAddCredential,
  onDeleteCredential,
}: VisualProfileEditorProps) {
  const [editingField, setEditingField] = useState<EditingField>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  // Form states for each editable section
  const [nameValue, setNameValue] = useState(profile.full_name || '')
  const [headlineValue, setHeadlineValue] = useState(profile.headline || '')
  const [bioValue, setBioValue] = useState(profile.bio || '')
  const [whatsappValue, setWhatsappValue] = useState(profile.whatsapp_number || '')
  const [emailValue, setEmailValue] = useState(profile.contact_email || '')
  const [linkedinValue, setLinkedinValue] = useState(profile.linkedin_url || '')
  const [twitterValue, setTwitterValue] = useState(profile.twitter_url || '')
  const [websiteValue, setWebsiteValue] = useState(profile.website_url || '')

  // New credential form
  const [newCredTitle, setNewCredTitle] = useState('')
  const [newCredInstitution, setNewCredInstitution] = useState('')
  const [newCredYear, setNewCredYear] = useState('')
  const [newCredType, setNewCredType] = useState<string>('certification')

  const profileUrl = `${window.location.origin}/p/${profile.slug}`

  const handleSave = async (field: EditingField, updates: Partial<Profile>) => {
    setIsSaving(true)
    try {
      await onUpdateProfile(updates)
      toast({ title: 'Saved', description: 'Your changes have been saved.' })
      setEditingField(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save changes.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTogglePublish = async () => {
    setIsSaving(true)
    try {
      await onUpdateProfile({ is_published: !profile.is_published })
      toast({
        title: profile.is_published ? 'Unpublished' : 'Published',
        description: profile.is_published
          ? 'Your profile is now hidden.'
          : 'Your profile is now live!',
      })
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddCredential = async () => {
    if (!newCredTitle) return
    try {
      await onAddCredential({
        title: newCredTitle,
        institution: newCredInstitution || null,
        year_obtained: newCredYear ? parseInt(newCredYear) : null,
        credential_type: newCredType,
        display_order: credentials.length,
      })
      setNewCredTitle('')
      setNewCredInstitution('')
      setNewCredYear('')
      toast({ title: 'Credential added' })
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' })
    }
  }

  const copyProfileUrl = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({ title: 'Link copied!' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant={profile.is_published ? 'default' : 'secondary'}>
              {profile.is_published ? 'Live' : 'Draft'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              /p/{profile.slug}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Your Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input value={profileUrl} readOnly className="flex-1" />
                    <Button onClick={copyProfileUrl} variant="outline" size="icon">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <QRCodeSVG value={profileUrl} size={180} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant={profile.is_published ? 'outline' : 'default'}
              size="sm"
              onClick={handleTogglePublish}
              disabled={isSaving}
            >
              {isSaving ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : profile.is_published ? (
                <EyeOff className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              {profile.is_published ? 'Unpublish' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Preview / Editor */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          {/* Profile Photo */}
          <div className="mb-4 flex justify-center">
            <ProfilePhotoEditor
              photoUrl={profile.profile_photo_url}
              name={profile.full_name}
              onUpload={onUploadPhoto}
              size="xl"
            />
          </div>

          {/* Name */}
          <EditableField
            onClick={() => setEditingField('name')}
            editLabel="Edit name"
            isEmpty={!profile.full_name}
            emptyText="Add your name"
            className="inline-block mb-2"
          >
            <h1 className="text-3xl font-bold px-4 py-2">{profile.full_name}</h1>
          </EditableField>

          {/* Headline */}
          <EditableField
            onClick={() => setEditingField('headline')}
            editLabel="Edit headline"
            isEmpty={!profile.headline}
            emptyText="Add a professional headline"
            className="inline-block"
          >
            <p className="text-lg text-muted-foreground px-4 py-1">{profile.headline}</p>
          </EditableField>
        </div>

        {/* Contact Buttons */}
        <EditableField
          onClick={() => setEditingField('contact')}
          editLabel="Edit contacts"
          isEmpty={!profile.whatsapp_number && !profile.contact_email}
          emptyText="Add contact methods"
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3 p-2">
            {profile.whatsapp_number && (
              <Button className="flex-1 bg-green-600 hover:bg-green-700" disabled>
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
            )}
            {profile.contact_email && (
              <Button variant="outline" className="flex-1" disabled>
                <Mail className="mr-2 h-5 w-5" />
                Email
              </Button>
            )}
          </div>
        </EditableField>

        {/* Social Links */}
        <EditableField
          onClick={() => setEditingField('social')}
          editLabel="Edit socials"
          isEmpty={!profile.linkedin_url && !profile.twitter_url && !profile.website_url}
          emptyText="Add social links"
          className="mb-6"
        >
          <div className="flex items-center justify-center gap-2 p-2">
            {profile.linkedin_url && (
              <Button variant="ghost" size="icon" disabled>
                <Linkedin className="h-5 w-5" />
              </Button>
            )}
            {profile.twitter_url && (
              <Button variant="ghost" size="icon" disabled>
                <Twitter className="h-5 w-5" />
              </Button>
            )}
            {profile.website_url && (
              <Button variant="ghost" size="icon" disabled>
                <Globe className="h-5 w-5" />
              </Button>
            )}
          </div>
        </EditableField>

        {/* Bio */}
        <div className="bg-card rounded-xl border shadow-sm mb-6">
          <EditableField
            onClick={() => setEditingField('bio')}
            editLabel="Edit bio"
            isEmpty={!profile.bio}
            emptyText="Add your bio"
          >
            <div className="p-6">
              <h2 className="font-semibold mb-3">About</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
            </div>
          </EditableField>
        </div>

        {/* Credentials */}
        <div className="bg-card rounded-xl border shadow-sm mb-6">
          <EditableField
            onClick={() => setEditingField('credentials')}
            editLabel="Edit credentials"
            isEmpty={credentials.length === 0}
            emptyText="Add your credentials"
          >
            <div className="p-6">
              <h2 className="font-semibold mb-4">Credentials</h2>
              <div className="space-y-3">
                {credentials.map((credential) => {
                  const Icon = credentialIcons[credential.credential_type || 'certification'] || Award
                  return (
                    <div
                      key={credential.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="p-2 rounded-full bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{credential.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {credential.institution}
                          {credential.year_obtained && ` • ${credential.year_obtained}`}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </EditableField>
        </div>

        {/* Footer hint */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Click any section above to edit
        </p>
      </div>

      {/* Edit Panels */}

      {/* Name Panel */}
      <EditPanel
        isOpen={editingField === 'name'}
        onClose={() => setEditingField(null)}
        title="Edit Name"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <Button
            className="w-full"
            onClick={() => handleSave('name', { full_name: nameValue })}
            disabled={isSaving}
          >
            {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
        </div>
      </EditPanel>

      {/* Headline Panel */}
      <EditPanel
        isOpen={editingField === 'headline'}
        onClose={() => setEditingField(null)}
        title="Edit Headline"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Professional Headline</Label>
            <Input
              value={headlineValue}
              onChange={(e) => setHeadlineValue(e.target.value)}
              placeholder="Senior Financial Consultant"
            />
            <p className="text-xs text-muted-foreground">
              A short title that describes what you do
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => handleSave('headline', { headline: headlineValue })}
            disabled={isSaving}
          >
            {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
        </div>
      </EditPanel>

      {/* Bio Panel */}
      <EditPanel
        isOpen={editingField === 'bio'}
        onClose={() => setEditingField(null)}
        title="Edit Bio"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>About You</Label>
            <Textarea
              value={bioValue}
              onChange={(e) => setBioValue(e.target.value)}
              placeholder="Tell potential clients about yourself..."
              rows={8}
            />
            <p className="text-xs text-muted-foreground">
              Share your experience, expertise, and what makes you unique
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => handleSave('bio', { bio: bioValue })}
            disabled={isSaving}
          >
            {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
        </div>
      </EditPanel>

      {/* Contact Panel */}
      <EditPanel
        isOpen={editingField === 'contact'}
        onClose={() => setEditingField(null)}
        title="Edit Contact Info"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>WhatsApp Number</Label>
            <Input
              value={whatsappValue}
              onChange={(e) => setWhatsappValue(e.target.value)}
              placeholder="+1234567890"
            />
          </div>
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="contact@example.com"
              type="email"
            />
          </div>
          <Button
            className="w-full"
            onClick={() => handleSave('contact', {
              whatsapp_number: whatsappValue || null,
              contact_email: emailValue || null,
            })}
            disabled={isSaving}
          >
            {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
        </div>
      </EditPanel>

      {/* Social Panel */}
      <EditPanel
        isOpen={editingField === 'social'}
        onClose={() => setEditingField(null)}
        title="Edit Social Links"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </Label>
            <Input
              value={linkedinValue}
              onChange={(e) => setLinkedinValue(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Twitter className="h-4 w-4" /> Twitter / X
            </Label>
            <Input
              value={twitterValue}
              onChange={(e) => setTwitterValue(e.target.value)}
              placeholder="https://twitter.com/yourhandle"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Website
            </Label>
            <Input
              value={websiteValue}
              onChange={(e) => setWebsiteValue(e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
          <Button
            className="w-full"
            onClick={() => handleSave('social', {
              linkedin_url: linkedinValue || null,
              twitter_url: twitterValue || null,
              website_url: websiteValue || null,
            })}
            disabled={isSaving}
          >
            {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
        </div>
      </EditPanel>

      {/* Credentials Panel */}
      <EditPanel
        isOpen={editingField === 'credentials'}
        onClose={() => setEditingField(null)}
        title="Edit Credentials"
      >
        <div className="space-y-6">
          {/* Existing Credentials */}
          {credentials.length > 0 && (
            <div className="space-y-3">
              <Label>Your Credentials</Label>
              {credentials.map((cred) => (
                <div
                  key={cred.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{cred.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {cred.institution} {cred.year_obtained && `• ${cred.year_obtained}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteCredential(cred.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add New */}
          <div className="space-y-3 pt-4 border-t">
            <Label>Add New Credential</Label>
            <Input
              value={newCredTitle}
              onChange={(e) => setNewCredTitle(e.target.value)}
              placeholder="e.g., Certified Financial Planner"
            />
            <Input
              value={newCredInstitution}
              onChange={(e) => setNewCredInstitution(e.target.value)}
              placeholder="Institution (optional)"
            />
            <Input
              value={newCredYear}
              onChange={(e) => setNewCredYear(e.target.value)}
              placeholder="Year (optional)"
              type="number"
            />
            <select
              value={newCredType}
              onChange={(e) => setNewCredType(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="certification">Certification</option>
              <option value="degree">Degree</option>
              <option value="license">License</option>
              <option value="award">Award</option>
            </select>
            <Button
              className="w-full"
              onClick={handleAddCredential}
              disabled={!newCredTitle}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Credential
            </Button>
          </div>
        </div>
      </EditPanel>
    </div>
  )
}
