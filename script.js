document.getElementById('submitPost').addEventListener('click', function() {
    const postTitle = document.getElementById('postTitle').value;
    const postText = document.getElementById('postText').value;

    if (postTitle && postText) {
        fetch('/posts', {
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

document.getElementById('showPosts').addEventListener('click', function() {
    fetch('/posts')
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.getElementById('postsContainer');
            postsContainer.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.text}</p>
                `;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error:', error));
});