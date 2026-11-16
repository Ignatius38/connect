<?php
session_start();
header('Content-Type: application/json');
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
    exit;
}

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'mentor') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized action.']);
    exit;
}

$data      = json_decode(file_get_contents('php://input'), true);
$requestId = (int)($data['request_id'] ?? 0);
$newStatus = $data['status'] ?? '';

if ($requestId <= 0 || !in_array($newStatus, ['accepted', 'declined'], true)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request parameters.']);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "UPDATE mentorship_requests 
         SET status = ? 
         WHERE id = ? AND mentor_id = ?"
    );
    $stmt->execute([$newStatus, $requestId, (int)$_SESSION['user_id']]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Request not found.']);
        exit;
    }

    echo json_encode([
        'status' => 'success',
        'message' => "Request marked as $newStatus."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to update status.']);
}