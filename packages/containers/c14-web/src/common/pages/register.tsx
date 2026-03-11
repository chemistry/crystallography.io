import { useForm } from 'react-hook-form';

export const RegisterPage = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (_data: Record<string, unknown>) => {};

  return (
    <div>
      <header className="app-layout-header">
        <h2 className="text-primary">Register</h2>
      </header>
      <div className="app-layout-content">
        <div className="app-layout-page" style={{ maxWidth: '480px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter name..."
                {...register('name')}
              />
            </div>
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
              <button className="btn btn-primary" type="submit">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
