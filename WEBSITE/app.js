// Dog Rescue app
// Stores dogs in memory as a JSON-based array (simulating AJAX/JSON data store)

let dogs = [];

// ─── Navigation ───────────────────────────────────────────────────────────────
function showView(viewId) {
  // Hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  // Deactivate all nav buttons
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  // Show target view
  document.getElementById('view-' + viewId).classList.add('active');
  // Activate matching nav button
  const btn = document.querySelector('[data-view="' + viewId + '"]');
  if (btn) btn.classList.add('active');

  // Refresh view-specific content
  if (viewId === 'view') renderDogsTable();
  if (viewId === 'home') updateStats();
  if (viewId === 'find') {
    document.getElementById('search-input').value = '';
    hideSearchResult();
  }
}

// ─── Add Dog ──────────────────────────────────────────────────────────────────
function addDog() {
  const name   = document.getElementById('dog-name').value.trim();
  const breed  = document.getElementById('dog-breed').value.trim();
  const age    = document.getElementById('dog-age').value.trim();
  const weight = document.getElementById('dog-weight').value.trim();

  hideAlerts();

  // Validation
  if (!name || !breed || !age || !weight) {
    showError('add-error', 'Please fill in all fields before registering the dog.');
    return;
  }
  if (isNaN(age) || Number(age) < 0 || Number(age) > 30) {
    showError('add-error', 'Age must be a number between 0 and 30.');
    return;
  }
  if (isNaN(weight) || Number(weight) < 1 || Number(weight) > 300) {
    showError('add-error', 'Weight must be a number between 1 and 300 lbs.');
    return;
  }

  // Build dog object (simulating JSON data format)
  const dog = {
    id: Date.now(),
    name:   capitalise(name),
    breed:  capitalise(breed),
    age:    Number(age),
    weight: Number(weight)
  };

  // Simulate async AJAX save
  simulateAjaxSave(dog, function(success) {
    if (success) {
      dogs.push(dog);
      updateDogCount();
      showSuccess('add-success', `🐶 ${dog.name} has been added to the rescue!`);
      clearForm();
    } else {
      showError('add-error', 'Server error. Please try again.');
    }
  });
}

// Simulate AJAX POST (async JSON store)
function simulateAjaxSave(dog, callback) {
  setTimeout(function() {
    // Simulate 100% success (in real app, would POST to server)
    const jsonPayload = JSON.stringify(dog);
    console.log('[AJAX] POST /api/dogs — Payload:', jsonPayload);
    callback(true);
  }, 280);
}

// Simulate AJAX GET (fetch dog list)
function simulateAjaxFetch(callback) {
  setTimeout(function() {
    const jsonResponse = JSON.stringify(dogs);
    console.log('[AJAX] GET /api/dogs — Response:', jsonResponse);
    callback(JSON.parse(jsonResponse));
  }, 180);
}

// ─── View Dogs ────────────────────────────────────────────────────────────────
function renderDogsTable() {
  simulateAjaxFetch(function(data) {
    const tbody = document.getElementById('dogs-tbody');
    const tableWrap = document.getElementById('dogs-table-wrap');
    const emptyState = document.getElementById('dogs-empty');

    tbody.innerHTML = '';

    if (data.length === 0) {
      tableWrap.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    tableWrap.classList.remove('hidden');
    emptyState.classList.add('hidden');

    data.forEach(function(dog, i) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="dog-num">${i + 1}</td>
        <td class="dog-name-cell">${escHtml(dog.name)}</td>
        <td>${escHtml(dog.breed)}</td>
        <td>${dog.age} yr${dog.age !== 1 ? 's' : ''}</td>
        <td>${dog.weight} lbs</td>
        <td><button class="btn btn-danger" onclick="removeDog(${dog.id})">Remove</button></td>
      `;
      tbody.appendChild(tr);
    });
  });
}

function removeDog(id) {
  dogs = dogs.filter(function(d) { return d.id !== id; });
  updateDogCount();
  renderDogsTable();
}

// ─── Find Dog ─────────────────────────────────────────────────────────────────
function findDog() {
  const query = document.getElementById('search-input').value.trim();
  const resultEl = document.getElementById('search-result');

  if (!query) {
    resultEl.className = 'search-result not-found';
    resultEl.innerHTML = '⚠️ Please enter a dog name to search.';
    resultEl.classList.remove('hidden');
    return;
  }

  // Simulate AJAX search
  simulateAjaxFetch(function(data) {
    const found = data.find(function(d) {
      return d.name.toLowerCase() === query.toLowerCase();
    });

    resultEl.classList.remove('hidden');

    if (found) {
      resultEl.className = 'search-result found';
      resultEl.innerHTML = `
        <div class="search-result-card">
          ✅ <strong>Found: ${escHtml(found.name)}</strong><br/>
          <strong>Breed:</strong> ${escHtml(found.breed)}<br/>
          <strong>Age:</strong> ${found.age} year${found.age !== 1 ? 's' : ''}<br/>
          <strong>Weight:</strong> ${found.weight} lbs
        </div>`;
    } else {
      resultEl.className = 'search-result not-found';
      resultEl.innerHTML = `❌ Sorry, unable to find <strong>${escHtml(query)}</strong> in the rescue database.`;
    }
  });
}

function hideSearchResult() {
  document.getElementById('search-result').classList.add('hidden');
}

// ─── Quit ─────────────────────────────────────────────────────────────────────
function handleQuit() {
  showView('quit');
}

// ─── Stats & Counters ─────────────────────────────────────────────────────────
function updateDogCount() {
  const label = dogs.length === 1 ? '1 dog in rescue' : `${dogs.length} dogs in rescue`;
  document.getElementById('dog-count').textContent = label;
  updateStats();
}

function updateStats() {
  document.getElementById('stat-total').textContent = dogs.length;

  const breeds = new Set(dogs.map(function(d) { return d.breed; })).size;
  document.getElementById('stat-breeds').textContent = breeds || 0;

  if (dogs.length > 0) {
    const avgAge = (dogs.reduce(function(s, d) { return s + d.age; }, 0) / dogs.length).toFixed(1);
    document.getElementById('stat-avg-age').textContent = avgAge;
  } else {
    document.getElementById('stat-avg-age').textContent = '—';
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function clearForm() {
  ['dog-name','dog-breed','dog-age','dog-weight'].forEach(function(id) {
    document.getElementById(id).value = '';
  });
  hideAlerts();
}

function hideAlerts() {
  document.getElementById('add-success').classList.add('hidden');
  document.getElementById('add-error').classList.add('hidden');
}

function showSuccess(id, msg) {
  const el = document.getElementById(id);
  document.getElementById(id + '-msg').textContent = msg;
  el.classList.remove('hidden');
  setTimeout(function() { el.classList.add('hidden'); }, 4000);
}

function showError(id, msg) {
  const el = document.getElementById(id);
  document.getElementById(id + '-msg').textContent = msg;
  el.classList.remove('hidden');
}

function capitalise(str) {
  return str.replace(/\b\w/g, function(c) { return c.toUpperCase(); });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Seed data (3 sample dogs for testing) ────────────────────────────────────
(function seedData() {
  const samples = [
    { id: 1, name: 'Josh',   breed: 'German Shorthaired Pointer', age: 8, weight: 55 },
    { id: 2, name: 'Brooke', breed: 'Labrador Retriever',         age: 5, weight: 32 },
    { id: 3, name: 'Justin', breed: 'Vizsla',                     age: 2, weight: 37 }
  ];
  dogs = samples;
  updateDogCount();
})();
