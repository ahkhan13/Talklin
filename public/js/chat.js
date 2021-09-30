
$(document).ready(function(){
var socket = io.connect('http://localhost:3000');
var chatfriend = $('.chat-friend').html();
var username = $('.user').html();
    
    var height = $('.msg').height();
       $('.chat-box').scrollTop(height);

    socket.emit("New-user-joined", username);
    socket.on('user-connected', (user)=>{
        userJoin(user, 'Online');
    });

    function userJoin(name, status){
        $('.'+name).addClass('Online').removeClass('Offline').html(status);
        $('#'+name).html(status);
    }
    function userLeft(name, status){
        $('.'+name).removeClass('Online').addClass('Offline').html(status);
       }
    function userLastSeen(name,status){
        $('#'+name).html("last seen today at "+status);
    }
    socket.on('user-disconnected', (data)=>{
        userLeft(data.user, 'Offline');
        userLastSeen(data.user, data.time);
    })

     socket.on('user-list', (users)=>{
         users_arr=Object.values(users);
         for(var i=0; i<users_arr.lenght; i++){
            $('.user-list').html(users_arr); 
         }
     })

     $('#sendbtn').click(function(){
         var msg = $('#input-msg').val();
         var dt = new Date();
         var hour = dt.getHours();
         var am_pm = hour > 12 ? "pm" : "am";
         var time = dt.getHours() + ":" + dt.getMinutes()+" "+am_pm;
         if(msg === ""){
    
         }else{
             let data={
                 from:username,
                 msg:msg,
                 to:chatfriend,
                 time:time
             }
             appendMessage(data, 'outgoing');
             socket.emit('message', data);
             $('#input-msg').val("");
         }
     })

     $('#input-msg').keypress(function(e){
         if(e.key==="Enter"){
            var dt = new Date();
            var hour = dt.getHours();
            var am_pm = hour > 12 ? "pm" : "am";
            var time = dt.getHours() + ":" + dt.getMinutes()+" "+am_pm;
            var msg = $('#input-msg').val();
            if(msg === ""){
            }else{
            let data={
                from:username,
                msg:msg,
                to:chatfriend,
                time:time
            }
            //socket.emit("userStatus", data);
            appendMessage(data, 'outgoing');
            socket.emit('message', data);
            $('#input-msg').val("");
        }
         }else{
            
         }
     
    })
   
  /* $('#input-msg').keyup(function(e){
        let data={
            from:username,
            to:chatfriend
        }
        socket.emit("onkeyup", data);
    })
    */
    
     function appendMessage(data, status){
        //var msgg= $('.sender-msg').append(data.msg);
        var m= `<div class="row my-1">
        <div class="offset-md-6 col-md-6">
          <div class="sender-msg py-1">
           <p class='mx-3 senderMessages'>${data.msg}</p>
            <div class="time mx-3">
            ${data.time}
             </div>
          </div>
        </div>`;
        $(m).appendTo($('.msg'));
        var height = $('.msg').height();
        $('.chat-box').scrollTop(height);
        
     }

    $('#input-msg').focus(function(){
        let data={
            from:username,
            to:chatfriend
        }
     socket.emit("onfocus", data); 
    })
    $('#input-msg').focusout(function(){
        let data={
            from:username,
            to:chatfriend
        }
     socket.emit("onfocusout", data); 
    })
    function onfocusEvent(name, status){
        $('.status').html(status);
     }
    socket.on("onfocus", (data)=>{
        onfocusEvent(data, 'Typing');
    })
     function onkeyupEvent(name, status){
        $('.status').html(status);
     }
     socket.on("onfocusout", (data)=>{
        onfocusEvent(data, 'Online');
    })
  
     socket.on("message", (data)=>{
         incomingMessage(data, 'incoming');
     })

     function incomingMessage(data, status){
        var m= `<div class="row my-1">
        <div class="col-md-6">
          <div class="reciever-msg py-1">
           <p class='mx-3 recieverMessages'> ${data.msg} </p>
            <div class="time mx-3">
             ${data.time}
             </div>
          </div>
        </div>`;
        $(m).appendTo($('.msg'));
        var height = $('.msg').height();
        $('.chat-box').scrollTop(height);
        
    }  
  

    $('.addFriend').click(function(){
        var id = $(this).attr('id');
        var reciever = $(this).attr('friend-name');
        var data = {};
            data.id = id;
            data.sender = username;
            data.reciever = reciever;
            socket.emit("addFriend", data);
            $.ajax({
              url: "/addfriend",
              method: "POST",
              data: JSON.stringify(data),
              contentType: 'application/json',
              url:'http://localhost:3000/addFriend',		
              success: function(data){
              if(data==1){
                $('#'+id).removeClass("addFriend");
                $('#'+id).addClass("requested").html("Requested..");
              }else{
                alert("fail");
              }
              }
            })
        });
    
    function showNotification(name){
      $('.notification').html(name +" has been sent you a friend request").fadeIn();
      setTimeout (function(){
      $('.notification').fadeOut();
      },20000);
    }
    socket.on('notification', (data)=>{
        showNotification(data.sender);
    })
    

})