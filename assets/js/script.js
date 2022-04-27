var video;
var canvasElement;
var canvas;
var qrCode;
var scannerElement;
var oldQty;
var employee_username;

function add_employee()
{
  var add_name = document.getElementsByClassName('add_name')[0];
  var add_username = document.getElementsByClassName('add_username')[0];
  var add_pass = document.getElementsByClassName('add_pass')[0];
  var add_pass_confirm = document.getElementsByClassName('add_pass_confirm')[0];

  if(valid(add_name.value))
  {
    if(valid(add_username.value, 'email'))
    {
      if(valid(add_pass.value))
      {
        if(valid(add_pass_confirm.value))
        {
          if(add_pass.value == add_pass_confirm.value)
          {
            $.post('assets/php/employee.php',
            {
              operation: 'add_employee',
              name: add_name.value,
              username: add_username.value,
              password: add_pass.value
            },
            function(data)
            {
              if(data == '0')
              {
                showAlert('Employee Exists in Database', 2);
              }
              else if(data == '1')
              {
                showAlert('Employee Added', 1);
              }
              else
              {
                showAlert('Something went Wrong', 2);
                console.log(data);
              }
            });
            console.log('awe');
          }
          else
          {
            add_pass_confirm.classList.add('error');
            showAlert('Passwords Do Not Match', 2);
          }
        }
        else
        {
          add_pass_confirm.classList.add('error');
          showAlert('Passwords Do Not Match', 2);
        }
      }
      else
      {
        add_pass.classList.add('error');
        showAlert('Cannot leave Password Blank', 2);
      }
    }
    else
    {
      add_username.classList.add('error');
      showAlert('Enter a valid Email', 2);
    }
  }
  else
  {
    add_name.classList.add('error');
    showAlert('Dont leave Fields Blank', 2);
  }
}

function add_product()
{
  var productName = $('input.product').val();
  var category = $('.category').val();
  var quantity = $('div.stock_add input.quantity').val();
  var price = $('div.stock_add input.price').val();

  if(valid(productName, 'string') && valid(category, 'select') && valid(quantity, 'num'))
  {
    var id = generateProductId(productName, category);
    console.log(id);
    $.post('assets/php/employee.php',
    {
      operation: 'add_product',
      id: id, //this is the data thats parsed to the php file
      productName: productName, //this is the data thats parsed to the php file
      category: category, //this is the data thats parsed to the php file
      quantity: quantity,  //this is the data thats parsed to the php file
      price: price  //this is the data thats parsed to the php file
    },
    function(data) //this is a callback function which receives any result sent back from the php side...the echo's output codes//
    {
      if(data == '0') //so this 'data' correlates with whats sent by the php file
      {
        showAlert('Product already Exists', 2);
      }
      else if(data == '1')
      {
        showAlert('Record Added Successfully', 1);
        $('div.card.qr_code').addClass('show');
        generateQRCode(id);
        load_table();

      }else if(data == '2')
      {
        showAlert('Something went Wrong :(', 2);
      }
    });
  }
  else
  {
    if(!valid(productName, 'string'))
    {
      $('input.product').addClass('error');
    }

    if(!valid(category, 'select'))
    {
      $('.category').addClass('error');
    }

    if(!valid(quantity, 'num'))
    {
      $('div.stock_add input.quantity').addClass('error');
    }

    showAlert('Fill in Fields Correctly', 2)
  }
}

function edit_product()
{
  var id = $('div.stock_edit select.product').val();
  var quantity = parseInt(document.querySelector('div.stock_edit input.quantity').value);
  var price = parseInt(document.querySelector('div.stock_edit input.price').value);

  if(!valid(quantity, 'num'))
  {
    $('div.stock_edit input.quantity').addClass('error');
    showAlert('Fill in Fields Correctly', 2);
  }
  else
  {
    if(!valid(price, 'num'))
    {
      $('div.stock_edit input.price').addClass('error');
      showAlert('Fill in Fields Correctly', 2);
    }
    else
    {
      var change_type = '';
      var change_value = 0;

      if(oldQty == quantity)
      {
        change_type = 'NO CHANGE';
      }
      else if(oldQty > quantity)
      {
        change_type = 'STOCK REMOVED';
        change_value = (oldQty - quantity) * (-1);
      }
      else if(oldQty < quantity)
      {
        change_type = 'STOCK ADDED';
        change_value = (quantity - oldQty);
      }

      $.post('assets/php/employee.php',
      {
        operation: 'edit_product',
        id: id,
        change_type: change_type,
        change_value: change_value,
        quantity: quantity,
        price: price
      },
      function(data)
      {
        console.log(data);
        if(data == '1')
        {
          showAlert('Record Update Successful', 1);
          $('.stock_edit input.quantity').val('');
          $('.stock_edit input.price').val('');
          load_table();
        }
        else if(data == '2')
        {
          showAlert('Record Update Unsuccessful', 2);
        }
      });
    }
  }
}

function change_password()
{
  var admin_pass = document.getElementById('admin_pass').value;
  var new_pass = document.getElementById('new_pass').value;
  var new_pass_confirm = document.getElementById('new_pass_confirm').value;

  if(valid(admin_pass))
  {
    if(valid(new_pass))
    {
      if(valid(new_pass_confirm))
      {
        if(new_pass == new_pass_confirm)
        {
          console.log('fuck yea you can follow instructions');
          $.post('assets/php/employee.php',
          {
            operation: 'change_employee_password',
            admin_pass: admin_pass,
            username: employee_username,
            new_pass: new_pass
          },
          function(data)
          {
            if(data == '0')
            {
              showAlert('Your Password is Incorrect',2);
            }
            else if(data == '1')
            {
              showAlert(`No User With Username (${employee_username}) Found`, 2);
            }
            else if(data == '2')
            {
              showAlert('Paswword Changed', 1);
            }
            else
            {
              showAlert('Something Went Wrong', 2);
            }
          });
        }
        else
        {
          $('#new_pass_confirm').addClass('error');
          showAlert('Passwords Do Not Match', 2);
        }
      }
      else
      {
        $('#new_pass_confirm').addClass('error');
        showAlert('Do not Leave Fields Blank', 2);
      }
    }
    else
    {
      $('#new_pass').addClass('error');
      showAlert('Do not Leave Fields Blank', 2);
    }
  }
  else
  {
    $('#admin_pass').addClass('error');
    showAlert('Do not Leave Fields Blank', 2);
  }

}

function check_logged_in()
{
  if(sessionStorage.getItem('username'))
  {
    username = sessionStorage.getItem('username');
    user_type = sessionStorage.getItem('user_type');
    $('p.name').html('Hi, ' + sessionStorage.getItem('username'));
  }
  else
  {
    window.location.href = 'login_reg.html';
  }
}

function clear()
{
  $('input.error, select.error').removeClass('error');
  $('div.card input').val('');
  $('div.stock_add select').val('default');
}

function logout()
{
  sessionStorage.clear();
  window.location.href = 'login_reg.html';
}

function generateProductId(productName, category)
{
  category = category.substring(0, 3);
  productName = productName.substring(0, 3);
  var len = category.length + productName.length;
  var rnd = Math.floor(Math.random() * 10);
  return `${category}${productName}${len}${rnd}`;
}

function generateQRCode(productId)
{
  $('.qr_img').attr('src',`http://api.qrserver.com/v1/create-qr-code/?data={"product_id": "${productId}"}&size=300x300`);
}

function generateReport()
{
  var email = $('.email').val();

  if(!valid(email, 'email'))
  {
    $('input.email').addClass('error');
    showAlert('Invalid Email Address', 2);
  }
  else
  {
    $.post('php/generateReport.php',
    function(data)
    {
      if(data == '1')
      {
        showAlert('Sending Report...', 1, true);
      }
    })
    .done(function()
    {
      var today = get_current_date();
      var subject, filename, filePath;
      fileName = subject = "Stock Report " + (today.split(' ')[2]).substring(0,3) + " " + today.split(' ')[3];
      fileName += ".pdf";
      filePath = "../docs/" + fileName;
      sendMail(email, subject, fileName, filePath);
    });
  }
}

function get_current_date()
{
  var d = new Date();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  var today = days[d.getDay()] + ", " + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
  return today;
}

function killCam(e)
{
  var stream = video.srcObject;
  var tracks = stream.getTracks();

  for (var i = 0; i < tracks.length; i++)
  {
    var track = tracks[i];
    track.stop();
  }

  video.srcObject = null;

  $('div.status_message p').html('Success  <i class="fas fa-check"></i>');
  setTimeout(function(){ $(scannerElement).removeClass('show'); }, 3000);
}

function load_customers()
{
  $.post('assets/php/employee.php',
  {
    operation: 'load_customers'
  },
  function(data)
  {
    $('.customer_listing table').html(''); //empty the table so duplication doesnt occur
    if(data == '0') //if no customers found
    {
      $('.customer_listing table').append(`<tr><td colspan="4">No Customers Found :(</td></tr>`);
    }
    else
    {
      var customers = JSON.parse(data);
      for (var i = 0; i < customers.length; i++)
      {
        $('.customer_listing table').append(
          `
          <tr>
            <td>${customers[i].name}</td>
            <td>${customers[i].contact}</td>
            <td>${customers[i].address}</td>
            <td><p class="view_transactions" data-user="${customers[i].username}"><i class="fas fa-file-invoice-dollar"></i> View Transactions</p></td>
          </tr>
          `);
      }
    }
  });
}

function load_employees()
{
  $.post('assets/php/employee.php',
  {
    operation: 'load_employees'
  },
  function(data)
  {
    if(data == '0')
    {
      $('.employee_manage table').html('<tr><td colspan="4">No Employees Found</td></tr>');
    }
    else
    {
      var employees = JSON.parse(data);
      $('.employee_manage table').html('');
      for (var i = 0; i < employees.length; i++) {
        $('.employee_manage table').append(
          `
            <tr>
              <td>${employees[i].username}</td>
              <td>${employees[i].name}</td>
              <td><p class="change_password" data-username="${employees[i].username}"><i class="fas fa-key"></i> Change Password</p></td>
              <td><p class="change_access" data-username="${employees[i].username}" data-access="${employees[i].deleted}"><i class="${employees[i].deleted == 0 ? "fas fa-minus-circle" :  "fas fa-plus-circle" }" ></i>${employees[i].deleted == 0 ? " Remove Access" :  " Give Access" }</p></td>
            </tr>
          `);
      }
    }
  });
}

function load_products()
{
  $.post('assets/php/employee.php',
  {
    operation: 'load_products'
  },
  function(data)
  {
    if(data == '0')
    {
      $('div.stock_edit select.product').html(`<select class="product"><option value="">No Stock :( </option></select>`);
    }
    else
    {
      $('div.stock_edit select.product').html('');
      var product_info = JSON.parse(data);
      for (var i = 0; i < product_info.length; i++)
      {
        $('div.stock_edit select.product').append(`<option value="${product_info[i].product_id}">${product_info[i].product_name}</option>`);
      }
    }
  });
}

function load_product_info()
{
  var id = $('div.stock_edit select.product').val();
  $.post('assets/php/employee.php',
  {
    operation: 'load_product_info',
    id: id
  },
  function(data)
  {
    if(data == '0')
    {
      showAlert('Product Info Not Found', 2);
    }
    else
    {
      product_info = JSON.parse(data);
      $('div.stock_edit input.quantity').val(product_info[0].quantity);
      $('div.stock_edit input.price').val(product_info[0].price);
      oldQty = product_info[0].quantity;
    }
  });
}

function load_table()
{
  var search = $('div.search input').val();
  $.post('assets/php/employee.php',
  {
    operation: 'load_table',
    type: 'search_bar',
    search: search
  },
  function(data)
  {
    if(data == '0')
    {
      $('div.stock_display table tbody').html('<tr class="no_records"><td colspan="4">No Records Found :( </td></tr>');
    }
    else
    {
      $('div.stock_display table tbody').html('');
      var rows = JSON.parse(data);
      for (var i = 0; i < rows.length; i++)
      {
        $('div.stock_display table tbody').append(
          `
          <tr>
            <td>${rows[i].product_id}</td>
            <td>${rows[i].category}</td>
            <td>${rows[i].product_name}</td>
            <td>${rows[i].quantity}</td>
            <td>R${rows[i].price}</td>
          </tr>
          `);
      }
    }
  });
}

function set_product(obj)
{
  var id = obj.product_id;
  $('div.stock_edit select.product').val(id);

  load_product_info();
}

function showAlert(text, type, stay)
{
  $('div.alert_message p.message').html(text);
  if(type === 1)
  {
    $('div.alert_message').addClass('success');
    $('.message_type_icon').removeClass('fa-times');
    $('.message_type_icon').addClass('fa-check');
  }
  else if(type === 2)
  {
    $('div.alert_message').addClass('fail');
    $('.message_type_icon').addClass('fa-times');
    $('.message_type_icon').removeClass('fa-check');
  }
  $('div.alert_message').addClass('show');

  if(!stay)
  {
    setTimeout(function()
    {
      $('div.alert_message').removeClass('show');
      $('div.alert_message').removeClass('success');
      $('div.alert_message').removeClass('fail');
    }, 3200);
  }
}

function valid(input, type)
{
  if(input == '' || input == ' ')
  {
    return false;
  }
  else
  {
    if(type == 'num')
    {
      if($.isNumeric(input))
      {
        return true;
      }
      else
      {
        return false;
      }
    }
    else if(type == 'select')
    {
      if(input == 'default')
      {
        return false;
      }
      else
      {
        return true;
      }
    }
    else if(type == 'email')
    {
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(input))
      {
        return true;
      }
      else
      {
        return false;
      }
    }
    else
    {
      return true;
    }
  }
}


//////////////////////////////////////////////////////////////////////////////
//Event Handling

$(document).ready(function()
{
  $('span.date').html(get_current_date());
  $('.search_bar').keyup(function(e){
    if(e.keyCode === 13)
    {
      $('.btn_search').click();
    }
  });
  check_logged_in();
});

$(document).on('click', '.btn_add', function()
{
  add_product();
});

$(document).on('click', '.btn_add_employee', function()
{
  add_employee();
});

$(document).on('click', '.btn_change_password', function()
{
  change_password();
});

$(document).on('click', '.btn_download', function()
{
  var src = $('div.card_body img').attr('src');
  var fileName = `${$('div.stock_add input.product').val()}.png`;
  console.log(fileName);
  saveAs(src, fileName);
});

$(document).on('click', '.btn_download_report', function()
{
});

$(document).on('click', '.btn_logout', function()
{
  logout();
});

$(document).on('click', '.btn_open_add', function()
{
  document.getElementsByClassName('stock_add')[0].classList.toggle('show');
});

$(document).on('click', '.btn_open_edit', function()
{
  document.getElementsByClassName('stock_edit')[0].classList.toggle('show');
  load_products();
});

$(document).on('click', '.btn_open_add_user', function()
{
  $('.employee_add').addClass('show');
});

$(document).on('click', '.btn_open_manage_user', function()
{
  load_employees();
  $('.employee_manage').addClass('show');
});

$(document).on('click', '.btn_open_customer_listing', function()
{
  load_customers();
  $('.customer_listing').addClass('show');
});

$(document).on('click', '.close', function()
{
  var extra_wrap = $(this).attr('data-close');
  $(extra_wrap).removeClass('show');
  clear();
});

$(document).on('click', '.btn_search', function()
{
  load_table();
  console.log('awe');
});

$(document).on('click', '.btn_update', function()
{
  edit_product();
});

$(document).on('click', '.change_access', function()
{
  var username = $(this).attr('data-username');
  var access = $(this).attr('data-access');

  if(access == '0' || access == 0)
  {
    access = 1;
  }
  else if(access == '1' || access == 1)
  {
    access = 0;
  }

  $.post('assets/php/employee.php',
  {
    operation: 'change_access',
    username: username,
    access: access
  },
  function(data)
  {
    if(data == '1')
    {
      load_employees();
      showAlert('User Access Changed', 1);
    }
    else
    {
      showAlert('Something Went Wrong', 2);
    }
  });
});

$(document).on('click', '.change_password', function()
{
  $('.employee_password_change').addClass('show');
  employee_username = $(this).attr('data-username');
  console.log(employee_username);
});

$(document).on('change', 'div.stock_edit select.product', function()
{
  load_product_info();
});

$(document).on('click', 'p.view_transactions', function()
{
  var username = $(this).attr('data-user');
  window.open(`transactions.php?uname=${username}`, '_blank')
});

/////////////////////////////////////////////////////////////////////////////
// Removes error highlight

$('input.product').on('click focus', function()
{
  $(this).removeClass('error');
});

$('.category').on('click focus', function()
{
  $(this).removeClass('error');
});

$('.stock_add input.quantity').on('click focus', function()
{
  $(this).removeClass('error');
});

$('.stock_edit input.quantity').on('click focus', function()
{
  $(this).removeClass('error');
});

$('.stock_add input.price').on('click focus', function()
{
  $(this).removeClass('error');
});

$('.stock_edit input.price').on('click focus', function()
{
  $(this).removeClass('error');
});

$('.send_report input.email').on('click focus', function()
{
  $(this).removeClass('error');
});

$('.employee_add input.add_name').on('click focus', function()
{
  $(this).removeClass('error');
});

$('.employee_add input.add_username').on('click focus', function()
{
  $(this).removeClass('error');
});

$('.employee_add input.add_pass').on('click focus', function()
{
  $(this).removeClass('error');
});

$('.employee_add input.add_pass_confirm').on('click focus', function()
{
  $(this).removeClass('error');
});

$('#admin_pass').on('click focus', function()
{
  $(this).removeClass('error');
});

$('#new_pass').on('click focus', function()
{
  $(this).removeClass('error');
});

$('#new_pass_confirm').on('click focus', function()
{
  $(this).removeClass('error');
});


/////////////////////////////////////////////////////////////////////////////
