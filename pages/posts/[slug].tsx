import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const paths = filenames.map((filename) => ({
    params: { slug: filename.replace('.md', '') },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filePath = path.join(postsDirectory, `${params.slug}.md`);
  let contentHtml = '';
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { content } = matter(fileContents);
    const processedContent = await remark().use(html).process(content);
    contentHtml = processedContent.toString();
  } catch {
    // Not a static post, will handle client-side
  }
  return { props: { contentHtml, slug: params.slug } };
}

export default function Post({ contentHtml, slug }: { contentHtml: string; slug: string }) {
  const [userPost, setUserPost] = useState<{ title: string, content: string } | null>(null);
  const [stats, setStats] = useState({ likes: 0, comments: 0 });
  const [commentInput, setCommentInput] = useState('');

  // Determine the actual slug for API (remove 'user-' prefix if present)
  const apiSlug = slug.startsWith('user-') ? slug.replace(/^user-/, '') : slug;

  useEffect(() => {
    if (slug.startsWith('user-')) {
      const stored = localStorage.getItem('userPosts');
      if (stored) {
        const posts = JSON.parse(stored);
        const found = posts.find((p: any) => `user-${p.slug}` === slug);
        if (found) setUserPost(found);
      }
    }
    // Fetch stats for both static and user-added posts
    fetch(`/api/stats/${apiSlug}`)
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, [slug, apiSlug]);

  const handleLike = () => {
    fetch(`/api/stats/${apiSlug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'like' }),
    })
      .then((res) => res.json())
      .then((data) => setStats(data));
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    fetch(`/api/stats/${apiSlug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'comment' }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setCommentInput('');
      });
  };

  // Render user-added post with likes/comments
  if (slug.startsWith('user-') && userPost) {
    return (
      <div className="main-content">
        <div className="markdown-content">
          <h1>{userPost.title}</h1>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{userPost.content}</pre>
        </div>
        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <button
            onClick={handleLike}
            style={{
              background: '#2d72d9',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '1rem',
              marginRight: '1rem',
            }}
          >
            👍 Like ({stats.likes})
          </button>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleComment} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a comment..."
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#2d72d9',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Comment
            </button>
          </form>
          <ul style={{ marginTop: '1rem', paddingLeft: 0, listStyle: 'none' }}>
            {Array.from({ length: stats.comments }).map((_, i) => (
              <li
                key={i}
                style={{
                  background: '#f0f6ff',
                  marginBottom: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                }}
              >
                Comment #{i + 1}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <button
          onClick={handleLike}
          style={{
            background: '#2d72d9',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '1rem',
            marginRight: '1rem',
          }}
        >
          👍 Like ({stats.likes})
        </button>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleComment} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />
          <button
            type="submit"
            style={{
              background: '#2d72d9',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Comment
          </button>
        </form>
        <ul style={{ marginTop: '1rem', paddingLeft: 0, listStyle: 'none' }}>
          {Array.from({ length: stats.comments }).map((_, i) => (
            <li
              key={i}
              style={{
                background: '#f0f6ff',
                marginBottom: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
              }}
            >
              Comment #{i + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
