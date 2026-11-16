<?php
session_start();
header('Content-Type: application/json');
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$fullName = trim($data['full_name'] ?? '');
$email    = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$role     = $data['role'] ?? '';

if (empty($fullName) || empty($email) || empty($password) || !in_array($role, ['student', 'mentor'], true)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Please enter a valid email address.']);
    exit;
}

$industry = ($role === 'mentor') ? trim($data['industry'] ?? '') : null;
$jobRole  = ($role === 'mentor') ? trim($data['job_role'] ?? '') : null;
$bio      = ($role === 'mentor') ? trim($data['bio'] ?? '') : null;

if ($role === 'mentor' && (empty($industry) || empty($jobRole) || empty($bio))) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Mentors must provide an industry, job title, and bio.']);
    exit;
}

try {
    // Check if email already exists
    $checkStmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $checkStmt->execute([$email]);
    if ($checkStmt->fetch()) {
        http_response_code(409);
        echo json_encode(['status' => 'error', 'message' => 'An account with this email already exists.']);
        exit;
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $insertStmt = $pdo->prepare(
        'INSERT INTO users (full_name, email, password_hash, role, industry, job_role, bio) 
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $insertStmt->execute([$fullName, $email, $passwordHash, $role, $industry, $jobRole, $bio]);

    $newUserId = $pdo->lastInsertId();

    session_regenerate_id(true);
    $_SESSION['user_id']   = (int)$newUserId;
    $_SESSION['user_name'] = $fullName;
    $_SESSION['role']      = $role;

    echo json_encode([
        'status' => 'success',
        'message' => 'Account created successfully.',
        'role' => $role
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Registration failed. Please try again.']);
}