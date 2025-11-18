# Hello World

Welcome to my sample markdown file!

## Features

- Easy to read
- Supports **bold** and _italic_ text
- Code highlighting

## Example Code

```python
def hello():
    print("Hello, world!")
```

Enjoy writing in Markdown!

const API_URL = process.env.API_URL; // Use environment variable, not hardcoded 'testdomain'

async function getMenu(handle) {
  try {
    const res = await fetch(`${API_URL}/menu?handle=${handle}`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (error) {
    // Handle error gracefully
    return { items: [] };
  }
}