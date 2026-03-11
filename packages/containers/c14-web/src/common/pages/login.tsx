import { useForm } from 'react-hook-form';
import { useAppStore } from '../store/index.js';

export const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const auth = useAppStore((s) => s.user.auth);
  const error = useAppStore((s) => s.user.error);
  const loginUser = useAppStore((s) => s.loginUser);

  const onSubmit = (data: Record<string, unknown>) => {
    loginUser(data as { email: string; password: string });
  };

  return (
    <div>
      <header className="app-layout-header">
        <h2 className="text-primary">Login</h2>
      </header>
      <div className="app-layout-content">
        <div className="app-layout-page" style={{ maxWidth: '480px' }}>
          {auth ? <div className="alert alert-danger">Already logged in.</div> : null}
          {error.code ? <div className="alert alert-danger">{error.message}</div> : null}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="Enter email..."
                {...register('email')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter password..."
                {...register('password')}
              />
            </div>
            <div className="form-group">
              <button className="btn" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
