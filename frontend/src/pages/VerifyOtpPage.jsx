import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState(location.state?.devOtp || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.verifyOtp({ email, otp });
      await setSession(res.token);
      toast.success('Email verified!');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await api.resendOtp({ email });
      if (res.devOtp) setOtp(res.devOtp);
      toast.success('New OTP sent (check server console in dev)');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14">
      <Card>
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            Enter the 6-digit OTP from the server console (dev mode shows it after register).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleVerify}>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otp">OTP code</Label>
              <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify & continue'}
            </Button>
          </form>
          <div className="mt-4 flex flex-col gap-2 text-center text-sm">
            <button type="button" className="text-primary hover:underline" onClick={handleResend}>
              Resend OTP
            </button>
            <Link to="/login" className="text-muted-foreground hover:underline">
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
