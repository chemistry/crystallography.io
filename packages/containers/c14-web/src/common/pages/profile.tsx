import { useAppStore } from '../store/index.js';

export const ProfilePage = () => {
  const auth = useAppStore((s) => s.user.auth);

  return (
    <div>
      <header className="app-layout-header">
        <h2 className="text-primary">Profile</h2>
      </header>
      <div className="app-layout-content">
        <div className="app-layout-page" style={{ maxWidth: '600px' }}>
          {auth ? (
            <p>You are logged in.</p>
          ) : (
            <p className="text-gray">Please log in to view your profile.</p>
          )}
        </div>
      </div>
    </div>
  );
};
