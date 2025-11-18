import fs from 'fs';
import path from 'path';

const statsFilePath = path.join(process.cwd(), 'data', 'blog-stats.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Read and return the current stats
    const stats = JSON.parse(fs.readFileSync(statsFilePath, 'utf8'));
    res.status(200).json(stats);
  } else if (req.method === 'POST') {
    // Update stats dynamically
    const { type } = req.body; // type can be 'like', 'comment', or 'post'
    const stats = JSON.parse(fs.readFileSync(statsFilePath, 'utf8'));

    if (type === 'like') {
      stats.likes += 1;
    } else if (type === 'comment') {
      stats.comments += 1;
    } else if (type === 'post') {
      stats.posts += 1;
    }

    fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));
    res.status(200).json(stats);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
