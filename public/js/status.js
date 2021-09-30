$(document).ready(function(){
    var socket = io.connect('http://localhost:3000');
    var username = $('.user').html();
    alert(username);
    socket.emit("New-user-joined",username);
    socket.on('user-connected', (socket_name)=>{
         userJoin(socket_name, 'Online');
    })
    function userJoin(name, status){
            $('#'+name).removeClass("offline").addClass("online").html(status);
    }
    
    socket.on('user-disconnected', (username)=>{
            alert(username);
    })
    function userLeft(name, status){
            $('.offlineonline').removeClass("online").addClass("offline").html(status);
    } 
     
   
 })