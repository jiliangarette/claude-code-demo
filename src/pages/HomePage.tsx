import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  User,
  MessageSquare,
  Share2,
  QrCode,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

const features = [
  {
    icon: User,
    title: 'Professional Profile',
    description: 'Create a stunning profile showcasing your expertise, credentials, and services.',
  },
  {
    icon: MessageSquare,
    title: 'Collect Testimonials',
    description: 'Gather client feedback with an easy submission form and approval workflow.',
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share your profile via link or QR code on business cards and social media.',
  },
  {
    icon: QrCode,
    title: 'QR Code Ready',
    description: 'Auto-generated QR codes make it easy for clients to find your profile.',
  },
]

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Professional Consultant Profiles
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Showcase Your Expertise,{' '}
            <span className="text-primary">Build Trust</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Create a professional online presence that helps clients discover your
            services and trust your qualifications.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Tools designed specifically for consultants to manage their online presence.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Build Credibility with Client Testimonials
              </h2>
              <p className="text-muted-foreground mb-6">
                Let your satisfied clients speak for you. Collect, manage, and
                display testimonials that build trust with potential clients.
              </p>
              <ul className="space-y-3">
                {[
                  'Easy submission form for clients',
                  'Review and approve before publishing',
                  'Feature your best reviews',
                  'Star ratings and client photos',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background rounded-lg p-6 shadow-lg border">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold">JD</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">Jane Doe</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    CEO at TechCorp
                  </p>
                  <p className="mt-2 text-sm">
                    "Working with this consultant transformed our business
                    strategy. Highly recommend their expertise and
                    professionalism."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Professional Profile?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join consultants who use our platform to showcase their expertise.
          </p>
          {!user && (
            <Link to="/signup">
              <Button size="lg">
                Create Your Profile
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container max-w-5xl mx-auto text-center text-sm text-muted-foreground">
          <p>ConsultantProfile Platform</p>
        </div>
      </footer>
    </div>
  )
}

function Star({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  )
}
