CREATE DATABASE IF NOT EXISTS proconnect_db;
USE proconnect_db;

-- 1. Users Table (Students & Mentors)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'mentor') NOT NULL,
    industry VARCHAR(100) DEFAULT NULL,
    job_role VARCHAR(100) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Mentorship Requests Table
CREATE TABLE IF NOT EXISTS mentorship_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    mentor_id INT NOT NULL,
    message TEXT DEFAULT NULL,
    status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Seed Sample Mentors (Password for all test accounts: password123)
INSERT INTO users (full_name, email, password_hash, role, industry, job_role, bio) VALUES
('Sarah Jenkins', 'sarah@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mentor', 'Technology', 'Senior Software Engineer', '10 years experience in full-stack development. Happy to review code and discuss career paths.'),
('David Chen', 'david@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mentor', 'Technology', 'Product Manager', 'Transitioned from engineering to product. Can help with interview prep and resume reviews.'),
('Elena Rodriguez', 'elena@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mentor', 'Finance', 'Financial Analyst', 'Specializing in corporate finance. Looking to mentor students interested in investment banking.'),
('Michael Osei', 'michael@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mentor', 'Data', 'Data Scientist', 'Working with machine learning models. I can guide you through Python, SQL, and building a portfolio.');