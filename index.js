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

var groups = {};
var currentOrders = {};

io.on('connection', function (rootSocket) {
    rootSocket.on('New Group', function (name) {
        //Worth noting this will mess up if two groups are present with the same name.
        var newGroup = group.createGroup(name);
        groups[name] = newGroup;

        userRoutes[name] = '^\\/' + newGroup.userUrl + '\\/(\\d+)$';
        //Admins should also have all user functionality
        userRoutes[newGroup.adminUrl] = '^\\/' + newGroup.adminUrl + '\\/(\\d+)$';
        adminRoutes[newGroup.adminUrl] = '^\\/' + newGroup.userUrl + '\\/(\\d+)$';

        rootSocket.emit('Group Links', {
            userUrl:    config.hostUrl + newGroup.userUrl,
            adminUrl:   config.hostUrl + newGroup.adminUrl
        });
    });

    var ns = url.parse(rootSocket.handshake.url, true).query.ns;

    for (var userKey in userRoutes) {
        var userRouteName = userKey;
        var userRouteRegexp = new RegExp(userRoutes[userKey]);

        //!todo: deal with admin string in url
        var currentGroup = groups[userKey];

        if (ns.match(userRouteRegexp)) {
            io.of(ns).on('connection', function (socket) {
               socket.on('New User', function (name) {
                   socket.userName = name;
                   currentGroup.addUser(name);

                   socket.emit('Current Order', currentGroup.getCurrentOrder());
               });

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
                });

                socket.on('New Vote', function (newVote) {
                    if (currentOrder.locked) {
                        socket.emit('Lock Order', {
                            'lockOrder': true
                        });
                    } else {
                        socket.emit('Current Order', currentGroup.getCurrentOrder());
                        currentGroup.acceptNewVote(newVote);
                    }
                });

                socket.on('disconnect', function () {
                    currentGroup.userLeft(socket.username);

                    socket.emit('Current Order', currentGroup.getCurrentOrder());
                });
            });
        }
    }

    for (var adminKey in adminRoutes) {
        var adminName = adminKey;
        var adminRouteRegexp = new Regexp(adminRoutes[adminKey]);

        if (ns.match(adminRouteRegexp)) {
            io.of(ns).on('connection', function (socket) {
                //!todo: deal with admin string in url
                var currentGroup = groups[adminKey];

                socket.on('Order Finalized', function () {
                    currentGroup.lockOrder();
                });

                socket.on('Edit Order', function (newOrder) {
                   if (currentGroup.locked) {
                       socket.emit('Lock Order', {
                           'lockOrder': true
                       });
                   } else {
                       currentGroup.editOrder(newOrder);
                       socket.emit('currentOrder', currentGroup.getCurrentOrder);
                   }
                });
            });
        }
    }
});