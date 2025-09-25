import { Link, Outlet, useNavigate } from '@tanstack/react-router';

import { logoutUser } from '../api/auth';
import { useAuthSession } from '../hooks/useAuthSession';

export function Layout() {
  const session = useAuthSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate({ to: '/login' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold text-primary-600">
            Alt Platform
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            <Link to="/" className="hover:text-primary-600">
              Home
            </Link>
            {session ? (
              <>
                <span className="hidden text-sm text-slate-500 sm:inline">
                  {session.user.firstName} {session.user.lastName}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md border border-transparent bg-slate-900 px-3 py-1 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-600">
                  Se connecter
                </Link>
                <Link to="/register" className="hover:text-primary-600">
                  Créer un compte
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
