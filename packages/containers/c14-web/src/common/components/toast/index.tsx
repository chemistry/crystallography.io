export const ErrorToast = ({ error }: { error: string }) => (
  <div className="alert alert-danger" role="alert">
    {error}
  </div>
);
