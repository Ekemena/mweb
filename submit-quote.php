<?php
function wantsJsonResponse(): bool
{
    $acceptHeader = strtolower($_SERVER['HTTP_ACCEPT'] ?? '');
    $requestedWith = strtolower($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '');

    return strpos($acceptHeader, 'application/json') !== false || $requestedWith === 'xmlhttprequest';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json; charset=UTF-8');
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

if ($name === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    if (wantsJsonResponse()) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success' => false,
            'message' => 'Please provide your name and a valid email address.'
        ]);
    } else {
        header('Location: index.html?form=invalid');
    }
    exit;
}

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
    if (wantsJsonResponse()) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success' => false,
            'message' => 'Your request could not be saved. Please try again.'
        ]);
    } else {
        header('Location: index.html?form=failed');
    }
    exit;
}

$response = [
    'success' => true,
    'message' => "Thanks, {$name}! Your quote request has been received.",
    'savedTo' => 'quote-submissions.log',
    'mailSent' => $mailSent
];

if (wantsJsonResponse()) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($response);
} else {
    header('Location: thank-you.html');
}
