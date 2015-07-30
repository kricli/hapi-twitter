$(document).ready(function(){
  var authenticationData;
  var usersData;


  var Signout = function() {
  };

  Signout.prototype.signoutDelete = function() {
    var successCallBack = function(reply) {
      window.location.reload();
    };
    $.ajax({
      method:   'DELETE',
      url:      'http://localhost:3000/sessions',
      success:  successCallBack
    });
  };

  $('#signoutButton').click(function(e){
    e.preventDefault();
    var signout = new Signout();
    signout.signoutDelete();
  });



  var loadData = function() {

  };

  loadData.prototype.authenticationData = function() {
    $.ajax({
      async: false,
      method:   'GET',
      dataType: 'JSON',
      url:      'http://localhost:3000/authenticated',
      success:  (function(response){
        authenticationData = response;
        console.log(authenticationData);
      }),
    });
  };

  loadData.prototype.usersData = function() {
    $.ajax({
      method:   'GET',
      dataType: 'JSON',
      url:      'http://localhost:3000/users',
      success:  (function(response){
        usersData = response;
        console.log(usersData);
        console.log(($.grep(usersData, function(e){ return e._id == authenticationData.user_id; }))[0].name);
        $('#name').text(($.grep(usersData, function(e){ return e._id == authenticationData.user_id; }))[0].name);
      }),
    });
  };

  var loaddata = new loadData();
  loaddata.authenticationData();
  loaddata.usersData();


});
