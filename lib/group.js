var config = require('../config');

var $ = {};

$.createGroup = function (name) {
    var group = {
        userUrl : config.hostUrl + name,
        adminUrl : config.hostUrl + name + '&admin',
        members : [],
        currentVotes : {
            noVote : [],
            voting : []
        },
        currentOrder : {

        },
        locked : false
    };

    var removeExistingVote = function (user) {
        for (var choice in group.currentVotes) {
            var usersCurrentVote = group.currentVotes[choice].indexOf(user);

            if (usersCurrentVote > -1) {
                group.currentVotes[choice].splice(usersCurrentVote, 1);
            }
        }
    };

    var calculateOrder = function () {
        group.currentOrder = {};
        var votes = group.currentVotes;

        for (var pizza in votes) {
            var voteCount = votes[pizza].length;

            if (pizza != 'noVote' && pizza != 'voting' && voteCount > 0) {
                var currentPizza = group.currentOrder.pizza = {
                    small : 0,
                    medium : 0,
                    large : 0
                };

                while (voteCount > 0) {
                    if (voteCount >= 5) {
                        currentPizza[large] += 1;
                        voteCount -= 5;
                    } else if (voteCount >= 4) {
                        currentPizza[medium] += 1;
                        voteCount -= 4;
                    } else {
                        currentPizza[small] += 1;
                        voteCount = 0;
                    }
                }
            }
        }
    };

    group.addUser = function (name) {
        group.members.push(name);
        group.currentVotes[noVote].push(name);
    };

    group.userVoting = function (user) {
        removeExistingVote(user);

        group.currentVotes[voting].push(user);
    };

    group.getCurrentOrder = function () {
        calculateOrder();

        return {
            votes : group.currentVotes,
            order : group.currentOrder
        };
    };

    group.acceptNewVote = function (vote) {
        removeExistingVote(vote.user);

        if (!group.currentVotes[vote.pizza]) {
            group.currentVotes[vote.pizza] = [];
        }

        group.currentVotes[vote.pizza].push(vote.user);

        calculateOrder();
    };

    group.userLeft = function (user) {
        //!todo: Should we recalculate the order here? Since users are only tracked by votes, a user disconnecting
        //now means removing them from the vote
        removeExistingVote(user);
        calculateOrder();
    };

    group.lockOrder = function () {
        group.locked = true;
    };

    group.editOrder = function (newOrder) {
        //!todo: If a user changes a vote, the edited order will be overwritten. Do we wish to lock an order once it's
        //been edited? Should editing be possible on a locked order?
        group.currentOrder = newOrder;
    };

    return group;
};

module.exports = $;