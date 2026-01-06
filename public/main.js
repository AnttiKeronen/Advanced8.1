// LOGIN
document.getElementById('loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  // Muutettu id:t vastaamaan CodeGrade-testien odotuksia
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw await res.json();
    const data = await res.json();

    localStorage.setItem('token', data.token);
    localStorage.setItem('isAdmin', data.user.isAdmin);

    alert('Logged in successfully!');
    window.location.reload();
  } catch (err) {
    alert(err.message || 'Login failed');
  }
});

// POST topic & display
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
      if (!res.ok) throw await res.json();
      alert('Topic posted!');
      loadTopics();
    } catch (err) {
      alert(err.message || 'Error posting topic');
    }
  });
}

// LOAD topics
async function loadTopics() {
  const res = await fetch('/api/topics');
  const topics = await res.json();
  const topicsDiv = document.getElementById('topics');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  topicsDiv.innerHTML = topics.map(t => `
    <div class="card z-depth-2 hoverable grey lighten-2" data-id="${t._id}">
      <div class="card-content">
        <span class="card-title">${t.title}</span>
        <p>${t.content}</p>
        <p class="grey-text text-darken-2">${t.username} - ${new Date(t.createdAt).toLocaleString()}</p>
      </div>
      <div class="card-action">
        ${isAdmin ? `<button class="btn waves-effect waves-light delete-btn">Delete</button>` : ''}
      </div>
    </div>
  `).join('');

  if (isAdmin) {
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async e => {
        const id = e.target.closest('.card').dataset.id;
        try {
          const res = await fetch(`/api/topic/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) throw await res.json();
          alert('Topic deleted!');
          loadTopics();
        } catch (err) {
          alert(err.message || 'Error deleting topic');
        }
      });
    });
  }
}

loadTopics();

