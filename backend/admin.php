<?php
include "headers.php";

class User {
  function login($json)
{
    include "connection.php";

    $json = json_decode($json, true);

    // Check in tbluser
    $sql = "SELECT a.user_id, a.user_firstname, a.user_lastname, a.user_email, a.user_password, b.userL_name AS user_userLevel FROM tbluser a
            INNER JOIN tbluserlevel b ON a.user_userLevel = b.userL_id
            WHERE BINARY user_id = :username";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':username', $json['username']);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (password_verify($json['password'], $user['user_password'])) {
            return json_encode([
                'user_id' => $user['user_id'],
                'user_userLevel' => $user['user_userLevel'],
                'user_firstname' => $user['user_firstname'],
                'user_lastname' => $user['user_lastname'],
                'user_email' => $user['user_email']
            ]);
        }
    }


    // Check in tblstudent
    $sql = "SELECT a.student_id	, a.student_firstname	, a.student_lastname, a.student_password, b.userL_level AS student_userLevel FROM tblstudent a
            INNER JOIN tbluserlevel b ON a.student_userLevel = b.userL_id
            WHERE BINARY a.student_id = :username";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':username', $json['username']);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (password_verify($json['password'], $user['student_password'])) {
            return json_encode([
                'student_id' => $user['student_id'],
                'student_firstname' => $user['student_firstname'],
                'student_lastname' => $user['student_lastname'],
                'student_email' => $user['student_email'],
                'student_userLevel' => $user['student_userLevel']
            ]);
        }
    }

    return json_encode(null);
}
    
}

$input = json_decode(file_get_contents('php://input'), true);



$operation = isset($_POST["operation"]) ? $_POST["operation"] : "0";
$json = isset($_POST["json"]) ? $_POST["json"] : "0";

$user = new User();

switch ($operation) {
  case "login":
    echo $user->login($json);
    break;
  default:
    echo json_encode("WALA KA NAGBUTANG OG OPERATION SA UBOS HAHAHHA BOBO");
    http_response_code(400); // Bad Request
    break;
}

?>