import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { UserType } from '@/types';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>(UserType.INVESTOR);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          userType
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }
      
      // Auto login after successful registration
      const signInResult = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (signInResult?.error) {
        throw new Error('Failed to sign in after registration');
      }
      
      // Redirect to the appropriate dashboard
      if (userType === UserType.ENTREPRENEUR) {
        router.push('/dashboard/entrepreneur');
      } else {
        router.push('/projects');
      }
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout title="Sign Up - Launch Tribe">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-1">Create an Account</h2>
                  <p className="text-muted">Join Launch Tribe today and connect with opportunities</p>
                </div>
                
                {error && (
                  <div className="alert alert-danger">{error}</div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="userType" className="form-label">I am a:</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="userType"
                          id="typeEntrepreneur"
                          value={UserType.ENTREPRENEUR}
                          checked={userType === UserType.ENTREPRENEUR}
                          onChange={() => setUserType(UserType.ENTREPRENEUR)}
                          disabled={loading}
                        />
                        <label className="form-check-label" htmlFor="typeEntrepreneur">
                          Entrepreneur
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="userType"
                          id="typeInvestor"
                          value={UserType.INVESTOR}
                          checked={userType === UserType.INVESTOR}
                          onChange={() => setUserType(UserType.INVESTOR)}
                          disabled={loading}
                        />
                        <label className="form-check-label" htmlFor="typeInvestor">
                          Investor
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <div className="form-text">
                      Password must be at least 8 characters long
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                  
                  <div className="mt-4 text-center">
                    <p className="text-muted small">
                      By signing up, you agree to our <Link href="/terms" className="text-decoration-none">Terms of Service</Link> and <Link href="/privacy" className="text-decoration-none">Privacy Policy</Link>
                    </p>
                    <p className="mb-0">
                      Already have an account? <Link href="/login" className="text-decoration-none">Sign in</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}