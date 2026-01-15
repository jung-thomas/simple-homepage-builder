document.addEventListener('DOMContentLoaded', async () => {
  let links = [];
  try {
    const response = await fetch('/api/links');
    links = await response.json();
  } catch (error) {
    console.error('Failed to load links:', error);
  }
  let editingIndex = -1;

  renderLinks(links);

  // Add link functionality
  document.getElementById('add-link-btn').addEventListener('click', () => {
    editingIndex = -1;
    document.getElementById('add-link-form').style.display = 'block';
  });

  document.getElementById('save-link').addEventListener('click', async () => {
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const image = document.getElementById('image').value;

    if (editingIndex >= 0) {
      links[editingIndex] = { title, url, image };
    } else {
      links.push({ title, url, image });
    }

    // Save to server
    try {
      await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(links)
      });
    } catch (error) {
      console.error('Failed to save links:', error);
    }

    renderLinks(links);

    // Hide form and clear inputs
    document.getElementById('add-link-form').style.display = 'none';
    document.getElementById('title').value = '';
    document.getElementById('url').value = '';
    document.getElementById('image').value = '';
    editingIndex = -1;
  });
});

function renderLinks(links) {
  const grid = document.getElementById('links-grid');
  grid.innerHTML = '';
  links.forEach((link, index) => {
    const card = document.createElement('div');
    card.className = 'media-card';
    card.innerHTML = `
      <a href="${link.url}" target="_blank" class="card-link">
        <img src="${link.image || 'images/default.png'}" alt="${link.title}">
        <h3>${link.title}</h3>
      </a>
      <button class="edit-btn" data-index="${index}">Edit</button>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    grid.appendChild(card);
  });

  // Add event listeners for edit and delete
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      const link = links[index];
      document.getElementById('title').value = link.title;
      document.getElementById('url').value = link.url;
      document.getElementById('image').value = link.image;
      editingIndex = index;
      document.getElementById('add-link-form').style.display = 'block';
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      links.splice(index, 1);
      try {
        await fetch('/api/links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(links)
        });
      } catch (error) {
        console.error('Failed to save links:', error);
      }
      renderLinks(links);
    });
  });
}