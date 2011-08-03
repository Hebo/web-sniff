Web-Sniff
=========

Web-Sniff lets you view HTTP GET requests over wifi in realtime, using node.js and websockets to present the information


Installing
----------

### OSX ###

Install mxcl's [homebrew](http://mxcl.github.com/homebrew/), then run `brew install node`

Get [npm](http://npmjs.org/) and the necessary node packages with
    curl http://npmjs.org/install.sh | sh
    npm install socket.io jade pcap

Usage
-----

To run (sudo is necessary to set adapter to promiscuous mode)
    sudo -E node server.js

Open your browser to `http://localhost:8000` to view the requests