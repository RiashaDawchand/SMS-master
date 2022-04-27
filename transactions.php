<?php  ?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Customer Transactions - <?php echo $_GET['uname'] ?></title>
    <link rel="stylesheet" href="assets/css/presets.css">
    <link rel="stylesheet" href="assets/css/transactions.css">
    <script type="text/javascript" src="assets/js/jquery-3.6.0.min.js"></script>
  </head>
  <body>
    <div class="wrapper">
      <div class="customer_details">
        <table>
          <tr>
            <th>Username</th>
            <td id="username">yasteel.gunga01@gmail.com</td>
          </tr>
          <tr>
            <th>Full Name</th>
            <td id="name">Yasteel Gungapursat</td>
          </tr>
          <tr>
            <th>Contact</th>
            <td id="contact">0768230337</td>
          </tr>
          <tr>
            <th>Address</th>
            <td id="address">49 Acara Street, Stonebridge Drive, Phoenix, Durban, 4068</td>
          </tr>
        </table>
      </div>
      <div class="transaction_details">
        <table>
          <thead>
            <tr>
              <th>ORDER #</th>
              <th>DATE</th>
              <th>PRODUCT ID</th>
              <th>PRODUCT</th>
              <th>QTY</th>
              <th>COST</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1325</td>
              <td>2021-11-23</td>
              <td>Accgam66</td>
              <td>gaming mouse</td>
              <td>1</td>
              <td>5600</td>
              <td>5600</td>
            </tr>
            <tr>
              <td></td>
              <td>2021-11-23</td>
              <td>Accgam66</td>
              <td>gaming mouse</td>
              <td>1</td>
              <td>5600</td>
              <td>5600</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <script type="text/javascript">
      var orders = [];
      var username;
      $(document).ready(function()
      {
        username = "<?php echo $_GET['uname']; ?>";
        fetch_customer_info(username);
        $.post('assets/php/employee.php',
        {
          operation: 'load_customer_transactions',
          username: username
        },
        function(data)
        {
          build_orders(JSON.parse(data));
        });
      });

      function fetch_customer_info(user)
      {
        $.post('assets/php/employee.php',
        {
          operation: 'load_customer_info',
          username: user
        },
        function(data)
        {
          if(data == '0')
          {
            showAlert('Something went wrong', 2);
          }
          else
          {
            var user_info = JSON.parse(data);
            $('#username').text(username);
            $('#name').text(user_info.name);
            $('#contact').text(user_info.contact);
            $('#address').text(user_info.address);

          }
        });
      }

      function in_array(arr, val)
      {
        for (var i = 0; i < arr.length; i++) {
          if(arr[i].order_id == val)
          {
            return true;
          }
        }
        return false;
      }

      function build_orders(raw_data)
      {
        orders = [];
        for (var i = 0; i < raw_data.length; i++) {
          if(!in_array(orders, raw_data[i].order_id))
          {
            var obj =
            {
              'order_id': raw_data[i].order_id,
              items: [
                {
                  'date_of_sale': raw_data[i].date_of_sale,
                  'product_id': raw_data[i].product_id,
                  'product_name': raw_data[i].product_name,
                  'quantity': raw_data[i].quantity,
                  'price': raw_data[i].price,
                  'total': raw_data[i].total
                }
              ]
            };

            orders.push(obj);
          }
          else
          {
            var index = orders.length - 1;
            var items =
             {
               'date_of_sale': raw_data[i].date_of_sale,
               'product_id': raw_data[i].product_id,
               'product_name': raw_data[i].product_name,
               'quantity': raw_data[i].quantity,
               'price': raw_data[i].price,
               'total': raw_data[i].total
             };

             orders[index].items.push(items);
          }
        }

        display_orders();
      }

      function display_orders()
      {
        $('.transaction_details tbody').html('');
        for (var i = 0; i < orders.length; i++) {
          for (var j = 0; j < orders[i].items.length; j++) {
            if(j == 0)
            {
              $('.transaction_details tbody').append(
                `
                <tr>
                  <td>${orders[i].order_id}</td>
                  <td>${new Date(orders[i].items[j].date_of_sale).toLocaleDateString()}</td>
                  <td>${orders[i].items[j].product_id}</td>
                  <td>${orders[i].items[j].product_name}</td>
                  <td>${orders[i].items[j].quantity}</td>
                  <td>${orders[i].items[j].price}</td>
                  <td>${parseInt(orders[i].items[j].quantity) * parseInt(orders[i].items[j].price)}</td>
                </tr>
                `);
            }
            else
            {
              $('.transaction_details tbody').append(
                `
                <tr>
                  <td></td>
                  <td>${new Date(orders[i].items[j].date_of_sale).toLocaleDateString()}</td>
                  <td>${orders[i].items[j].product_id}</td>
                  <td>${orders[i].items[j].product_name}</td>
                  <td>${orders[i].items[j].quantity}</td>
                  <td>${orders[i].items[j].price}</td>
                  <td>${parseInt(orders[i].items[j].quantity) * parseInt(orders[i].items[j].price)}</td>
                </tr>
                `);
            }
          }
        }
      }
    </script>
  </body>
</html>
