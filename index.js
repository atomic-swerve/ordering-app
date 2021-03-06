//!todo: Handle correct group broadcasting, close window on joining new group, pictures, any other functionality we want

var url = require('url');
var express = require('express');
var group = require('./lib/group');
var config = require('./config')

// Setup basic express server
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var userRoutes = {};
var adminRoutes = {};

var groupId = 1;
var groups = {};
var currentOrders = {};

io.on('connection', function (socket) {
    socket.on('New Group', function () {
        //Worth noting this will mess up if two groups are present with the same name.
        var newGroup = group.createGroup(groupId);
        groups[groupId] = newGroup;
        newGroup.addUser(socket.id);

        /*
        userRoutes[newGroup.userUrl] = '^\\/' + newGroup.userUrl + '\\/(\\d+)$';
        //Admins should also have all user functionality
        userRoutes[newGroup.adminUrl] = '^\\/' + newGroup.adminUrl + '\\/(\\d+)$';
        adminRoutes[newGroup.adminUrl] = '^\\/' + newGroup.userUrl + '\\/(\\d+)$';*/

        socket.emit('Group Id', groupId);

        groupId++;
    });

    socket.on('Join Group', function (groupId) {
        if (groups[groupId]) {
            groups[groupId].addUser(socket.id);
            socket.emit('Group Id', groupId);
            socket.emit('Current Order', groups[groupId].getCurrentOrder());
        }
    });

    /*
    //!todo: Determine if we need this event anymore
    socket.on('User Voting', function (user) {
        if (currentOrder.locked) {
            socket.emit('Lock Order', {
                'lockOrder': true
            });
        } else {
            currentGroup.userVoting(user);
            socket.emit('Current Order', currentGroup.getCurrentOrder());
        }
    });*/

    socket.on('New Vote', function (newVote) {
        var voteGroup = groups[newVote.groupId];

        voteGroup.acceptNewVote(newVote);

        //Figure this out
        /*for (var member in voteGroup.members) {
            socket.emit();
            io.sockets.socket(member).emit('Current Order', groups[newVote.groupId].getCurrentOrder());
        }*/
        socket.emit('Current Order', groups[newVote.groupId].getCurrentOrder());
    });
});