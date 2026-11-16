document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const roleSelect = document.getElementById("role");
  const mentorFields = document.getElementById("mentorFields");

  // Toggle extra mentor fields on register.html
  if (roleSelect && mentorFields) {
    roleSelect.addEventListener("change", () => {
      const isMentor = roleSelect.value === "mentor";
      mentorFields.style.display = isMentor ? "block" : "none";

      document.getElementById("industry").required = isMentor;
      document.getElementById("job_role").required = isMentor;
      document.getElementById("bio").required = isMentor;
    });
  }

  // Handle Registration
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        full_name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        role: document.getElementById("role").value,
        password: document.getElementById("password").value
      };

      if (payload.role === "mentor") {
        payload.industry = document.getElementById("industry").value.trim();
        payload.job_role = document.getElementById("job_role").value.trim();
        payload.bio = document.getElementById("bio").value.trim();
      }

      try {
        const response = await fetch("backend/auth/register.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.status === "success") {
          window.location.href = result.role === "mentor"
            ? "dashboard-mentor.html"
            : "dashboard-student.html";
        } else {
          alert(result.message || "Registration failed.");
        }
      } catch (err) {
        alert("Unable to connect to the server. Make sure Apache is running.");
      }
    });
  }

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value
      };

      try {
        const response = await fetch("backend/auth/login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.status === "success") {
          window.location.href = result.role === "mentor"
            ? "dashboard-mentor.html"
            : "dashboard-student.html";
        } else {
          alert(result.message || "Invalid login credentials.");
        }
      } catch (err) {
        alert("Unable to connect to the server. Make sure Apache is running.");
      }
    });
  }
});