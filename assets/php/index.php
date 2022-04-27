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

if($_REQUEST['operation'] == 'checkout')
{
  $cart = json_decode($_REQUEST['cart']);
  $username = $_REQUEST['username'];
  $total = $_REQUEST['total'];

  $sql = "INSERT INTO sales (username, total) VALUES ('$username', '$total');";

  if(mysqli_query($conn, $sql))
  {
    $sql = "INSERT INTO sales_breakdown (order_id, product_id, quantity, cost) VALUES ";
    for ($i=0; $i < count($cart); $i++)
    {
      $product_id = $cart[$i]->product_id;
      $quantity = $cart[$i]->selected_qty;
      $cost = $cart[$i]->cost;
      $sql .= "((SELECT MAX(order_id) FROM sales),'$product_id', '$quantity', '$cost')";

      if($i < (count($cart) - 1))
      {
        $sql .= ", ";
      }

      decrease_stock($conn, $username, $product_id, $quantity);
    }

    if(mysqli_query($conn, $sql))
    {
      echo '1';
    }
    else
    {
      echo $sql;
    }
  }
  else
  {
    echo '0';
  }
}

if($_REQUEST['operation'] == 'load_details')
{
  $username = $_REQUEST['username'];

  $sql = "SELECT  * FROM customer WHERE username = '$username';";

  $result = mysqli_query($conn, $sql);

  if(mysqli_num_rows($result) > 0)
  {
    $dataArr = array();
    while($row = $result->fetch_assoc())
    {
      $obj = [
        'username'=>$row['username'],
        'title'=>$row['title'],
        'fname'=>$row['fname'],
        'surname'=>$row['surname'],
        'contact'=>$row['contact'],
        'province'=>$row['province'],
        'address'=>$row['address']
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

if($_REQUEST['operation'] == 'save_details')
{
  $username = $_REQUEST['username'];
  $title = $_REQUEST['title'];
  $fname = $_REQUEST['fname'];
  $surname = $_REQUEST['surname'];
  $contact = $_REQUEST['contact'];
  $province = $_REQUEST['province'];
  $address = $_REQUEST['address'];

  $sql = "UPDATE customer SET title='$title', fname='$fname', surname='$surname', contact='$contact', province='$province', address='$address' WHERE username='$username';";
  if(mysqli_query($conn, $sql))
  {
    echo '1';
  }
  else
  {
    echo '0';
  }
}

function decrease_stock($conn, $username, $product_id, $qty)
{
  $sql = "UPDATE stock SET quantity = quantity - '$qty' WHERE product_id = '$product_id';";
  mysqli_query($conn, $sql);

  $qty = $qty * -1;
  $sql = "INSERT INTO record (product_id, reference, change_type, change_value, update_date) VALUES ('$product_id', '$username', 'STOCK SOLD', '$qty', CURRENT_TIMESTAMP);";
  mysqli_query($conn, $sql);
}
