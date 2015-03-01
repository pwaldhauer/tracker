<?php

require_once('config.php');

$action = isset($_GET['action']) ? $_GET['action'] : null;

if($action == null) {
    die();
}

if($action === 'tasks') {
    $issues = json_decode(file_get_contents($base_url . 'issues.json?limit=100&status_id=open&assigned_to_id=me&key='. $api_key), true);

    $result = [];
    foreach($issues['issues'] as $issue) {
        $project_id = $issue['project']['id'];

        if(!isset($result[$project_id])) {
            $result[$project_id] = [
                'title' => $issue['project']['name'],
                'items' => []
            ];
        }



        $result[$project_id]['items'][] = [
            'id' => $issue['id'],
            'tracker' => $issue['tracker']['name'],
            'url' => $base_url .'issues/' . $issue['id'],
            'title' => $issue['subject'],
            'time_estimated' => floatval($issue['estimated_hours']) * 3600,
            'time_logged' => 0, // Todo
            'time_current' => 0,
        ];
    }

    echo json_encode(array_values($result));
}


if($action === 'save') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $ch = curl_init();

    $fields = [
        'time_entry' => [
            'issue_id' => $data['id'],
            'hours' => $data['seconds'] / 3600,
            'activity_id' => $default_activity_id
        ]
    ];

    curl_setopt($ch, CURLOPT_URL, $base_url . 'time_entries.json?key='. $api_key);
    curl_setopt($ch, CURLOPT_POST, count($fields));
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($fields));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_VERBOSE, true);
    curl_setopt($ch, CURLOPT_STDERR, fopen('error.log', 'w'));

    echo  curl_exec($ch);
    curl_close($ch);
}
