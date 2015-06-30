$(function(){
    //var socket = io();

    if (window.location.pathname !== "/") { //TODO: better parsing
        //join room id in pathname
    } else {
        $("#initial-selection").modal('show');
    }

    //Hook up the create-group message
    $('#create-order').click(function () {
        socket.emit('New Group');
    });

    $('#join-order').click(function () {
        socket.emit('Join Group', $('#join-order-number').val());
    });

    socket.on('Group Id', function (groupId) {
        $('#order-id').text(groupId);
        socket.groupId = groupId;
    });

    $('#choice-one-vote').click(function () {
        socket.emit('New Vote', {
            //!todo: do we have a way to determine this?
            user : socket.id,
            groupId : socket.groupId,
            pizza : 'Plain Cheese'
        });
    });

    $('#choice-two-vote').click(function () {
        socket.emit('New Vote', {
            user : socket.id,
            groupId : socket.groupId,
            pizza : 'Meat Lovers'
        });
    });

    $('#choice-three-vote').click(function () {
        socket.emit('New Vote', {
            user : socket.id,
            groupId : socket.groupId,
            pizza : 'Veggie'
        });
    });

    $('#choice-four-vote').click(function () {
        socket.emit('New Vote', {
            user : socket.id,
            groupId : socket.groupId,
            pizza : 'Hawaiian'
        });
    });

    socket.on('Current Order', function (currentOrder) {
        var choiceOneVotes = 0;
        var choiceTwoVotes = 0;
        var choiceThreeVotes = 0;
        var choiceFourVotes = 0;

        for (var choice in currentOrder.votes) {
            if (choice !== 'noVotes' && choice !== 'voting') {
                switch (choice) {
                    case 'Plain Cheese': choiceOneVotes += currentOrder.votes[choice].length; break;
                    case 'Meat Lovers': choiceTwoVotes += currentOrder.votes[choice].length; break;
                    case 'Veggie': choiceThreeVotes += currentOrder.votes[choice].length; break;
                    case 'Hawaiian': choiceFourVotes += currentOrder.votes[choice].length; break;
                }
            }
        }

        $('#choice-one-count').text(choiceOneVotes);
        $('#choice-two-count').text(choiceTwoVotes);
        $('#choice-three-count').text(choiceThreeVotes);
        $('#choice-four-count').text(choiceFourVotes);
    });
});