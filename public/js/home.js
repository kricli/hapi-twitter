$(document).ready(function(){
  var authenticationData;
  var usersData;
  var tweetsData;

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

  $('#submitButton').click(function() {
    $.ajax({
      method:   'POST',
      dataType: 'JSON',
      data:     {tweet: {message: $('#tweetMessage').val()}},
      url:      'http://localhost:3000/tweets',
      success:  (function(response){
        return window.location.reload();
      }),
    });
  });

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
      context: this,
      method:   'GET',
      async: false,
      dataType: 'JSON',
      url:      'http://localhost:3000/users',
      success:  (function(response){
        usersData = response;
        console.log(usersData);
        $('#name').text(($.grep(usersData, function(e){ return e._id == authenticationData.user_id; }))[0].name);
      }),
    });
  };

  loadData.prototype.idToData = function(userID,key){
    return ($.grep(usersData, function(e){ return e._id == userID; }))[0].key;
  };

  loadData.prototype.tweetsData = function() {
    var callBackFunction = function(response) {
      var html = '';
      tweetsData = response;
      console.log(tweetsData);
      tweetsData.reverse().forEach(function(e){
        var userID = e.user_id;
        var name = ($.grep(usersData, function(e){ return e._id == userID; }))[0].name;
        html +=   "<div class='tweets'>";
        html +=   "<div class='tweets_name'>";
        html +=   name;
        html +=   "</div>";
        html +=   "<div class='tweets_message'>";
        html +=   e.message;
        html +=   "</div>";
        html +=   "<div class='tweets_date'>";
        html +=   e.date;
        html +=   "</div>";
        html +=   "</div>";
      });
      console.log(html);
      $('#mainTweets').html(html);
    };
    $.ajax({
      method:   'GET',
      dataType: 'JSON',
      url:      'http://localhost:3000/tweets',
      success:  callBackFunction
    });
  };


  var loaddata = new loadData();
  loaddata.authenticationData();
  loaddata.usersData();
  loaddata.tweetsData();

});
