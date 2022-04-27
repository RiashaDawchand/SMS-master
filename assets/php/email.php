<?php
set_time_limit(120);
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

$emailTo = $_REQUEST['emailTo'];
$subject = $_REQUEST['subject'];
$fileName = $_REQUEST['fileName'];
$filePath = $_REQUEST['filePath'];

$mail = new PHPMailer(true);

try {
  // $mail->SMTPDebug = SMTP::DEBUG_SERVER;
  $mail->isSMTP();
  $mail->Timeout = 120;
  $mail->SMTPKeepAlive = true;
  $mail->Host = 'smtp.gmail.com';
  $mail->SMTPAuth = true;
  $mail->Username = 'yasteel.gunga02@gmail.com';
  $mail->Password = 'Gunga.s02';
  $mail->SMTPSecure = 'tls';
  $mail->Port = 587;

  $mail->setFrom('yasteel.gunga02@gmail.com','no-reply');
  $mail->addAddress($emailTo);

  $mail->Subject = $subject;
  $mail->Body = 'Please Find Attached Stock Report Below';
  $mail->AddAttachment($filePath, $fileName);
  if($mail->send())
  {
    echo '1';
  }
  else
  {
    echo '0';
  }
} catch (Exception $e) {
  echo $mail->ErrorInfo;
}

 ?>
