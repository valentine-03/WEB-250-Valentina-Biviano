/**
 * WEB 250: Assignment 12 - REST API Server
 * Valentina Biviano
 * 4/16/2026
 */
const recordForm = document.getElementById('record-form');
const tableBody = document.getElementById('records-table-body');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

document.addEventListener('DOMContentLoaded', fetchRecords);

// READ
async function fetchRecords() {
    try {
        const response = await fetch('/api/records'); // ✅ FIXED
        if (!response.ok) throw new Error('Network response was not ok');
        
        const records = await response.json();
        
        tableBody.innerHTML = '';
        records.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.location}</td>
                <td>${record.acresBurned}</td>
                <td>${record.dateReported}</td>
                <td>
                    <button class="edit-btn" onclick="prepareEdit(${record.id}, '${record.location}', ${record.acresBurned}, '${record.dateReported}')">Edit</button>
                    <button class="delete-btn" onclick="deleteRecord(${record.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

recordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('record-id').value;
    const data = {
        location: document.getElementById('location').value,
        acresBurned: Number(document.getElementById('acres').value),
        dateReported: document.getElementById('date').value
    };

    if (id) {
        // UPDATE
        await fetch(`/api/records/${id}`, { // ✅ FIXED
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } else {
        // CREATE
        await fetch('/api/records', { // ✅ FIXED
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    resetForm();
    fetchRecords();
});

// DELETE
async function deleteRecord(id) {
    if (confirm('Are you sure?')) {
        await fetch(`/api/records/${id}`, { method: 'DELETE' }); // ✅ FIXED
        fetchRecords();
    }
}

function prepareEdit(id, location, acres, date) {
    document.getElementById('record-id').value = id;
    document.getElementById('location').value = location;
    document.getElementById('acres').value = acres;
    document.getElementById('date').value = date;
    
    submitBtn.innerText = 'Update Record';
    cancelBtn.style.display = 'inline-block';
    document.getElementById('form-title').innerText = 'Edit Record';
}

function resetForm() {
    recordForm.reset();
    document.getElementById('record-id').value = '';
    submitBtn.innerText = 'Save Record';
    cancelBtn.style.display = 'none';
    document.getElementById('form-title').innerText = 'Add New Record';
}

cancelBtn.addEventListener('click', resetForm);