import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../src/supabaseClient';
import App from '../src/Auth/App'

const Login=() => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/src/Auth/App');
      else setUser(user);
    }
    getUser();
  }, []);
  if (user) return <div>Loading...</div>;
  ;
}
export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename) => {
    const slug = filename.replace('.md', '');
    return { slug };
  });

  return { props: { posts } };
}

export default function Home({ posts }: { posts: { slug: string }[] }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userPosts, setUserPosts] = useState<{ slug: string, title: string, content: string }[]>([]);
  const [stats, setStats] = useState({ posts: posts.length });
  const router = useRouter();

  useEffect(() => {
    // Load user posts from localStorage
    const stored = localStorage.getItem('userPosts');
    if (stored) setUserPosts(JSON.parse(stored));
  }, []);

  useEffect(() => {
    // Update localStorage and stats when userPosts changes
    localStorage.setItem('userPosts', JSON.stringify(userPosts));
    setStats({ posts: posts.length + userPosts.length });
  }, [userPosts, posts.length]);

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const slug = title.trim().toLowerCase().replace(/\s+/g, '-');
    setUserPosts([{ slug, title, content }, ...userPosts]);
    setTitle('');
    setContent('');
    router.push(`/posts/user-${slug}`);
  };

  return (
    <div className="main-content">
      <h1>✨ My Stylish Blog ✨</h1>
      <p>Welcome to your modern markdown-powered blog.</p>
      <div className="widget">
        <h3>📊 Widget: Blog Stats</h3>
        <ul>
          <li>📝 Posts: {stats.posts}</li>
        </ul>
      </div>
      <form
        onSubmit={handleAddPost}
        style={{
          margin: '2rem auto',
          background: '#f0f6ff',
          padding: '2rem',
          borderRadius: 16,
          maxWidth: 700,
          minWidth: 350,
          width: '100%',
          boxShadow: '0 4px 16px rgba(45,114,217,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Add New Blog Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            width: '80%',
            fontSize: '1.2rem',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: 8,
            border: '1px solid #ccc',
            textAlign: 'center',
          }}
        />
        <textarea
          placeholder="Content (Markdown supported)"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={8}
          style={{
            width: '80%',
            fontSize: '1.1rem',
            padding: '1rem',
            borderRadius: 8,
            border: '1px solid #ccc',
            marginBottom: '1rem',
            resize: 'vertical',
          }}
        />
        <button
          type="submit"
          style={{
            background: '#2d72d9',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.8rem 2.5rem',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
          }}
        >
          Add Post
        </button>
        <div style={{ fontSize: '1rem', color: '#888', marginTop: '0.5rem', textAlign: 'center' }}>
          (Note: New posts are only available in this browser and session.)
        </div>
      </form>
      <ul className="post-list">
        {/* Static posts */}
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`} className="post-link">
              {post.slug.replace(/-/g, ' ')}
            </Link>
          </li>
        ))}
        {/* User-added posts */}
        {userPosts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/user-${post.slug}`} className="post-link">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
