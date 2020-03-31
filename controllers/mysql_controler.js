var mysql = require('mysql');

var mysql_controler = mysql_controler || {}
mysql_controler = {
    auth: {
        host: 'localhost',
        user: 'root',
        password: 'rootpass',
        database: 'fastsell',
    },
    query: () => {
        var connection = mysql.createConnection(mysql_controler.auth);
        connection.connect();

        connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
            if (err) throw err  
            console.log('The solution is: ', rows[0].solution)
        })

        connection.end()
    },
    insert: (table, rowNames, rowsInfo) => {},
    update: (table, changingRows, replacedRows) => {},
    delete: (table, condition) => {},
}


module.exports = mysql_controler || 'MySQL Controler Problem!';