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
        <h1>Register</h1>
        <hr />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ padding: '20px' }}>
            <div>
              Name:
              <input type="text" {...register('name')} />
            </div>
            <div>
              Email:
              <input type="text" {...register('email')} />
            </div>
            <div>
              Pwd:
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
