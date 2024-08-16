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