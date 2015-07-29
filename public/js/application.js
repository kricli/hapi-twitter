$(document).ready(function(){
  var Signup = function(userData) {
    this.userData = userData;
  };

  var Signin = function(userData) {
    this.userData = userData;
  };

  Signup.prototype.signupPost = function(){
    var successCallBack = function(reply){
      $('.alert').hide();
      if (reply.userExist) {
        return $('#alertSignupExists').show();
      }
      if (reply.ok === 1) {
        return $('#alertSignupSuccess').show();
      }
    };

    var errorCallBack = function(error){
      $('.alert').hide();
      var x = error.responseJSON.validation.keys[0];
      switch (x) {
        case 'user.name':
          return $('#alertSignupName').show();
        case 'user.username':
          return $('#alertSignupUsername').show();
        case 'user.password':
          return $('#alertSignupPassword').show();
        case 'user.email':
          return $('#alertSignupEmail').show();
      }
    };
    $.ajax({
      method:   'POST',
      data:     {user: this.userData},
      dataType: 'JSON',
      url:      'http://localhost:3000/users',
      success:  successCallBack,
      error:    errorCallBack
    });
  };

  $('#signupForm').submit(function(e){
    e.preventDefault();
    var signup = new Signup(
      { name: $('#signupFullnameInput').val(),
        username: $('#signupUsernameInput').val(),
        password: $('#signupPasswordInput').val(),
        email: $('#signupEmailInput').val()
      });
    signup.signupPost();
  });

  $('#signinForm').submit(function(e){
    e.preventDefault();
    var signin = new Signin(
      { username: $('#signinUsernameInput').val(),
        password: $('#signinPasswordInput').val()
      });
    signin.signinPost();
  });


});
