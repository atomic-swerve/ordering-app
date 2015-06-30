$(document).ready(function(){
    var socket = new io.Socket();
    socket.connect('http://localhost:3000');

    if (window.location.pathname !== "/") { //TODO: better parsing
        //join room id in pathname
    } else {
        $("#initial-selection").modal('show');
    }

    //Hook up the create-group message
    $('#create-order').click(function () {
        socket.emit('New Group');
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