document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  try {
    const res = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    localStorage.setItem('token', data.token);
    alert('Logged in successfully!');
    window.location.reload();
  } catch (err) {
    alert('Error occurred: ' + err.message);
  }
});
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const isAdmin = document.getElementById('isAdmin').checked;
  try {
    const res = await fetch('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password, isAdmin })
    });
    if (!res.ok) throw new Error('Registration failed');
    const data = await res.json();
    alert('User registered!');
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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });
      if (!res.ok) throw new Error('Failed to post topic');
      const data = await res.json();
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
    topicsDiv.innerHTML = topics.map(t => `
      <div class="card z-depth-2 hoverable grey lighten-2">
        <div class="card-content">
          <span class="card-title">${t.title}</span>
          <p>${t.content}</p>
          <p class="grey-text text-darken-2">${t.username} - ${new Date(t.createdAt).toLocaleString()}</p>
        </div>
      </div>
    `).join('');
  } catch (err) {
    alert('Error loading topics');
  }
}
loadTopics();
