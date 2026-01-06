document.getElementById('registerForm').addEventListener('submit', async e => {
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

    if (!res.ok) throw await res.json();
    alert('Registered successfully!');
    window.location.href = '/index.html';
  } catch (err) {
    alert(err.message || 'Error registering');
  }
});
