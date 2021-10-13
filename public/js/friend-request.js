
$(document).ready(function(){
    var socket = io.connect('http://localhost:3000');
    var username = $('.user').html();
    socket.emit('New-user-joined', username);
    $('.accept').click(function(){
        var dataId = $(this).attr('id');
        var dataname = $(this).attr('data-name');
        var dataimage = $(this).attr('data-img');
        var id = $(this).attr('data-id');
        var rejectid="reject-"+id;
        var data = {};
            data.id = id;
            data.dataname= dataname;
            data.dataimage= dataimage;
        $.ajax({
          method: "POST",
            data: JSON.stringify(data),
                contentType: 'application/json',
          url:'http://localhost:3000/acceptFriend',		
          success: function(data){
          if(data==1){
            socket.emit('acceptFriend', {sender:dataname, reciever:username});
            $('#'+dataId).hide();
            $('#'+rejectid).hide();
            $('#'+id).show().html('Accepted');
            // $('#'+id).css('background-color' , 'cyan');
            //$('#'+id).css('color' , 'red');
          }else{
            alert("fail");
          }
          }
        })
        });
    
     $('.reject').click(function(){
        var dataId = $(this).attr('id');
        var dataname = $(this).attr('data-name');
        var id = $(this).attr('data-id');
        var acceptid="accept-"+id;
        var data = {};
            data.id = id;
        data.dataname = dataname;
        $.ajax({
          method: "POST",
            data: JSON.stringify(data),
                contentType: 'application/json',
          url:'http://localhost:3000/rejectFriend',		
          success: function(data){
          if(data==1){
            $('#'+dataId).hide();
            $('#'+acceptid).hide();
            $('#'+id).show().html('Rejected');
             
          }else{
            alert("fail");
          }
          }
        })
        });
        function showAcceptNotification(name){
          $('.notify').addClass('active-notify');
        }
        socket.on('accept-notification', (data)=>{
            showAcceptNotification(data.sender);
        })
      
})