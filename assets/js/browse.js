// Mock data for frontend development
const mentors = [
    { id: 1, name: "Sarah Jenkins", role: "Senior Software Engineer", industry: "Technology", bio: "10 years experience in full-stack development. Happy to review code and discuss career paths." },
    { id: 2, name: "David Chen", role: "Product Manager", industry: "Technology", bio: "Transitioned from engineering to product. Can help with interview prep and resume reviews." },
    { id: 3, name: "Elena Rodriguez", role: "Financial Analyst", industry: "Finance", bio: "Specializing in corporate finance. Looking to mentor students interested in investment banking." },
    { id: 4, name: "Michael Osei", role: "Data Scientist", industry: "Data", bio: "Working with machine learning models. I can guide you through Python, SQL, and building a portfolio." }
];

function renderMentors(data) {
    const grid = document.getElementById('mentorGrid');
    grid.innerHTML = ''; // Clear current content

    if (data.length === 0) {
        grid.innerHTML = '<p>No mentors found matching your search.</p>';
        return;
    }

    data.forEach(mentor => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-subtitle">${mentor.industry}</div>
            <h3 class="card-title">${mentor.name}</h3>
            <p style="font-weight: 500; font-size: 0.9rem; margin-bottom: 1rem;">${mentor.role}</p>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.4;">${mentor.bio}</p>
            <button class="btn btn-primary" style="width: 100%;" onclick="requestMentorship(${mentor.id})">
                Request Mentorship
            </button>
        `;
        grid.appendChild(card);
    });
}

function filterMentors() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = mentors.filter(m => 
        m.role.toLowerCase().includes(searchTerm) || 
        m.industry.toLowerCase().includes(searchTerm) ||
        m.name.toLowerCase().includes(searchTerm)
    );
    renderMentors(filtered);
}

function requestMentorship(mentorId) {
    // Tomorrow, this will POST to backend/api/request.php
    alert("Mentorship request sent successfully! You can track this in your dashboard.");
}

// Load mentors when page loads
document.addEventListener('DOMContentLoaded', () => {
    renderMentors(mentors);
});