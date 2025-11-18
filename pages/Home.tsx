import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../src/supabaseClient';

const Home = ({ posts }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [stats, setStats] = useState({ posts: posts.length });
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/');
    };
    getUser();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('userPosts');
    if (stored) setUserPosts(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('userPosts', JSON.stringify(userPosts));
    setStats({ posts: posts.length + userPosts.length });
  }, [userPosts, posts.length]);

  const handleAddPost = (e) => {
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
      <form onSubmit={handleAddPost}>
        <h2>Add New Blog Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content (Markdown supported)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
        />
        <button type="submit">Add Post</button>
      </form>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`}>{post.slug.replace(/-/g, ' ')}</Link>
          </li>
        ))}
        {userPosts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/user-${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);
  const posts = filenames.map((filename) => {
    const slug = filename.replace('.md', '');
    return { slug };
  });
  return { props: { posts } };
}

export default Home;