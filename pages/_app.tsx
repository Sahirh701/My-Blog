import '../styles/globals.css';
import Link from 'next/link';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <nav className="navbar">
        <Link href="/" className="home-btn">🏠 Home</Link>
      </nav>
      <Component {...pageProps} />
    </>
  );
}