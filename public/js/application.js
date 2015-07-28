$(document).ready(function(){
  var Signup = function(userData) {
    this.userData = userData;
  };


  Signup.prototype.signupPost = function(){
    $.ajax({
      method:   'POST',
      data:     {user: this.userData},
      dataType: 'JSON',
      url:      'http://localhost:3000/users',
      success:  function() {console.log('done');},
    });
  };

  $('form').submit(function(e){
    e.preventDefault();
    console.log('123');
    var signup = new Signup({
      name: $('#signupFullnameInput').val(),
      username: $('#signupUsernameInput').val(),
      password: $('#signupPasswordInput').val(),
      email: $('#signupEmailInput').val()
    });
    console.log({user:signup.userData}.user);
    signup.signupPost();
  });


});
