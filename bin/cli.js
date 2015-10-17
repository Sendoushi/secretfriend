#!/usr/bin/env node

// Create the cli
// Function used to get the strict for all
(function () {
    'use strict';

    return {
        moduleLog: '\u001b[1;33m[Secret friend]\u001b[0m',

        /**
         * Initializes the cli
         *
         * @return {cli}
         */
        init: function () {
            this.clearTerminal();

            // Announce the shortcuts first
            this.help();

            // Initialize secret friend
            this.secretfriend = require('../lib/secretfriend').init();

            // Get the friends list
            this.friends = process.argv.map(function (val, index, array) {
                return val.replace('node', '') === val && val.replace('cli.js', '') === val && val;
            }).filter(function (val) {
                return !!val;
            });

            // Friends are a requirement
            if (!this.friends || !this.friends.length) {
                throw new Error('Friends arguments are required');
            }

            // Listen keyboard
            this.listenKeyboard();

            return this;
        },

        /**
         * Listen for keyboard events
         */
        listenKeyboard: function () {
            // Listen for keyboard events
            // Without this, we would only get streams once enter is pressed
            process.stdin.setRawMode(true);
            process.stdin.setEncoding('utf8');

            // On any data into stdin
            process.stdin.on('data', function (key) {
                switch (key) {
                    case '\u0003':
                    case 'c':
                    case 'q':
                        this.exit();
                        break;
                    case 'r':
                        this.randomize();
                        break;
                    case 'f':
                        this.showAll();
                        break;
                    case ' ':
                        this.isHidden ? this.showSecret() : this.nextFriend();
                        break;
                    default:
                        this.help();
                }
            }.bind(this));

            // Prevent from closing
            process.stdin.resume();
        },

        /**
         * Randomizes the list again
         */
        randomize: function () {
            !this.isFirstTime && console.log('\n' + this.moduleLog + ' Randomized!');
            this.isFirstTime = false;

            // Reset vars
            this.isHidden = null;
            this.count = null;

            // Get the randomized friends
            this.randomizedFriends = this.secretfriend.randomize(this.friends);
        },

        /**
         * Shows next friend
         */
        nextFriend: function () {
            if (!this.randomizedFriends || !this.randomizedFriends.length) {
                this.randomize();
            }

            var friend;

            // Hide the last line
            if (this.count - 1 >= 0) {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);

                friend = this.randomizedFriends[this.count - 1];
                process.stdout.write(friend.name + ': *****\n');
            }

            // Show the next friend
            this.isHidden = true;

            // Check if reached the end of the list
            if (this.count === this.randomizedFriends.length) {
                this.count = null;

                process.stdout.write('\n' + this.moduleLog + ' Reached the end of the list!\n');
            }

            this.count = !this.count ? 0 : this.count;

            friend = this.randomizedFriends[this.count];
            process.stdout.write(friend.name + ': \u001b[1m*****\u001b[0m');
        },

        /**
         * Shows friend secret
         */
        showSecret: function () {
            this.isHidden = false;
            process.stdout.clearLine();
            process.stdout.cursorTo(0);

            var friend = this.randomizedFriends[this.count];
            process.stdout.write(friend.name + ': \u001b[1m' + friend.secret + '\u001b[0m');

            // Iterate the counter
            this.count += 1;
        },

        /**
         * Shows all friends
         */
        showAll: function () {
            console.log('\n' + this.moduleLog + ' \u001b[32mShow all friends\u001b[0m\n');
            console.log('       ' + this.friends.join(', ') + '\n');
        },

        /**
         * Shows help
         */
        help: function () {
            console.log('');
            console.log('\n' + this.moduleLog + ' \u001b[32m Help\u001b[0m\n');

            // TODO: Improve interface
            console.log('       \u001b[1mH\u001b[0m       Show help');
            console.log('       \u001b[1mF\u001b[0m       Show all friends');
            console.log('       \u001b[1mR\u001b[0m       Randomize again');
            console.log('       \u001b[1mSpace\u001b[0m   Show next friend');
            console.log('       \u001b[1mQ\u001b[0m       Quit\n');
        },

        /**
         * Clears terminal
         */
        clearTerminal: function () {
            var lines = process.stdout.getWindowSize()[1];
            for (var i = 0; i < lines; i += 1) {
                console.log('\r\n');
            }
        },

        /**
         * Exit cli
         */
        exit: function () {
            process.exit();
        }
    }.init();
})();
