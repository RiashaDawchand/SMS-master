<?php
  require 'connection.php';

  $search = $_REQUEST['search'];
  $type = $_REQUEST['type'];

  $query = "";

  if($type == 'bar')
  {
    $query = "SELECT * FROM stock WHERE product_name LIKE '$search%' OR product_category LIKE '$search%' OR product_id LIKE '$search%';";
  }
  else if($type == 'scan')
  {
    $query = "SELECT * FROM stock WHERE product_id LIKE '$search%';";
  }

  // $query = "SELECT * FROM stock;";
  $result = mysqli_query($conn, $query);

  if(mysqli_num_rows($result) > 0)
  {
    while($row = $result->fetch_assoc())
    {
      echo '
        <tr>
          <td>'.ucfirst($row['product_category']).'</td>
          <td>'.$row['product_name'].'</td>
          <td>'.$row['quantity'].'</td>
          <td>R'.$row['price'].'</td>
          <td> <i class="fas fa-plus-square" id="'.$row['product_id'].'"></i></td>
        </tr>
      ';
    }
  }
  else
  {
    echo '<tr class="no_records"><td colspan="4">No Records Found :( </td></tr>';
  }

 ?>
