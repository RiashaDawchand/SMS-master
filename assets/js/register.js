$(document).ready(function()
{
  username = sessionStorage.getItem('username');
  password = sessionStorage.getItem('password');
});


$('#btn_no_otp').on('click',function()
{
  $('.card.otp_confirm').addClass('resend');
});

$('#btn_confirm_otp').on('click',function()
{
  var otp  = document.getElementById('otp').value;
  console.log('test');
  if(otp)
  {
    $.post('assets/php/login_reg.php',
    {
      operation: 'otp_confirm',
      otp: otp,
      username: username
    },function(data)
    {
      if(data == '0')
      {
        showAlert('OTP Incorrect', 2);
      }
      else if(data == '1')
      {
        showAlert('OTP Verified', 1);
        setTimeout(function()
        {
          $('.card.otp_confirm').css('display', 'none');
          $('.card.details').css('display', 'block');
          $('#username').val(username);
        }, 4000);
      }
    });
  }
  else
  {
    showAlert("Please Enter the OTP", 2);
  }
});

$('#btn_complete_reg').on('click', function()
{
  var title = document.getElementById('title').value;
  var fname = document.getElementById('fname').value;
  var surname = document.getElementById('surname').value;
  var contact = document.getElementById('contact').value;
  var province = document.getElementById('province').value;
  var address = document.getElementById('address').value;

  if(title != 'default' && fname && surname && contact && province != 'default' && address)
  {
    $.post('assets/php/login_reg.php',
    {
      operation: 'reg_complete',
      username: username,
      password: password,
      title: title,
      fname: fname,
      surname: surname,
      contact: contact,
      province: province,
      address: address
    },function(data)
    {
      if(data == '1' || data == '2')
      {
        showAlert('Something Went Wrong', 2);
        console.log(data);
      }
      else
      {
        showAlert('Registration Complete');
        setTimeout(function()
        {
          sessionStorage.setItem('username', username);
          window.location.href = 'index.html';
        }, 4000);
      }
    });
  }
  else
  {
    showAlert('Do Not Leave Fields Blank', 2);
  }
});

$(document).on('click' , '#btn_resend_otp', function()
{
  var username  = document.getElementById('otp_resend_email').value;
  $.post('assets/php/login_reg.php',
  {
    operation: 'check_otp_exists',
    username: username
  },
  function(data)
  {
    if(data == "0")
    {
      showAlert('No Record Found, Please Register', 2);
    }
    else
    {
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
});


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
  }, 3500);
  }
}
