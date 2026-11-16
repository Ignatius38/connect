<?php
header('Content-Type: application/json');
require_once '../config/db.php';

try {
    $stmt = $pdo->query(
        "SELECT id, full_name, industry, job_role, bio 
         FROM users 
         WHERE role = 'mentor' 
         ORDER BY created_at DESC"
    );
    $mentors = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'mentors' => $mentors
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to load mentors.'
    ]);
}