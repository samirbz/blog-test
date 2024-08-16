// Handle the submission of a new post
document.getElementById('submitPost').addEventListener('click', function () {
	const postTitle = document.getElementById('postTitle').value;
	const postText = document.getElementById('postText').value;
	const postImage = document.getElementById('postImage').files[0];

	if (postTitle && postText) {
		const formData = new FormData();
		formData.append('title', postTitle);
		formData.append('text', postText);
		if (postImage) {
			formData.append('image', postImage);
		}

		fetch('http://localhost:3000/posts', {
			method: 'POST',
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				alert('Post saved!');
				document.getElementById('postTitle').value = '';
				document.getElementById('postText').value = '';
				document.getElementById('postImage').value = '';
				displayPosts(); // Refresh the list of posts after saving
			})
			.catch(error => console.error('Error:', error));
	} else {
		alert('Please fill out both fields.');
	}
});

// Handle the display of all posts
document.getElementById('showPosts').addEventListener('click', function () {
	displayPosts();
});

// Function to display all posts
function displayPosts() {
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
<div class="card">
${post.imageUrl ? `<img src="/public/${post.imageUrl}" alt="Post Image" class="post-image">` : ''}
<h3>${post.title}</h3>
<p>${post.text}</p>
<button class="deletePost" data-id="${post.id}">Delete</button>
</div>
`;
					postsContainer.appendChild(postElement);
				});

				// Add event listeners to all delete buttons
				document.querySelectorAll('.deletePost').forEach(button => {
					button.addEventListener('click', function () {
						const postId = this.getAttribute('data-id');
						deletePost(postId);
					});
				});
			} else {
				postsContainer.innerHTML = '<p>No posts available.</p>';
			}
		})
		.catch(error => console.error('Error:', error));
}

// Function to delete a post
function deletePost(postId) {
	fetch(`http://localhost:3000/posts/${postId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => response.json())
		.then(data => {
			alert('Post deleted!');
			displayPosts(); // Refresh the list of posts after deletion
		})
		.catch(error => console.error('Error:', error));
}