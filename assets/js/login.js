$(document).on('click', '.no_account', function()
{
  $('.card').removeClass('login');
  $('.card').addClass('reg');
});

$(document).on('click', '.yes_account', function()
{
  $('.card').removeClass('reg');
  $('.card').addClass('login');
});

$(document).on('click', '.btn_login', function()
{
  var username  = document.getElementById('login_username').value;
  var password  = document.getElementById('login_password').value;

  if(username && password)
  {
    $.post('assets/php/login_reg.php',
    {
      operation: 'login',
      username: username,
      password: password
    },
    function(data)
    {
      if(data == '0')
      {
        showAlert('No Account Found, Please Register', 2);
      }
      else if(data == '1')
      {
        showAlert('Username and Password Do Not Match', 2);
      }
      else
      {
        var user_type = data.split(';')[1];
        showAlert('Login Succesful', 1);

        setTimeout(function()
        {
          sessionStorage.setItem('username', username);
          sessionStorage.setItem('user_type', user_type);

          if(user_type == '0' || user_type == '1')
          {
            window.location.href = "employee.html";
          }
          else if(user_type == '2')
          {
            window.location.href = "index.html";
          }
        },4000);
      }
    });
  }
  else
  {
    showAlert('Enter Username and Password ', 2);
  }
});

$(document).on('click', '.btn_reg', function()
{
  var username  = document.getElementById('login_username').value;
  var password  = document.getElementById('login_password').value;
  var password_confirm  = document.getElementById('password_confirm').value;

  if(username && password && password_confirm)
  {
    if(password == password_confirm)
    {
      $.post('assets/php/login_reg.php',
      {
        operation: 'register',
        username: username
      },
      function(data)
      {
        if(data == '0')
        {
          showAlert('Account With This Username Already Exists', 2);
        }
        else if(data == '1')
        {
          showAlert('Registration Process Has Started, Check Your Email for an OTP', 2);
          setTimeout(function()
          {
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('password', password);
            window.location.href = 'register.html';
          }, 4000);
        }
        else
        {
          showAlert('Register Successful', 1);
          $.post('assets/php/login_reg.php',
          {
            operation: 'send_otp',
            username: username,
            otp: data
          },function(datas)
          {
            if(datas == '1')
            {
              showAlert('OTP sent', 1);
              setTimeout(function()
              {
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('password', password);
                window.location.href = 'register.html';
              }, 4000);
            }
            else
            {
              showAlert(`Error: ${datas}`, 2);
            }
          });
        }
      });
    }
    else
    {
      showAlert('Passwords Do Not Match', 2);
    }
  }
  else
  {
    showAlert('Make Sure all Fields are Entered', 2);
  }
});


// $().on('click' ,function(){});

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
//
