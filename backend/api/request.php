<?php
session_start();
header('Content-Type: application/json');
require_once '../config/db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Please log in first.']);
    exit;
}

$userId = (int)$_SESSION['user_id'];
$role   = $_SESSION['role'];

// POST: Student creates a new mentorship request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($role !== 'student') {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Only student accounts can request mentorship.']);
        exit;
    }

    $data     = json_decode(file_get_contents('php://input'), true);
    $mentorId = (int)($data['mentor_id'] ?? 0);
    $message  = trim($data['message'] ?? '');

    if ($mentorId <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid mentor selected.']);
        exit;
    }

    try {
        // Prevent duplicate pending or accepted requests to the same mentor
        $checkStmt = $pdo->prepare(
            "SELECT id FROM mentorship_requests 
             WHERE student_id = ? AND mentor_id = ? AND status IN ('pending', 'accepted')"
        );
        $checkStmt->execute([$userId, $mentorId]);
        if ($checkStmt->fetch()) {
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'You already have an active or pending request with this mentor.']);
            exit;
        }

        $insertStmt = $pdo->prepare(
            "INSERT INTO mentorship_requests (student_id, mentor_id, message, status) 
             VALUES (?, ?, ?, 'pending')"
        );
        $insertStmt->execute([$userId, $mentorId, $message]);

        echo json_encode(['status' => 'success', 'message' => 'Mentorship request sent!']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Could not send request.']);
    }
    exit;
}

// GET: Load requests for the logged-in student or mentor
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        if ($role === 'student') {
            $stmt = $pdo->prepare(
                "SELECT r.id, r.status, r.message, r.created_at,
                        u.full_name AS mentor_name, u.job_role, u.industry,
                        CASE WHEN r.status = 'accepted' THEN u.email ELSE NULL END AS mentor_email
                 FROM mentorship_requests r
                 JOIN users u ON r.mentor_id = u.id
                 WHERE r.student_id = ?
                 ORDER BY r.created_at DESC"
            );
            $stmt->execute([$userId]);
        } else {
            $stmt = $pdo->prepare(
                "SELECT r.id, r.status, r.message, r.created_at,
                        u.full_name AS student_name, u.email AS student_email
                 FROM mentorship_requests r
                 JOIN users u ON r.student_id = u.id
                 WHERE r.mentor_id = ?
                 ORDER BY r.created_at DESC"
            );
            $stmt->execute([$userId]);
        }

        echo json_encode([
            'status' => 'success',
            'user_name' => $_SESSION['user_name'],
            'requests' => $stmt->fetchAll()
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to load requests.']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);