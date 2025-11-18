import fs from 'fs';
import path from 'path';

const statsFilePath = path.join(process.cwd(), 'data', 'post-stats.json');

export default function handler(req, res) {
  const { slug } = req.query;

  // Read the stats file
  const stats = JSON.parse(fs.readFileSync(statsFilePath, 'utf8'));

  if (req.method === 'GET') {
    // Return stats for the specific post
    const postStats = stats[slug] || { likes: 0, comments: 0 };
    res.status(200).json(postStats);
  } else if (req.method === 'POST') {
    // Update stats for the specific post
    const { type } = req.body; // type can be 'like' or 'comment'
    if (!stats[slug]) {
      stats[slug] = { likes: 0, comments: 0 };
    }

    if (type === 'like') {
      stats[slug].likes += 1;
    } else if (type === 'comment') {
      stats[slug].comments += 1;
    }

    fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));
    res.status(200).json(stats[slug]);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
