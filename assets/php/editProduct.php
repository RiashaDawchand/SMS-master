<?php
  require 'connection.php';

  $id = $_REQUEST['id'];
  $quantity = $_REQUEST['newQty'];
  $date = date("Y-m-d h:i:s");

  //Data for Record Table
  $oldQty = $_REQUEST['oldQty'];
  $changeType = '';

  if($quantity > $oldQty)
  {
    $changeType = 'Stock Added';
  }
  else if($quantity < $oldQty)
  {
    $changeType = 'Stock Sold';
  }

  $query = "INSERT INTO record(product_id, update_date, change_type, old_quantity, new_quantity) VALUES ('$id', '$date', '$changeType', '$oldQty', '$quantity');";
  if(mysqli_query($conn, $query))
  {
    $query = "UPDATE stock SET quantity='$quantity', mod_time='$date' WHERE product_id='$id';";
    if(mysqli_query($conn, $query))
    {
      echo '1';
    }
    else
    {
      echo '2';
    }
  }
  else
  {
    echo '2';
  }


 ?>
