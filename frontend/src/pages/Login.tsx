import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'organizer'>('user');
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ name, email, password, role });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Greška prilikom prijave');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                {isLogin ? 'Prijava' : 'Registracija'}
              </h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <Input
                    type="text"
                    label="Ime"
                    placeholder="Vaše ime"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                )}

                <Input
                  type="email"
                  label="Email"
                  placeholder="vas@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  type="password"
                  label="Lozinka"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label">Tip naloga</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'user' | 'organizer')}
                      className="form-select"
                    >
                      <option value="user">Korisnik</option>
                      <option value="organizer">Organizator</option>
                    </select>
                  </div>
                )}

                <div className="d-grid">
                  <Button
                    type="submit"
                    text={isLogin ? 'Prijavi se' : 'Registruj se'}
                    variant="primary"
                  />
                </div>
              </form>

              <p className="mt-3 text-center">
                {isLogin ? 'Nemate nalog? ' : 'Već imate nalog? '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="btn btn-link p-0"
                >
                  {isLogin ? 'Registrujte se' : 'Prijavite se'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
