document.addEventListener('DOMContentLoaded', () => {
  let links = JSON.parse(localStorage.getItem('mediaLinks')) || [];
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
    let image = document.getElementById('image').value;

    if (!image && url) {
      document.getElementById('loading').style.display = 'block';
      try {
        const response = await fetch(`/screenshot?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        if (data.image) {
          image = data.image;
        }
      } catch (error) {
        console.error('Failed to get screenshot:', error);
      }
      document.getElementById('loading').style.display = 'none';
    }

    if (editingIndex >= 0) {
      links[editingIndex] = { title, url, image };
    } else {
      links.push({ title, url, image });
    }

    localStorage.setItem('mediaLinks', JSON.stringify(links));
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
        <img src="${link.image || 'images/default.svg'}" alt="${link.title}">
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
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      links.splice(index, 1);
      localStorage.setItem('mediaLinks', JSON.stringify(links));
      renderLinks(links);
    });
  });
}