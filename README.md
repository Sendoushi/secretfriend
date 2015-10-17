# Secret friend
I grew tired of taking little papers from hats.

![Screenshot](/screen.png)

### Installation
```bash
npm install --save git+ssh://git@github.com:Sendoushi/secretfriend.git # for node
npm install -g git+ssh://git@github.com:Sendoushi/secretfriend.git # for cli
```

### Usage
In node:
```js
var secretfriend = require('secretfriend');

// These are the default configs
secretfriend.init();

// Get the array with all friends already randomized
secretfriend.randomize(friends:Array<String>*);

// *: These arguments are obligatory
```

Or in the cli:
```bash
# Will accept multiple friends strings but at least one is obligatory
secretfriend 'john' 'doe' 'joe' # more help will be provided
```
