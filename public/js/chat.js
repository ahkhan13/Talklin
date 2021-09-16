$(document).ready(function(){
var socket = io.connect('http://localhost:3000');
var chatfriend = $('.chat-friend').html();
var username = $('.user').html();
    
var height = $('.chat-box').height();
$('.chat-box').scrollTop(height-50);

    socket.emit("New-user-joined", username);
    socket.on('user-connected', (user)=>{
    userJoinLeft(user, 'Joined');
    });

    function userJoinLeft(name, status){
     $('#'+name).html(status);
    }

    socket.on('user-disconnected', (user)=>{
        userJoinLeft(user, 'Offline');
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
         var time = dt.getHours() + ":" + dt.getMinutes();
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
            var time = dt.getHours() + ":" + dt.getMinutes();
            e.preventDefault();
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
        var m= `<div class="row my-2">
        <div class="offset-md-6 col-md-6">
          <div class="sender-msg">
           <span class='mx-3 senderMessages'>${data.msg}</span>
            <div class="time mx-3">
            ${data.time}
             </div>
          </div>
        </div>`;
        $(m).appendTo($('.msg'));
        var height = $('.chat-box').height();
        $('.chat-box').scrollTop(height-50);
        
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
        var m= `<div class="row my-2">
        <div class="col-md-6">
          <div class="reciever-msg">
           <span class='mx-3 recieverMessages'> ${data.msg} </span>
            <div class="time mx-3">
             ${data.time}
             </div>
          </div>
        </div>`;
        $(m).appendTo($('.msg'));
        var height = $('.chat-box').height();
        $('.chat-box').scrollTop(height-50);
        
    }    
})