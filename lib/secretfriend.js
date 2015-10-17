// Export secretfriend
// Used this way to support different envs
return (function () {
    'use strict';

    var secretfriend = {
        /**
         * Initialize secretfriend
         *
         * @return {secretfriend}
         */
        init: function () {
            return this;
        },

        /**
         * Randomizes friends
         *
         * @return {Array}
         */
        randomize: function (friends) {
            if (!friends || !friends.length) {
                throw new Error('Friends array has to be provided.');
            }

            // Copy friends to a new array of available friends
            var available = friends.map(function (val) { return val; });
            var randomized = [];
            var secretFriends;
            var chosenFriend;
            var friend;
            var i;

            // Iterate each friend
            for (i = 0; i < friends.length; i += 1) {
                friend = friends[i];

                // Make a new array without the friend from available friends
                secretFriends = available.filter(function (val) {
                    return val !== friend;
                });

                // Get a random friend from available friends
                chosenFriend = secretFriends.length === 1 ? 0 : Math.floor(Math.random() * secretFriends.length);
                chosenFriend = secretFriends[chosenFriend];
                randomized.push({
                    name: friend,
                    secret: chosenFriend
                });

                // Remove the chosen friend from the available list
                available.splice(available.indexOf(chosenFriend), 1);
            }

            // Check if all went right
            for (i = 0; i < randomized.length; i += 1) {
                // The friend took is own name, need to randomize again
                if (!randomized[i].secret) {
                    return this.randomize(friends);
                }
            }

            // All went well, announce the randomized friends
            return randomized;
        }
    };

    // Set the amd support
    if (typeof module === 'object') {
        module.exports = secretfriend;
    } else {
        return secretfriend;
    }
})();
