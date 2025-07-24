<?php
include "headers.php";

class User {
  function GetDocuments()
  {
    include "connection.php";

    $sql = "SELECT * FROM tbldocument";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
      $cashMethod = $stmt->fetchAll(PDO::FETCH_ASSOC);
      return json_encode($cashMethod);
    }
    return json_encode([]);
  }

  function addRequestDocument($json)
  {
    include "connection.php";

    $json = json_decode($json, true);

    try {
      $conn->beginTransaction();

      // First, get the status ID for "Pending" status
      $statusSql = "SELECT id FROM tblstatus WHERE name = 'Pending' LIMIT 1";
      $statusStmt = $conn->prepare($statusSql);
      $statusStmt->execute();
      $statusResult = $statusStmt->fetch(PDO::FETCH_ASSOC);

      if (!$statusResult) {
        throw new PDOException("Pending status not found in status request table");
      }

      $pendingStatusId = $statusResult['id'];

      $sql = "INSERT INTO tblrequest (studentId, documentId, purpose, createdAt) 
              VALUES (:userId, :documentId, :purpose, :datetime)";

      $stmt = $conn->prepare($sql);
      $stmt->bindParam(':userId', $json['userId']);
      $stmt->bindParam(':documentId', $json['documentId']);
      $stmt->bindParam(':purpose', $json['purpose']);
      $stmt->bindParam(':datetime', $json['datetime']);

      if ($stmt->execute()) {
        $requestId = $conn->lastInsertId();
        
        // Insert into tblrequeststatus with the correct pending status ID
        $statusSql = "INSERT INTO tblrequeststatus (requestId, statusId, createdAt) VALUES (:requestId, :statusId, :datetime)";
        $statusStmt = $conn->prepare($statusSql);
        $statusStmt->bindParam(':requestId', $requestId);
        $statusStmt->bindParam(':statusId', $pendingStatusId);
        $statusStmt->bindParam(':datetime', $json['datetime']);

        if ($statusStmt->execute()) {
          $conn->commit();
          return json_encode(['success' => true]);
        }
      }

      $conn->rollBack();
      return json_encode(['error' => 'Failed to add request: ' . implode(" ", $stmt->errorInfo())]);

    } catch (PDOException $e) {
      $conn->rollBack();
      return json_encode(['error' => 'Database error occurred: ' . $e->getMessage()]);
    }
  }

  function getUserRequests($json)
  {
    include "connection.php";

    $json = json_decode($json, true);
    $userId = $json['userId'];

    try {
      $sql = "SELECT 
                r.id,
                d.name as document,
                r.purpose,
                DATE(r.createdAt) as dateRequested,
                s.name as status,
                s.id as statusId
              FROM tblrequest r
              INNER JOIN tbldocument d ON r.documentId = d.id
              INNER JOIN tblrequeststatus rs ON r.id = rs.requestId
              INNER JOIN tblstatus s ON rs.statusId = s.id
              WHERE r.studentId = :userId
              AND rs.id = (
                SELECT MAX(rs2.id) 
                FROM tblrequeststatus rs2 
                WHERE rs2.requestId = r.id
              )
              ORDER BY r.createdAt DESC";

      $stmt = $conn->prepare($sql);
      $stmt->bindParam(':userId', $userId);
      $stmt->execute();

      if ($stmt->rowCount() > 0) {
        $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return json_encode($requests);
      }
      return json_encode([]);

    } catch (PDOException $e) {
      return json_encode(['error' => 'Database error occurred: ' . $e->getMessage()]);
    }
  }
    
}

$input = json_decode(file_get_contents('php://input'), true);



$operation = isset($_POST["operation"]) ? $_POST["operation"] : "0";
$json = isset($_POST["json"]) ? $_POST["json"] : "0";

$user = new User();

switch ($operation) {
  case "GetDocuments":
    echo $user->GetDocuments();
    break;
  case "addRequestDocument":
    echo $user->addRequestDocument($json);
    break;
  case "getUserRequests":
    echo $user->getUserRequests($json);
    break;
  default:
    echo json_encode("WALA KA NAGBUTANG OG OPERATION SA UBOS HAHAHHA BOBO");
    http_response_code(400); // Bad Request
    break;
}

?>