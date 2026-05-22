// Dashboard page - employee CRUD, search, modals
let employeesCache = [];
let deleteTargetId = null;

document.addEventListener('DOMContentLoaded', function () {
  // Protect route - redirect if not logged in
  if (!isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  const adminEmail = localStorage.getItem('adminEmail');
  if (adminEmail) {
    document.getElementById('adminEmailDisplay').textContent = adminEmail;
  }

  setupNavigation();
  setupSidebar();
  setupLogout();
  setupSearch();
  setupAddForm();
  setupEditModal();
  setupDeleteModal();
  setupProfileModal();

  loadEmployees();
});

// --- Load and display employees ---
async function loadEmployees(filters) {
  filters = filters || {};
  const tbody = document.getElementById('employeeTableBody');

  try {
    const data = await getEmployees(filters);
    employeesCache = data.employees || [];
    document.getElementById('totalCount').textContent = data.count;

    if (employeesCache.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No employees found. Add your first employee!</td></tr>';
      return;
    }

    tbody.innerHTML = employeesCache
      .map(function (emp) {
        const salary = formatSalary(emp.salary);
        const joinDate = formatDate(emp.joiningDate);
        return (
          '<tr data-id="' +
          emp._id +
          '">' +
          '<td><span class="badge">' +
          escapeHtml(emp.employeeId) +
          '</span></td>' +
          '<td>' +
          escapeHtml(emp.fullName) +
          '</td>' +
          '<td>' +
          escapeHtml(emp.email) +
          '</td>' +
          '<td>' +
          escapeHtml(emp.department) +
          '</td>' +
          '<td>' +
          escapeHtml(emp.jobPosition) +
          '</td>' +
          '<td>' +
          salary +
          '</td>' +
          '<td class="actions-cell">' +
          '<button type="button" class="btn-icon btn-view" data-id="' +
          emp._id +
          '" title="View">👁</button>' +
          '<button type="button" class="btn-icon btn-edit" data-id="' +
          emp._id +
          '" title="Edit">✏️</button>' +
          '<button type="button" class="btn-icon btn-delete" data-id="' +
          emp._id +
          '" data-name="' +
          escapeHtml(emp.fullName) +
          '" title="Delete">🗑</button>' +
          '</td></tr>'
        );
      })
      .join('');

    bindTableActions();
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state error">' + escapeHtml(err.message) + '</td></tr>';
    showToast(err.message, 'error');
  }
}

function bindTableActions() {
  document.querySelectorAll('.btn-edit').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openEditModal(btn.getAttribute('data-id'));
    });
  });

  document.querySelectorAll('.btn-delete').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openDeleteModal(btn.getAttribute('data-id'), btn.getAttribute('data-name'));
    });
  });

  document.querySelectorAll('.btn-view').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openProfileModal(btn.getAttribute('data-id'));
    });
  });
}

// --- Search ---
function setupSearch() {
  document.getElementById('searchBtn').addEventListener('click', applySearch);
  document.getElementById('clearSearchBtn').addEventListener('click', function () {
    document.getElementById('searchName').value = '';
    document.getElementById('searchDepartment').value = '';
    document.getElementById('searchEmployeeId').value = '';
    loadEmployees();
  });

  ['searchName', 'searchDepartment', 'searchEmployeeId'].forEach(function (id) {
    document.getElementById(id).addEventListener('keypress', function (e) {
      if (e.key === 'Enter') applySearch();
    });
  });
}

function applySearch() {
  loadEmployees({
    search: document.getElementById('searchName').value.trim(),
    department: document.getElementById('searchDepartment').value.trim(),
    employeeId: document.getElementById('searchEmployeeId').value.trim(),
  });
}

// --- Add employee ---
function setupAddForm() {
  document.getElementById('addEmployeeForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const payload = {
      employeeId: document.getElementById('addEmployeeId').value.trim(),
      fullName: document.getElementById('addFullName').value.trim(),
      email: document.getElementById('addEmail').value.trim(),
      phone: document.getElementById('addPhone').value.trim(),
      department: document.getElementById('addDepartment').value.trim(),
      jobPosition: document.getElementById('addJobPosition').value.trim(),
      salary: document.getElementById('addSalary').value,
      joiningDate: document.getElementById('addJoiningDate').value,
    };

    if (!validateEmployeeForm(payload)) {
      showToast('Please fill all required fields correctly', 'error');
      return;
    }

    try {
      await addEmployee(payload);
      showToast('Employee added successfully!', 'success');
      document.getElementById('addEmployeeForm').reset();
      switchSection('employees');
      loadEmployees();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

// --- Edit modal ---
function setupEditModal() {
  document.getElementById('editEmployeeForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('editMongoId').value;

    const payload = {
      employeeId: document.getElementById('editEmployeeId').value.trim(),
      fullName: document.getElementById('editFullName').value.trim(),
      email: document.getElementById('editEmail').value.trim(),
      phone: document.getElementById('editPhone').value.trim(),
      department: document.getElementById('editDepartment').value.trim(),
      jobPosition: document.getElementById('editJobPosition').value.trim(),
      salary: document.getElementById('editSalary').value,
      joiningDate: document.getElementById('editJoiningDate').value,
    };

    if (!validateEmployeeForm(payload)) {
      showToast('Please fill all required fields correctly', 'error');
      return;
    }

    try {
      await updateEmployee(id, payload);
      showToast('Employee updated successfully!', 'success');
      closeModal('editModal');
      loadEmployees();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  document.getElementById('closeEditModal').addEventListener('click', function () {
    closeModal('editModal');
  });
  document.getElementById('cancelEdit').addEventListener('click', function () {
    closeModal('editModal');
  });
  document.getElementById('editModalOverlay').addEventListener('click', function () {
    closeModal('editModal');
  });
}

async function openEditModal(id) {
  try {
    const emp = await getEmployee(id);
    document.getElementById('editMongoId').value = emp._id;
    document.getElementById('editEmployeeId').value = emp.employeeId;
    document.getElementById('editFullName').value = emp.fullName;
    document.getElementById('editEmail').value = emp.email;
    document.getElementById('editPhone').value = emp.phone;
    document.getElementById('editDepartment').value = emp.department;
    document.getElementById('editJobPosition').value = emp.jobPosition;
    document.getElementById('editSalary').value = emp.salary;
    document.getElementById('editJoiningDate').value = formatDateInput(emp.joiningDate);
    openModal('editModal');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// --- Profile modal ---
function setupProfileModal() {
  document.getElementById('closeProfileModal').addEventListener('click', function () {
    closeModal('profileModal');
  });
  document.getElementById('profileModalOverlay').addEventListener('click', function () {
    closeModal('profileModal');
  });
}

async function openProfileModal(id) {
  try {
    const emp = await getEmployee(id);
    document.getElementById('profileContent').innerHTML =
      '<div class="profile-grid">' +
      profileRow('Employee ID', emp.employeeId) +
      profileRow('Full Name', emp.fullName) +
      profileRow('Email', emp.email) +
      profileRow('Phone', emp.phone) +
      profileRow('Department', emp.department) +
      profileRow('Job Position', emp.jobPosition) +
      profileRow('Salary', formatSalary(emp.salary)) +
      profileRow('Joining Date', formatDate(emp.joiningDate)) +
      '</div>';
    openModal('profileModal');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function profileRow(label, value) {
  return (
    '<div class="profile-row"><span class="profile-label">' +
    label +
    '</span><span class="profile-value">' +
    escapeHtml(String(value)) +
    '</span></div>'
  );
}

// --- Delete ---
function setupDeleteModal() {
  document.getElementById('confirmDelete').addEventListener('click', async function () {
    if (!deleteTargetId) return;
    try {
      await deleteEmployee(deleteTargetId);
      showToast('Employee deleted', 'success');
      closeModal('deleteModal');
      loadEmployees();
    } catch (err) {
      showToast(err.message, 'error');
    }
    deleteTargetId = null;
  });

  document.getElementById('cancelDelete').addEventListener('click', function () {
    closeModal('deleteModal');
    deleteTargetId = null;
  });
  document.getElementById('deleteModalOverlay').addEventListener('click', function () {
    closeModal('deleteModal');
  });
}

function openDeleteModal(id, name) {
  deleteTargetId = id;
  document.getElementById('deleteConfirmText').textContent =
    'Are you sure you want to delete "' + name + '"? This cannot be undone.';
  openModal('deleteModal');
}

// --- Navigation ---
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const section = item.getAttribute('data-section');
      switchSection(section);
    });
  });
}

function switchSection(section) {
  document.querySelectorAll('.nav-item').forEach(function (n) {
    n.classList.toggle('active', n.getAttribute('data-section') === section);
  });

  document.getElementById('employeesSection').classList.toggle('active', section === 'employees');
  document.getElementById('addSection').classList.toggle('active', section === 'add');

  document.getElementById('pageTitle').textContent =
    section === 'add' ? 'Add Employee' : 'Employee Dashboard';

  if (window.innerWidth < 768) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

function setupSidebar() {
  document.getElementById('sidebarToggle').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('open');
  });
}

function setupLogout() {
  document.getElementById('logoutBtn').addEventListener('click', function () {
    clearAuth();
    showToast('Logged out successfully', 'success');
    setTimeout(function () {
      window.location.href = 'index.html';
    }, 500);
  });
}

// --- Helpers ---
function validateEmployeeForm(data) {
  if (!data.employeeId || !data.fullName || !data.email || !data.phone) return false;
  if (!data.department || !data.jobPosition || !data.joiningDate) return false;
  if (data.salary === '' || isNaN(Number(data.salary)) || Number(data.salary) < 0) return false;
  if (!data.email.includes('@')) return false;
  return true;
}

function formatSalary(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateInput(dateStr) {
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function openModal(id) {
  document.getElementById(id).classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
  document.body.style.overflow = '';
}

function showToast(message, type) {
  type = type || 'info';
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(function () {
    toast.classList.add('fade-out');
    setTimeout(function () {
      toast.remove();
    }, 300);
  }, 3000);
}
