$(document).ready(function(){
    var groupId = 1;

    if (window.location.pathname !== "/") { //TODO: better parsing
        //join room id in pathname
    } else {
        $("#initial-selection").modal('show');
    }

    //Hook up the create-group message
    $('#create-order').click(function () {
        $('#order-id').text(groupId);
        socket.emit('New Group', groupId);
        groupId++;
    });

    $('#choice-one-vote').click(function () {
        socket.emit('New Vote', {
            user : 'hi',
            vote : 'Plain Cheese'
        });
    });

    $('#choice-two-vote').click(function () {
        socket.emit('New Vote', {
            user : '',
            vote : 'Meat Loves'
        });
    });

    $('#choice-three-vote').click(function () {
        socket.emit('New Vote', {
            user : '',
            vote : 'Veggie'
        });
    });

    $('#choice-four-vote').click(function () {
        socket.emit('New Vote', {
            user : '',
            vote : 'Hawaiian'
        });
    });

    socket.on('Group Links', function (links) {
        $('#order-id').text(links.userUrl);
    });


});