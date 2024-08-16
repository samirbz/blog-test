// Handle the submission of a new post
document.getElementById('submitPost').addEventListener('click', function() {
    const postTitle = document.getElementById('postTitle').value;
    const postText = document.getElementById('postText').value;

    if (postTitle && postText) {
        fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: postTitle, text: postText })
        })
        .then(response => response.json())
        .then(data => {
            alert('Post saved!');
            document.getElementById('postTitle').value = '';
            document.getElementById('postText').value = '';
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Please fill out both fields.');
    }
});

// Handle the display of all posts
document.getElementById('showPosts').addEventListener('click', function() {
    fetch('http://localhost:3000/posts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(posts => {
        const postsContainer = document.getElementById('postsContainer');
        postsContainer.innerHTML = ''; // Clear existing posts

        if (posts.length > 0) {
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.text}</p>
                `;
                postsContainer.appendChild(postElement);
            });
        } else {
            postsContainer.innerHTML = '<p>No posts available.</p>';
        }
    })
    .catch(error => console.error('Error:', error));
});