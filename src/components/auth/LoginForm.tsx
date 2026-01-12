import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { loginSchema, type LoginFormData } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { toast } from '@/hooks/useToast'
import { Shield, User } from 'lucide-react'

const DEMO_ACCOUNTS = {
  admin: {
    email: 'admin@demo.com',
    password: 'Admin123!',
    label: 'Admin',
    icon: Shield,
  },
  consultant: {
    email: 'consultant@demo.com',
    password: 'Consultant123!',
    label: 'Consultant',
    icon: User,
  },
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await signIn(data.email, data.password)
      toast({
        title: 'Welcome back!',
        description: 'You have been logged in successfully.',
      })
      navigate(from, { replace: true })
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithDemo = async (accountType: 'admin' | 'consultant') => {
    const account = DEMO_ACCOUNTS[accountType]
    setLoadingDemo(accountType)

    try {
      await signIn(account.email, account.password)
      toast({
        title: `Welcome, Demo ${account.label}!`,
        description: 'You are now logged in with a demo account.',
      })
      navigate(from, { replace: true })
    } catch (error) {
      toast({
        title: 'Demo login failed',
        description: 'Demo account may not be set up. Please create it first.',
        variant: 'destructive',
      })
    } finally {
      setLoadingDemo(null)
    }
  }

  const fillDemoCredentials = (accountType: 'admin' | 'consultant') => {
    const account = DEMO_ACCOUNTS[accountType]
    setValue('email', account.email)
    setValue('password', account.password)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Demo Account Buttons */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">Quick demo access</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => loginWithDemo('admin')}
                disabled={isLoading || loadingDemo !== null}
                className="h-auto py-3"
              >
                {loadingDemo === 'admin' ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Shield className="mr-2 h-4 w-4" />
                )}
                <div className="text-left">
                  <div className="font-medium">Admin</div>
                  <div className="text-xs text-muted-foreground">Full access</div>
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => loginWithDemo('consultant')}
                disabled={isLoading || loadingDemo !== null}
                className="h-auto py-3"
              >
                {loadingDemo === 'consultant' ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <User className="mr-2 h-4 w-4" />
                )}
                <div className="text-left">
                  <div className="font-medium">Consultant</div>
                  <div className="text-xs text-muted-foreground">Standard access</div>
                </div>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              disabled={isLoading || loadingDemo !== null}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              {...register('password')}
              disabled={isLoading || loadingDemo !== null}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading || loadingDemo !== null}>
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            Sign in
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
