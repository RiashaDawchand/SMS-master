//Event Handling

$(document).ready(function()
{
  $('.search_bar').keyup(function(e){
    if(e.keyCode === 13)
    {
      $('.btn_search').click();
    }
  });

  load_table();
  check_logged_in();

});

$(document).on('click', '.btn_search', function()
{
  load_table();
});

$(document).on('click', '.btn_login', function()
{
  window.location.href = 'login_reg.html';
});

$(document).on('click', '.btn_logout', function()
{
  sessionStorage.removeItem('username');
  document.location.href = 'index.html';
});

$(document).on('click', '.btn_add_to_cart', function()
{
  add_to_cart();
});

$(document).on('click', '.btn_checkout', function()
{
  checkout();
});

$(document).on('click', '.btn_view_cart', function()
{
  display_cart();
  $('.modal_wrapper.cart').css('display','flex');
});

$(document).on('click', '.btn_edit_profile', function()
{
  load_details();
  $('.modal_wrapper.edit_profile').css('display', 'flex');
});

$(document).on('click', '#btn_save', function()
{
  save_details();
});

$(document).on('click', 'tbody tr td i', function()
{
  if(sessionStorage.getItem('username'))
  {
    load_product_info($(this).attr('id'));
  }
  else
  {
    $('.modal_wrapper.error').css('display', 'flex');
  }
});

$(document).on('click', 'i.remove_from_cart', function()
{
  var idx = $(this).attr('data-arr-idx');
  cart.splice(idx, 1);
  display_cart();
});

$(document).on('click', '.modal i.fa-times-circle', function()
{
  $('.modal_wrapper').css('display', 'none');
});

$(document).on('change', 'p#qty input', function()
{
  $('p#total').text(`R${jsonData[0].cost * parseInt(document.querySelector('#qty input').value)}`);
});

//////////////////////////////////////////////////////////////////////////////
function add_to_cart()
{
  var in_cart = false;
  var cart_index = 0;
  var cartObj =
  {
    'product_id': jsonData[0].product_id,
    'product_name': jsonData[0].product_name,
    'selected_qty': parseInt($('input[type="number"]').val()),
    'cost': jsonData[0].cost * parseInt($('input[type="number"]').val())
  };

  if(cart.length == 0)
  {
    in_cart = false;
  }
  else
  {
      for (var i = 0; i < cart.length; i++) {
        if(cart[i].product_id == cartObj.product_id)
        {
          in_cart = true;
          cart_index = i;
        }
      }
  }

  if(!in_cart)
  {
    cart.push(cartObj);
    showAlert('Item Added To Cart', 1);
    $('.modal_wrapper.add_to_cart').css('display', 'none');
  }
  else
  {
    cart[cart_index] = cartObj;
    showAlert('Cart Updated', 1);
    $('.modal_wrapper.add_to_cart').css('display', 'none');
  }


  console.log(cart);
}

function checkout()
{
  if(cart.length == 0)
  {
    showAlert('No Item Selected', 2);
  }
  else
  {
    var cart_d = JSON.stringify(cart);
    var total = calculate_total(cart);
    console.log(total);
    $.post('assets/php/index.php',
    {
      operation: 'checkout',
      cart: cart_d,
      username: username,
      total: total
    },
    function(data)
    {
      if(data == '1')
      {
        cart = [];
        display_cart();
        load_table();
        showAlert('Purchase Successful', 1);
      }
      else
      {
        showAlert('Something Went Wrong', 2);
        console.log(data);
      }
    });
  }
}

function check_logged_in()
{
  if(sessionStorage.getItem('username'))
  {
    username = sessionStorage.getItem('username');
    $('p.name').html('Hi, ' + sessionStorage.getItem('username'));
    $('.btn_login').css('display', 'none');
    cart = [];
  }
  else
  {
    $('.operations button').css('display', 'none');
    $('.btn_login').css('display', 'block');
  }
}

function display_cart()
{
  $('.modal_wrapper.cart .content .items').html('');

  for (var i = 0; i < cart.length; i++)
  {
    $('.modal_wrapper.cart .content .items').append(
      `
      <div class="row">
        <div class="col product"> ${cart[i].product_name}<span class="qty">(${cart[i].selected_qty})</span></div>
        <div class="col total">R${cart[i].cost}</div>
        <div class="col remove"><i data-arr-idx="${i}" class="fas fa-minus-square remove_from_cart"></i></div>
      </div>
      `);
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

function load_details()
{
  $.post('assets/php/index.php',
  {
    operation: 'load_details',
    username: username
  },
  function(data)
  {
    if(data == '0')
    {
      showAlert('Info Not found', 2);
    }
    else
    {
      var details = JSON.parse(data);

      document.getElementById('username').value = details[0].username;
      document.getElementById('title').value = details[0].title;
      document.getElementById('fname').value = details[0].fname;
      document.getElementById('surname').value = details[0].surname;
      document.getElementById('contact').value = details[0].contact;
      document.getElementById('province').value = details[0].province;
      document.getElementById('address').value = details[0].address;
    }
  });
}

function save_details()
{
  var username = document.getElementById('username').value;
  var title = document.getElementById('title').value;
  var fname = document.getElementById('fname').value;
  var surname = document.getElementById('surname').value;
  var contact = document.getElementById('contact').value;
  var province = document.getElementById('province').value;
  var address = document.getElementById('address').value;

  if(title != 'default' && fname && surname && contact && province != 'default' && address)
  {
    $.post('assets/php/index.php',
    {
      operation: 'save_details',
      username: username,
      title: title,
      fname: fname,
      surname: surname,
      contact: contact,
      province: province,
      address: address
    },
    function(data)
    {
      if(data == '0')
      {
        showAlert('Something Went Wrong', 2);
      }
      else if(data == '1')
      {
        showAlert('Information Updated', 1);
      }
    });
  }
  else
  {
    showAlert('Do Not Leave Fields Blank', 2);
  }
}

function load_product_info(product_id)
{
  $.post('assets/php/index.php',
  {
    operation: 'fetch_product_info',
    product_id: product_id
  }, function(data)
  {
    if(data == '0')
    {
      showAlert('Something went wrong', 2);
    }
    else
    {
      jsonData = JSON.parse(data);
      $('p#product').text(jsonData[0].product_name);
      $('p#cost').text(`R${jsonData[0].cost}`);
      $('#qty input').attr('max', parseInt(jsonData[0].quantity));
      document.querySelector('#qty input').value = 1;

      $('p#total').text(`R${jsonData[0].cost * parseInt(document.querySelector('#qty input').value)}`);

      $('.add_to_cart').css('display','flex');
    }
  });
}

function load_table()
{
  var search = $('div.search input').val();
  $.post('assets/php/loadTable.php',
  {
    type: 'bar',
    search: search
  },
  function(data)
  {
    $('div.stock_display table tbody').html(data);
  });
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

function calculate_total(cart)
{
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    total += cart[i].cost;
  }

  return total;
}
