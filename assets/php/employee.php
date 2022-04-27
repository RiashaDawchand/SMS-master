<?php
  require 'connection.php';

  if($_REQUEST['operation'] == 'load_products')
  {
    $query = "SELECT product_id, product_name FROM stock ORDER BY product_name;";
    $result = mysqli_query($conn, $query);
    if(mysqli_num_rows($result) > 0)
    {
      $product_info = array();
      while($row = $result->fetch_assoc())
      {
        $obj = [
          'product_id'=>$row['product_id'],
          'product_name'=>$row['product_name']
        ];
        array_push($product_info, $obj);
      }

      echo json_encode($product_info);
    }
    else
    {
      echo '0';
    }
  }

  if($_REQUEST['operation'] == 'load_table')
  {
    $search = $_REQUEST['search'];
    $type = $_REQUEST['type'];

    $query = "";

    if($type == 'search_bar')
    {
      $query = "SELECT * FROM stock WHERE product_name LIKE '$search%' OR product_category LIKE '$search%' OR product_id LIKE '$search%';";
    }
    else if($type == 'scan')
    {
      $query = "SELECT * FROM stock WHERE product_id LIKE '$search%';";
    }

    $result = mysqli_query($conn, $query);

    if(mysqli_num_rows($result) > 0)
    {
      $rows = array();
      while($row = $result->fetch_assoc())
      {
        $rowData = [
          'product_id'=>$row['product_id'],
          'category'=>ucfirst($row['product_category']),
          'product_name'=>$row['product_name'],
          'quantity'=>$row['quantity'],
          'price'=>$row['price']
        ];

        array_push($rows, $rowData);
      }
      echo json_encode($rows);
    }
    else
    {
      echo '0';
    }
  }

  if($_REQUEST['operation'] == 'add_product')
  {
    $productId = $_REQUEST['id'];
    $productName = $_REQUEST['productName'];
    $category = $_REQUEST['category'];
    $quantity = $_REQUEST['quantity'];
    $price = $_REQUEST['price'];

    //data from javascript is received over here ^

    $date = date("Y-m-d h:i:s");
    $query = "";

    $query = "SELECT product_id FROM stock WHERE product_category='$category' && product_name='$productName';";

    $result = mysqli_query($conn, $query);

    if(mysqli_num_rows($result) > 0)
    {
      echo '0';
    }
    else
    {
      $query = "INSERT INTO stock (product_id,product_category, product_name, quantity, price, created_time, mod_time) VALUES('$productId', '$category', '$productName', '$quantity', '$price', '$date', '$date');";
      if(mysqli_query($conn, $query))
      {
        $query = "INSERT INTO record(product_id, reference, change_type, change_value, update_date) VALUES ('$productId', NULL, 'New Stock', '$quantity', '$date' );";
        if(mysqli_query($conn, $query))
        {
          echo '1';
        }
        else
        {
          echo '2';
        }
      }else
      {
        echo '2';
      }
    }
    //Output Codes are echoed back to the javascript side//

    //Output Codes
    //1 - Success
    //2 - Database Error
    //0 - Record Already Exist in Table
  }

  if($_REQUEST['operation'] == 'load_product_info')
  {
    $id = $_REQUEST['id'];
    $query = "SELECT quantity, price FROM stock WHERE product_id='$id';";
    $result = mysqli_query($conn, $query);
    if(mysqli_num_rows($result) > 0)
    {
      $product_info = array();
      while($row = $result->fetch_assoc())
      {
        $obj = [
          'quantity' => $row['quantity'],
          'price' => $row['price']
        ];
        array_push($product_info, $obj);
      }
      echo json_encode($product_info);
    }
    else
    {
      echo '0';
    }
  }

  if($_REQUEST['operation'] == 'edit_product')
  {
    $productId = $_REQUEST['id'];
    $change_type = $_REQUEST['change_type'];
    $change_value = $_REQUEST['change_value'];
    $quantity = $_REQUEST['quantity'];
    $price = $_REQUEST['price'];
    $date = date("Y-m-d h:i:s");

    if($change_type == 'NO CHANGE')
    {
      $query = "UPDATE stock SET quantity='$quantity', price='$price', mod_time='$date' WHERE product_id='$productId';";
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
      $query = "INSERT INTO record(product_id, reference, change_type, change_value, update_date) VALUES ('$productId', NULL, '$change_type', '$change_value', '$date' );";
      if(mysqli_query($conn, $query))
      {
        $query = "UPDATE stock SET quantity='$quantity', price='$price', mod_time='$date' WHERE product_id='$productId';";
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
    }

  }

  if($_REQUEST['operation'] == 'add_employee')
  {
    $name = $_REQUEST['name'];
    $username = $_REQUEST['username'];
    $password = $_REQUEST['password'];

    $sql = "SELECT * FROM login WHERE username='$username' AND account_type=1";

    $result = mysqli_query($conn, $sql);

    if(mysqli_num_rows($result) > 0)
    {
      echo '0';
      // Account found with specified Username - Cannot Make Another Entry with Same Username
    }
    else
    {
      $sql = "INSERT INTO login VALUES ('$username', '$password', 1);";

      if(mysqli_query($conn, $sql))
      {
        $sql = "INSERT INTO employee (username, name) VALUES ('$username', '$name');";
        if(mysqli_query($conn, $sql))
        {
          echo '1';
        }
      }
      else
      {
        echo '2';
      }
    }
  }

  if($_REQUEST['operation'] == 'load_employees')
  {
    $sql = "SELECT * FROM employee;";

    $result = mysqli_query($conn, $sql);

    if(mysqli_num_rows($result) > 0)
    {
      $rows = array();
      while($row = $result->fetch_assoc())
      {
        $rowData = [
          'id' => $row['id'],
          'username' => $row['username'],
          'name' => $row['name'],
          'deleted' => $row['deleted']
        ];
        array_push($rows, $rowData);
      }
      echo json_encode($rows);
    }
    else
    {
      echo '0';
    }
  }

  if($_REQUEST['operation'] == 'change_access')
  {
    $username = $_REQUEST['username'];
    $access = $_REQUEST['access'];

    $sql = "UPDATE employee SET deleted='$access' WHERE username='$username';";

    if(mysqli_query($conn, $sql))
    {
      echo '1';
    }
    else
    {
      echo '0';
    }
  }

  if($_REQUEST['operation'] == 'change_employee_password')
  {
    $admin_pass = $_REQUEST['admin_pass'];
    $username = $_REQUEST['username'];
    $new_pass = $_REQUEST['new_pass'];

    $sql = "SELECT * FROM login WHERE account_type=0 AND password='$admin_pass';";

    $result = mysqli_query($conn, $sql);

    if(mysqli_num_rows($result) > 0)
    {
      $sql = "SELECT * FROM login WHERE username='$username';";

      $result = mysqli_query($conn, $sql);

      if(mysqli_num_rows($result) > 0)
      {
        $sql = "UPDATE login SET password='$new_pass' WHERE username='$username';";

        if(mysqli_query($conn, $sql))
        {
          echo '2';
        }
      }
      else
      {
        echo '1';
      }
    }
    else
    {
      echo '0';
    }
  }

  if($_REQUEST['operation'] == 'load_customers')
  {
    $sql = "SELECT c.username, CONCAT(c.fname, ' ', c.surname) AS name, c.contact, c.address FROM customer c;";

    $result = mysqli_query($conn, $sql);

    if(mysqli_num_rows($result) > 0)
    {
      $rows = array();
      while($row = $result->fetch_assoc())
      {
        $rowData = [
          'username' => $row['username'],
          'name' => $row['name'],
          'contact' => $row['contact'],
          'address' => $row['address']
        ];
        array_push($rows, $rowData);
      }
      echo json_encode($rows);
    }
    else
    {
      echo '0';
    }
  }
  if($_REQUEST['operation'] == 'load_customer_info')
  {
    $username = $_REQUEST['username'];
    $sql = "SELECT CONCAT(c.fname, ' ', c.surname) AS name, c.contact, c.address FROM customer c WHERE c.username='$username';";
    $result = mysqli_query($conn, $sql);

    if(mysqli_num_rows($result) > 0)
    {
      while($row = $result->fetch_assoc())
      {
        $rowData = [
          'name' => $row['name'],
          'contact' => $row['contact'],
          'address' => $row['address']
        ];
        echo json_encode($rowData);
      }
    }
    else
    {
      echo '0';
    }
  }

  if($_REQUEST['operation'] == 'load_customer_transactions')
  {
    $username = $_REQUEST['username'];

    $sql = "
    SELECT 		    s.username,
			            s.order_id,
                  s.date_of_sale,
                  s.total,
               	  sb.product_id,
                  st.product_name,
                  st.price,
                  sb.quantity,
                  sb.cost
    FROM 		      sales s
    INNER JOIN 	  sales_breakdown sb
    ON 			      s.order_id = sb.order_id
    INNER JOIN	  stock st
    ON			      sb.product_id = st.product_id
    WHERE		      s.username = '$username';";

    $result = mysqli_query($conn, $sql);

    if(mysqli_num_rows($result) > 0)
    {
      $rows = array();
      while($row = $result->fetch_assoc())
      {
        $rowData = [
          'username' => $row['username'],
          'order_id' => $row['order_id'],
          'date_of_sale' => $row['date_of_sale'],
          'total' => $row['total'],
          'product_id' => $row['product_id'],
          'product_name' => $row['product_name'],
          'price' => $row['price'],
          'quantity' => $row['quantity'],
          'cost' => $row['cost']
        ];
        array_push($rows, $rowData);
      }
      echo json_encode($rows);
    }
    else
    {
      echo '0';
    }

  }
