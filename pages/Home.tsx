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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">✨ My Stylish Blog ✨</h1>
      <p className="mb-4">Welcome to your modern markdown-powered blog.</p>
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">📊 Widget: Blog Stats</h2>
        <p>📝 Posts: {stats.posts}</p>
      </div>
      <form onSubmit={handleAddPost} className="mb-4">
        <h2 className="text-lg font-bold mb-2">Add New Blog Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300"
        />
        <textarea
          placeholder="Content (Markdown supported)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full p-2 mb-2 border border-gray-300"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Post
        </button>
      </form>
      <h2 className="text-lg font-bold mb-2">Blog Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="mb-2">
            <Link href={`/posts/${post.slug}`}>{post.slug.replace(/-/g, ' ')}</Link>
          </li>
        ))}
        {userPosts.map((post) => (
          <li key={post.slug} className="mb-2">
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