Open311Proxy
============


First Time Node Setup
---------------------

Install Node/NPM. You may want to use a program like [nvm](https://github.com/creationix/nvm) (or nave or nodenv) to manage different versions of node.

To install Node with nvm:

`git clone git://github.com/creationix/nvm.git ~/.nvm`

Then add `. ~/.nvm/nvm.sh` to your .bashrc or .profile file so that it runs everytime you create a new terminal (this is a drawback of using nvm). Next, to install Node type:

`nvm install v0.8.8`

This may take a while to compile and install. Once complete, check that it worked by typing `node -v`

Using [Foreman](https://github.com/ddollar/foreman): for parity with Heroku (where Open311Proxy will run) this repo contains a Procfile and `.env` file for use with Foreman (which is automatically installed when you install the [Heroku Toolbelt](https://toolbelt.heroku.com/)). Then run `foreman start` to run the server as defined in the `Procfile`, or run distinct commands with `foreman run COMMAND` e.g. `foreman run node server.js` or `foreman run jasmine-node spec/test.js`.

Testing
--------

Install the jasmine-node package globally with `npm install -g jasmine-node`. Note: jasmine-node appears to be poorly maintained/abandoned.

To run tests, enter:

`jasmine-node spec --forceexit`

the `--forcexit` option is necessary because we are testing the server process which will otherwise continue running.

