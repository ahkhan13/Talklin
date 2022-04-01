
$(document).ready(function(){
var socket = io.connect('http://localhost:3000');
var chatfriend = $('.chat-friend-name').html();
var username = $('.user').html();

var height = $('.chat-messages-container').height();
$('.chat-container').scrollTop(height);

    socket.emit("New-user-joined", username);
    socket.on('user-connected', (user)=>{
        userJoin(user, 'Online');
    });

    function userJoin(name, status){
        $(`.friend-link .${name}`).addClass('Online').removeClass('Offline');
        $('#status-'+name).html(status);
    }
    function userLeft(name, status){
        $(`.friend-link .${name}`).removeClass('Online').addClass('Offline');
       }
    function userLastSeen(name,status){
        $('#status-'+name).html("last seen today at "+status);
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

     $('#send-btn').click(function(){
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

$('#input-msg').keyup(function(e){
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
            let dataa={
                from:username,
                to:chatfriend,
                value:inputfield
               }
            //socket.emit("userStatus", data);
            appendMessage(data, 'outgoing');
            socket.emit('message', data);
            socket.emit("onfocusout", dataa); 
            $('#input-msg').val("");
        }
         }else{
            var inputfield = $('#input-msg').val();
            let data={
            from:username,
            to:chatfriend,
            value:inputfield
           }
        socket.emit("onfocus", data); 
            
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
        var m=`<div class="msg-container my-1">
        <div class="space">
         
        </div>
         <div class="sender-msg">
          <div class="senderMessages mx-2">
            ${data.msg}
          </div>
          <div class="send-time mx-2">
          <i class="far fa-check"></i> ${data.time}
          </div>
     </div>
   </div>`;
        $(m).appendTo($('.chat-messages-container'));
        var height = $('.chat-messages-container').height();
        $('.chat-container').scrollTop(height);   
  }





    var typing = false;
    var timeout = undefined;
   function timeoutFunction(){
        typing = false;
        let data={
            from:username,
            to:chatfriend
        }
      socket.emit("onfocusout", data);
      }
    $('#input-msg').keyup(function(){
    if(typing==false){
         typing = true;
         let data={
            from:username,
            to:chatfriend
        }
      socket.emit("onfocus", data);
      timeout = setTimeout(timeoutFunction, 5000);
    }else{
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 5000);
      
    }
    })
    
    
   
   
    function onfocusEvent(name, status){
        $(`#status-${name.user}`).html(status);
     }
    socket.on("onfocus", (data)=>{
        onfocusEvent(data, 'Typing');

    })
    socket.on("onfocusout", (data)=>{
        onfocusEvent(data, 'Online');

    })
     function onkeyupEvent(name, status){
        $('.status').html(status);
     }
    
     function showUnreadMsgCount(data){
         $(`.talk-friend-btn .${data.user}`).fadeIn().addClass('newMsg');
         $(`.${data.user} .new-msg-count`).html(data.UnreadMsgCount);

        // $('.new-msg-notify .new-msg-count').html(data.UnreadMsgCount);
     }
     function showNewMsg(data){
         var str = data.msg;
         if(str.length>10){
            var shortText = jQuery.trim(str).substring(0, 10)
            .split(" ").slice(0, -1).join(" ") + "...";
            $(`.talk-friend-btn .${data.user}`).fadeIn().addClass('newMsg');
            $(`.${data.user} .new-msg-count`).html(shortText);
         }
         else{
            $(`.talk-friend-btn .${data.user}`).fadeIn().addClass('newMsg');
            $(`.${data.user} .new-msg-count`).html(str);
         }
       

       // $('.new-msg-notify .new-msg-count').html(data.UnreadMsgCount);
    }
    function inChatoutgoingMessage(data){
    $(`.fa-check`).addClass('seen');
    }
    socket.on("inchatoutgoingmessages", (data)=>{
        inChatoutgoingMessage(data);
    })
     socket.on("messages", (data)=>{
         incomingMessage(data, 'incoming');
         showUnreadMsgCount(data);
       //  outgoingMessage();
     })
     socket.on("inchatmessages", (data)=>{
        incomingMessage(data, 'incoming');
       // inChatoutgoingMessage();
        showNewMsg(data);
    })
    function incomingMessage(data, status){
        var m= `<div class="msg-container my-1">
        <div class="reciever-msg my-2">
          <div class="recieverMessages mx-2">
            ${data.msg}
        </div>
        <div class="recieve-time mx-2">
            ${data.time}
        </div>
      </div>
      <div class="space">

      </div>
  </div>`;
      $(m).appendTo($(`.chat-container .${data.user}`));
      var height = $('.chat-messages-container').height();
      $('.chat-container').scrollTop(height);
        
    }  

    
  

    $('.addFriend').click(function(){
        var id = $(this).attr('id');
        var reciever = $(this).attr('friend-name');
        var data = {};
            data.id = id;
            data.sender = username;
            data.reciever = reciever;
            //socket.emit("addFriend", data);
            $.ajax({
              url: "/addfriend",
              method: "POST",
              data: JSON.stringify(data),
              contentType: 'application/json',
              url:'http://localhost:3000/addFriend',		
              success: function(data){
              if(data==1){
                socket.emit("addFriend",{sender:username, reciever:reciever});
                $('#'+id).removeClass("addFriend");
                $('#'+id).addClass("requested").html("Requested..");
                
              }else{
                
              }
              }
            })
        });
    
    function showNotification(name){
      $('.friends-notify').addClass('active-friends-notify');
    }
    socket.on('request-notification', (data)=>{
        showNotification(data.sender);
    })
    function inChat(data){
        $(`.${data.user} .fa-check`).addClass('seen');    
    }
    socket.emit('updateUnreadMsgStatus', {user:username, friend:chatfriend});
    socket.on('updateUnreadMsgStatus', (data)=>{
        inChat(data);  
        
    })
    

})