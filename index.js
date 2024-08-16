const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json());

app.use(express.json());
app.use(express.static('public')); // Serve static files from the public directory

const postsFilePath = 'posts.json';

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images'); // Save images to public/images directory
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
    }
});

const upload = multer({ storage: storage });

// Route to get all posts
app.get('/posts', (req, res) => {
    const posts = JSON.parse(fs.readFileSync(postsFilePath));
    res.json(posts);
});

// Route to create a new post
app.post('/posts', upload.single('image'), (req, res) => {
    const { title, text } = req.body;
    const imageUrl = req.file ? `/images/${req.file.filename}` : null;

    const posts = JSON.parse(fs.readFileSync(postsFilePath));
    const newPost = { id: Date.now(), title, text, imageUrl };
    posts.push(newPost);

    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
    res.json(newPost);
});

// Route to delete a post by ID
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);

    // Read the current posts from the file
    const posts = JSON.parse(fs.readFileSync(postsFilePath));

    // Find the post to be deleted
    const postToDelete = posts.find(post => post.id === postId);
    if (postToDelete && postToDelete.imageUrl) {
        fs.unlinkSync(path.join(__dirname, 'public', postToDelete.imageUrl));
    }

    // Filter out the post with the given ID
    const updatedPosts = posts.filter(post => post.id !== postId);

    // Save the updated posts back to the file
    fs.writeFileSync(postsFilePath, JSON.stringify(updatedPosts, null, 2));

    // Respond with a success message
    res.json({ message: 'Post deleted successfully' });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});