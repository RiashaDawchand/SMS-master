<?php
  set_time_limit(120);
  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\SMTP;
  use PHPMailer\PHPMailer\Exception;

  require 'PHPMailer/src/PHPMailer.php';
  require 'PHPMailer/src/SMTP.php';
  require 'PHPMailer/src/Exception.php';

  include 'connection.php';

  if($_REQUEST['operation'] == 'login') // check if this part of the code needs to be executed
  {
    $username = $_REQUEST['username'];
    $password = $_REQUEST['password'];

    $sql = "SELECT * FROM login WHERE username = '$username';";

    $result = mysqli_query($conn, $sql);

    if(mysqli_num_rows($result) > 0)
    {
      while($row = $result->fetch_assoc())
      {
        if($row['password'] == $password)
        {
          echo "success;".$row['account_type'];
        }
        else
        {
          echo '1';
        }
      }
    }
    else
    {
      echo '0';
    }
  }

  if($_REQUEST['operation'] == 'register') // check if this part of the code needs to be executed
  {
    $username = $_REQUEST['username'];
    $sql = "SELECT * FROM login WHERE username = '$username';";
    $result = mysqli_query($conn, $sql);

    if(mysqli_num_rows($result) > 0)
    {
      echo '0';
      // Account found with specified Username - Cannot Make Another Entry with Same Username
    }
    else
    {
      $otp = rand(10000, 100000);

      $sql = "INSERT INTO verification VALUES('$username', '$otp', false);";
      if(mysqli_query($conn, $sql))
      {
        echo $otp;
      }
      else
      {
        echo '1';
      }
    }
  }

  if($_REQUEST['operation'] == 'otp_confirm')
  {
    $otp = $_REQUEST['otp'];
    $username = $_REQUEST['username'];

    $sql = "SELECT * FROM verification WHERE username = '$username' AND otp = '$otp';";

    $result = mysqli_query($conn, $sql);

    if(mysqli_num_rows($result) > 0)
    {
      echo '1';
    }
    else
    {
      echo '0';
    }
  }

  if($_REQUEST['operation'] == 'reg_complete')
  {
    $username = $_REQUEST['username'];
    $password = $_REQUEST['password'];
    $title = $_REQUEST['title'];
    $fname = $_REQUEST['fname'];
    $surname = $_REQUEST['surname'];
    $contact = $_REQUEST['contact'];
    $province = $_REQUEST['province'];
    $address = $_REQUEST['address'];

    $sql = "INSERT INTO login VALUES ('$username', '$password', 2);";
    if(mysqli_query($conn, $sql))
    {
      $sql = "INSERT INTO customer VALUES ('$username', '$title', '$fname', '$surname', '$contact', '$province', '$address');";

      if(mysqli_query($conn, $sql))
      {
        echo '3';
      }
      else
      {
        echo '2';
      }
    }
    else
    {
      echo '1';
    }
  }

  if($_REQUEST['operation'] == 'send_otp')
  {
    $mail = new PHPMailer(true);

    $username = $_REQUEST['username'];
    $otp = $_REQUEST['otp'];

    try {
      // $mail->SMTPDebug = SMTP::DEBUG_SERVER;
      $mail->isSMTP();
      $mail->Timeout = 120;
      $mail->SMTPKeepAlive = true;
      $mail->Host = 'smtp.gmail.com';
      $mail->SMTPAuth = true;
      $mail->Username = 'testingHP246@gmail.com';
      $mail->Password = 'Testinghp';
      $mail->SMTPSecure = 'tls';
      $mail->Port = 587;

      $mail->setFrom('testingHP246@gmail.com','no-reply');
      $mail->addAddress($username);

      $mail->Subject = "OTP";
      $mail->Body = "Your One Time Pin is: ".$otp;
      if($mail->send())
      {
        echo '1';
      }
      else
      {
        echo '0';
      }
    }
    catch (Exception $e)
    {
      echo $mail->ErrorInfo;
    }
  }

  if($_REQUEST['operation'] == 'check_otp_exists')
  {
    $username = $_REQUEST['username'];

    $sql = "SELECT * FROM verification WHERE username = '$username';";
    $result = mysqli_query($conn, $sql);
    $otp = "";
    if(mysqli_num_rows($result) > 0)
    {
      while($row = $result->fetch_assoc())
      {
        $otp = $row['otp'];
      }

      echo $otp;
    }
    else
    {
      echo '0';
    }

  }
