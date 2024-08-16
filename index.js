const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());

const postsFile = 'posts.json';

// Create or read posts file
if (!fs.existsSync(postsFile)) {
    fs.writeFileSync(postsFile, JSON.stringify([]));
}

// Route to save a new post
app.post('/posts', (req, res) => {
    const { title, text } = req.body;
    if (!title || !text) {
        return res.status(400).json({ error: 'Title and text are required' });
    }

    const posts = JSON.parse(fs.readFileSync(postsFile));
    const newPost = { id: Date.now(), title, text };
    posts.push(newPost);

    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));

    res.status(201).json(newPost);
});

// Route to get all posts
app.get('/posts', (req, res) => {
    const posts = JSON.parse(fs.readFileSync(postsFile));
    res.json(posts);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});