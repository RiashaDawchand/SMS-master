<?php
  require 'connection.php';
  $id = $_REQUEST['id'];
  $query = "SELECT quantity FROM stock WHERE product_id='$id';";
  $result = mysqli_query($conn, $query);
  if(mysqli_num_rows($result) > 0)
  {
    while($row = $result->fetch_assoc())
    {
      echo $row['quantity'];
    }
  }
  else
  {
    echo $id;
  }

 ?>
