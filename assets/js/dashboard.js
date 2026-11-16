function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

async function loadDashboard() {
  const studentContainer = document.getElementById("studentRequests");
  const mentorContainer = document.getElementById("mentorRequests");

  try {
    const response = await fetch("backend/api/request.php");
    const result = await response.json();

    if (response.status === 401) {
      window.location.href = "login.html";
      return;
    }

    if (!response.ok || result.status !== "success") {
      alert(result.message || "Failed to load dashboard.");
      return;
    }

    if (studentContainer) {
      renderStudentRequests(studentContainer, result.requests);
    }

    if (mentorContainer) {
      renderMentorRequests(mentorContainer, result.requests);
    }
  } catch (err) {
    alert("Error loading dashboard data.");
  }
}

function renderStudentRequests(container, requests) {
  if (!requests.length) {
    container.innerHTML = `
      <div class="card">
        <p style="color: var(--text-muted); margin-bottom: 1rem;">You haven't sent any mentorship requests yet.</p>
        <a href="browse.html" class="btn btn-primary">Browse Mentors</a>
      </div>
    `;
    return;
  }

  container.innerHTML = requests
    .map(
      (req) => `
      <div class="card" style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3 class="card-title">${escapeHtml(req.mentor_name)}</h3>
          <p class="card-subtitle" style="margin: 0;">${escapeHtml(req.job_role)} • ${escapeHtml(req.industry)}</p>
          ${
            req.mentor_email
              ? `<p style="font-size: 0.875rem; margin-top: 0.4rem;">Contact: <a href="mailto:${escapeHtml(req.mentor_email)}">${escapeHtml(req.mentor_email)}</a></p>`
              : ""
          }
        </div>
        <span class="badge badge-${escapeHtml(req.status)}">${escapeHtml(req.status)}</span>
      </div>
    `
    )
    .join("");
}

function renderMentorRequests(container, requests) {
  if (!requests.length) {
    container.innerHTML = `
      <div class="card">
        <p style="color: var(--text-muted);">No incoming mentorship requests yet.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = requests
    .map(
      (req) => `
      <div class="card" style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
          <div>
            <h3 class="card-title">${escapeHtml(req.student_name)}</h3>
            <p class="card-subtitle" style="margin: 0;">${escapeHtml(req.student_email)}</p>
          </div>
          <span class="badge badge-${escapeHtml(req.status)}">${escapeHtml(req.status)}</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
          "${escapeHtml(req.message)}"
        </p>
        ${
          req.status === "pending"
            ? `<div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-primary" onclick="updateRequestStatus(${req.id}, 'accepted')">Accept</button>
                <button class="btn btn-danger" onclick="updateRequestStatus(${req.id}, 'declined')">Decline</button>
              </div>`
            : ""
        }
      </div>
    `
    )
    .join("");
}

async function updateRequestStatus(requestId, status) {
  try {
    const response = await fetch("backend/api/update-status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: requestId, status })
    });

    const result = await response.json();

    if (response.ok && result.status === "success") {
      loadDashboard();
    } else {
      alert(result.message || "Could not update request.");
    }
  } catch (err) {
    alert("Network error while updating status.");
  }
}

document.addEventListener("DOMContentLoaded", loadDashboard);