import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/auth';

const CognitoCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verify } = useAuthContext();

  useEffect(() => {
    // Later you can parse `location.search` if you want to debug
    // For now, just re-verify auth and then send them to the app
    const run = async () => {
      try {
        await verify(); // whatever you already use to check session
        navigate('/dashboard', { replace: true });
      } catch {
        navigate('/auth/login', { replace: true });
      }
    };

    run();
  }, [location.search, navigate, verify]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-sm text-gray-600">
        Signing you in with your provider...
      </p>
    </div>
  );
};

export { CognitoCallback };
