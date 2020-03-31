var mysql = require('mysql');

var mysql_controler = mysql_controler || {}
mysql_controler = {
    auth: {
        host: 'localhost',
        user: 'root',
        password: 'rootpass',
        database: 'fastsell',
    },
    query: (queryInfo) => {
        return new Promise((resolve, reject) => {
            var connection = mysql.createConnection(mysql_controler.auth);
            connection.connect();
    
            connection.query(queryInfo, function (err, rows, fields) {
                if (err) throw err  
                resolve(rows);
            })
    
            connection.end()
        })
    },
    show: async (table, condition) => {
        return await mysql_controler.query('SELECT * FROM test');
    },
    insert: (table, rowNames, rowsInfo) => {
        mysql_controler.query(`INSERT INTO ${table} (${rowNames}) VALUES (${rowsInfo})`);
    },
    update: (table, changingRows, condition) => {
        //changingrows = {row = newValue, row2 = newValue2}
        mysql_controler.query(`UPDATE ${table} SET ${changingRows} WHERE ${condition}`);
    },
    delete: (table, condition) => {
        mysql_controler.query(`DELETE FROM ${table} WHERE ${condition}`);
    },
}


module.exports = mysql_controler || 'MySQL Controler Problem!';