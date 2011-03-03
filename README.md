Web-Sniff
=========

Installing
----------

### OSX ###

Install mxcl's [homebrew](http://mxcl.github.com/homebrew/), then run
    brew install node

Get [npm](http://npmjs.org/) and the necessary node packages with
    curl http://npmjs.org/install.sh | sh
    npm install express socket.io jade pcap

Usage
-----

To run (sudo is necessary to set adapter to promiscuous mode)
    sudo -E node server.js