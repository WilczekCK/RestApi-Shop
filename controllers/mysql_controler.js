var mysql = require('mysql');
var _ = require('underscore');

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
        return await mysql_controler.query(`SELECT ${condition} FROM ${table}`);
    },
    insert: (table, rowNames, rowsInfo) => {
        console.log(`INSERT INTO ${table} (${rowNames}) VALUES (${rowsInfo})`)
        mysql_controler.query(`INSERT INTO ${table} (${rowNames}) VALUES (${rowsInfo})`);
    },
    update: async (table, changingRows, condition) => {
        //changingrows = {row = newValue, row2 = newValue2}
        if(_.isEmpty(await mysql_controler.showCertain(`${table}`, `*`, `${condition}`))) return false;
        else await mysql_controler.query(`UPDATE ${table} SET ${changingRows} WHERE ${condition}`);
        
        return true;
    },
    delete: async (table, condition) => {
        if(_.isEmpty(await mysql_controler.showCertain(`${table}`, `*`, `id = ${condition}`))) return false;
        else await mysql_controler.query(`DELETE FROM ${table} WHERE id = ${condition}`);

        return true;
    },
    showCertain: async (table, condition, rules) => {
        return await mysql_controler.query(`SELECT ${condition} FROM ${table} WHERE ${rules}`);
    }
}


module.exports = mysql_controler || 'MySQL Controler Problem!';