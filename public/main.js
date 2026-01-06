document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail')?.value.trim();
  const password = document.getElementById('loginPassword')?.value.trim();

  try {
    const res = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('isAdmin', data.user.isAdmin);

    alert('Logged in successfully!');
    window.location.reload();
  } catch (err) {
    alert('Error occurred: ' + err.message);
  }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email')?.value.trim();
  const username = document.getElementById('username')?.value.trim();
  const password = document.getElementById('password')?.value.trim();
  const isAdmin = document.getElementById('isAdmin')?.checked || false;

  try {
    const res = await fetch('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password, isAdmin })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }

    alert('User registered successfully!');
    window.location.href = '/index.html';
  } catch (err) {
    alert('Error occurred: ' + err.message);
  }
});

const token = localStorage.getItem('token');

if (token) {
  const topicFormDiv = document.getElementById('topicForm');

  topicFormDiv.innerHTML = `
    <h4>Create Topic</h4>
    <input id="topicTitle" placeholder="Title">
    <textarea id="topicText" class="materialize-textarea" placeholder="Content"></textarea>
    <button id="postTopic" class="btn waves-effect waves-light">Post</button>
  `;

  document.getElementById('postTopic').addEventListener('click', async () => {
    const title = document.getElementById('topicTitle').value.trim();
    const content = document.getElementById('topicText').value.trim();

    try {
      const res = await fetch('/api/topic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to post topic');
      }

      alert('Topic posted!');
      loadTopics();
    } catch (err) {
      alert('Error occurred: ' + err.message);
    }
  });
}
async function loadTopics() {
  try {
    const res = await fetch('/api/topics');
    const topics = await res.json();

    const topicsDiv = document.getElementById('topics');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    topicsDiv.innerHTML = topics.map(t => `
      <div class="card z-depth-2 hoverable grey lighten-2" data-id="${t._id}">
        <div class="card-content">
          <span class="card-title">${t.title}</span>
          <p>${t.content}</p>
          <p class="grey-text text-darken-2">
            ${t.username} - ${new Date(t.createdAt).toLocaleString()}
          </p>
          ${isAdmin ? `<button class="btn red delete-btn">Delete</button>` : ``}
        </div>
      </div>
    `).join('');

    if (isAdmin) {
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.closest('.card').dataset.id;

          try {
            const res = await fetch(`/api/topic/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.message || 'Delete failed');
            }

            alert('Topic deleted successfully.');
            loadTopics();
          } catch (err) {
            alert('Error occurred: ' + err.message);
          }
        });
      });
    }

  } catch (err) {
    alert('Error loading topics');
  }
}

loadTopics();
