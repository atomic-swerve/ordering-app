$(document).ready(function(){
    if (window.location.pathname !== "/") { //TODO: better parsing
        //join room id in pathname
    } else {
        $("#initial-selection").modal('show');
    }

    //Hook up the create-group message
    $('#create-order').click(function () {
        socket.emit('New Group');
    });
});