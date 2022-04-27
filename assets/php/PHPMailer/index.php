<?php
require 'connection.php';

if($_REQUEST['operation'] == 'fetch_product_info')
{
  $product_id = $_REQUEST['product_id'];
  $sql = "SELECT * FROM stock where product_id = '$product_id';";
  $result = mysqli_query($conn, $sql);

  if(mysqli_num_rows($result) > 0)
  {
    $dataArr = array();
    while($row = $result->fetch_assoc())
    {
      $obj = [
        'product_id'=>$row['product_id'],
        'product_name'=>$row['product_name'],
        'quantity'=>$row['quantity'],
        'cost'=>$row['price']
      ];
    }
    array_push($dataArr,$obj);
    echo json_encode($dataArr);
  }
  else
  {
    echo '0';
  }
}
