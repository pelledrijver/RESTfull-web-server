Running the server
------------------

You can start the server on a command line (Terminal, Powershell) by executing:

```
$ node server.js
```

The server automatically creates an SQLite database table 'phones' in the file `phones.db`, with one example entry for testing purposes.
This file is re-created whenever you delete it, and restart the server.

The html page uses the API (with AJAX) to execute SQL queries on db object and retrieve results. After receiving the JSON message in the response, the html table updates automatically to match with the current database.

The full documentation can be found in the documentation.html file.
