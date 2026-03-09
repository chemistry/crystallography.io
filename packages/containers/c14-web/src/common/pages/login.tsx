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
        <h1>Login</h1>
        <hr />
        <div>
          <b>{auth ? 'Logged IN' : null}</b>
        </div>
        <>{error.code ? error.message : null}</>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ padding: '20px' }}>
            <div>
              Email:
              <input type="text" {...register('email')} />
            </div>
            <div>
              Password:
              <input type="text" {...register('password')} />
            </div>
            <div>
              <input type="submit" name="Submit" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
