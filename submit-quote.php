<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$service = trim($_POST['service'] ?? '');
$message = trim($_POST['message'] ?? '');
$timestamp = date('Y-m-d H:i:s');

$entry = [
    'timestamp' => $timestamp,
    'name' => $name,
    'email' => $email,
    'service' => $service,
    'message' => $message,
];

$logFile = __DIR__ . '/quote-submissions.log';
$written = file_put_contents($logFile, json_encode($entry, JSON_UNESCAPED_SLASHES) . PHP_EOL, FILE_APPEND | LOCK_EX);

$to = 'mwebdevelopment85@gmail.com';
$subject = 'New quote request from ' . ($name ?: 'Unknown');
$body = "You received a new quote request.\n\n";
$body .= "Name: {$name}\n";
$body .= "Email: {$email}\n";
$body .= "Service: {$service}\n";
$body .= "Message: {$message}\n";

$headers = "From: no-reply@localhost\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$mailSent = @mail($to, $subject, $body, $headers);

if ($written === false) {
    echo json_encode([
        'success' => false,
        'message' => 'Your request could not be saved. Please try again.'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => "Thanks, {$name}! Your quote request has been received.",
    'savedTo' => 'quote-submissions.log',
    'mailSent' => $mailSent
]);
