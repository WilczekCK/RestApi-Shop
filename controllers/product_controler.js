var mysql = require('./mysql_controler');
var _ = require('underscore');
var product_controler = product_controler || {}
product_controler = {
    showAll: async () => await mysql.show('products', '*'),
    showDetails: async (condition) => await mysql.showCertain('products', '*', `url_name = "${condition}"`),
    addProduct: ({ name, weight, price, photo, category, nutritional_table, vat_percentage, url_name }) => {
        if (!name || !weight || !price || !photo || !category ||
            !nutritional_table || !vat_percentage || !url_name) {
            return { status: 400, message: 'One of the fields are missing!' };
        } else {
            mysql.insert('products',
                'name, weight, price, photo, category, nutritional_table, vat_percentage, url_name',
                `'${name}','${weight}','${price}','${photo}','${category}','${nutritional_table}','${vat_percentage}','${url_name}'`);
            return { status: 200, message: 'You successfully added new item named ' + name };
        }
    },
    removeProduct: async ({ id }) => {
        if (id) {
            const isRemoved = await mysql.delete('products', id);
            //isRemoved gives response, if yes = true, no = false

            if (isRemoved) return { status: 200, message: 'You successfully removed product id ' + id };
            else return { status: 400, message: 'There is no item with that ID' };
        } else {
            return { status: 400, message: 'One of the fields are missing!' };
        }
    },
    changeDetails: async ({ rowsToChange, condition }) => {
        if (!rowsToChange || !condition) {
            return { status: 400, message: 'One of the fields are missing!' };
        } else {
            await mysql.update('products', `${rowsToChange}`, `${condition}`)
            return { status: 200, message: 'You successfully updated the product!' };
        }
    },
    showDetailsId: async (condition) => await mysql.showCertain('products', '*', `id = ${condition}`),
    transformOrder: async ( { productArray } ) => {
        if(!productArray) 
            return { status: 400, message: 'One of the fields are missing!' };
        else{
            let returned = await Promise.all( await productArray.map( async (product) => {
                let details = await product_controler.showDetailsId( product.product_id );
                return {
                    ...product,
                    name: details[0].name,
                    weight: details[0].weight,
                    price: details[0].price,
                    photo: details[0].photo,
                }
            }) )
            return { status: 200, productArray: returned }
        }
    }
}


module.exports = product_controler || 'Product Controler Problem!';