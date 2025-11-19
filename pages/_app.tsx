import '../styles/globals.css';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../src/supabaseClient';

const SignOutButton = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      style={{
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '5px',
      }}
    >
      Sign Out
    </button>
  );
};

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && router.pathname !== '/') {
        router.push('/');
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    console.log(router.pathname); // Log the pathname
  }, [router.pathname]);

  return (
    <>
      <nav className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {router.pathname !== '/' && router.pathname !== '/src/Auth/SignIn' && router.pathname !== '/src/Auth/SignUp' && (
          <Link href="/Home" className="home-btn">🏠 Home</Link>
        )}
        {router.pathname !== '/' && (
          <div style={{ marginLeft: 'auto' }}>
            <SignOutButton />
          </div>
        )}
      </nav>
      <Component {...pageProps} />
    </>
  );
}
