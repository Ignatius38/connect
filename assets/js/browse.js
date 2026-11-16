let allMentors = [];

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function renderMentors(data) {
  const grid = document.getElementById("mentorGrid");
  grid.innerHTML = "";

  if (!data.length) {
    grid.innerHTML = "<p>No mentors found matching your search.</p>";
    return;
  }

  data.forEach((mentor) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-subtitle">${escapeHtml(mentor.industry)}</div>
      <h3 class="card-title">${escapeHtml(mentor.full_name)}</h3>
      <p style="font-weight: 500; font-size: 0.9rem; margin-bottom: 1rem;">${escapeHtml(mentor.job_role)}</p>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.4;">${escapeHtml(mentor.bio)}</p>
      <button class="btn btn-primary" style="width: 100%;" onclick="requestMentorship(${mentor.id}, '${escapeHtml(mentor.full_name)}')">
        Request Mentorship
      </button>
    `;
    grid.appendChild(card);
  });
}

function filterMentors() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const filtered = allMentors.filter(
    (m) =>
      (m.job_role || "").toLowerCase().includes(searchTerm) ||
      (m.industry || "").toLowerCase().includes(searchTerm) ||
      (m.full_name || "").toLowerCase().includes(searchTerm)
  );
  renderMentors(filtered);
}

async function requestMentorship(mentorId, mentorName) {
  const message = prompt(`Send a short introductory note to ${mentorName}:`);
  if (message === null) return; // User clicked Cancel

  try {
    const response = await fetch("backend/api/request.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mentor_id: mentorId,
        message: message.trim() || "Hello! I would love to connect for mentorship."
      })
    });

    const result = await response.json();

    if (response.status === 401) {
      alert("Please log in as a student to request a mentor.");
      window.location.href = "login.html";
      return;
    }

    if (response.ok && result.status === "success") {
      alert(result.message);
      window.location.href = "dashboard-student.html";
    } else {
      alert(result.message || "Could not send request.");
    }
  } catch (err) {
    alert("Network error while sending request.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", filterMentors);
  }

  try {
    const response = await fetch("backend/api/get-mentors.php");
    const result = await response.json();

    if (response.ok && result.status === "success") {
      allMentors = result.mentors;
      renderMentors(allMentors);
    } else {
      document.getElementById("mentorGrid").innerHTML = "<p>Unable to load mentors.</p>";
    }
  } catch (err) {
    document.getElementById("mentorGrid").innerHTML = "<p>Error connecting to server.</p>";
  }
});