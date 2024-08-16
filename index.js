const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors')
app.use(cors())
app.use(bodyParser.json());

// Path to the posts.json file
const postsFilePath = path.join(__dirname, 'posts.json');

// Initialize the posts.json file if it doesn't exist
if (!fs.existsSync(postsFilePath)) {
    fs.writeFileSync(postsFilePath, JSON.stringify([]));
}

// Route to save a new post
app.post('/posts', (req, res) => {
    const { title, text } = req.body;

    if (!title || !text) {
        return res.status(400).json({ error: 'Title and text are required' });
    }

    // Read the current posts from the file
    const posts = JSON.parse(fs.readFileSync(postsFilePath));

    // Create a new post object
    const newPost = { id: Date.now(), title, text };

    // Add the new post to the list of posts
    posts.push(newPost);

    // Save the updated posts back to the file
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));

    // Respond with the newly created post
    res.status(201).json(newPost);
});

// Route to get all posts
app.get('/posts', (req, res) => {
    const posts = JSON.parse(fs.readFileSync(postsFilePath));
    res.json(posts);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});