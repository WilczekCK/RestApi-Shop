var mail_content = {

    account: (name) => {
        
        const content = `
        <table border="1" width="100%">
            <tr>
                <td align="center">
                    <img src="cid:logo" alt="z-dowozem.com" width="200" height="200" style="display: block;" />
                </td>
            </tr>
            <tr>
                <td style="padding: 20px 10px 20px 10px; text-align: center; font-family: Arial, sans-serif;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="font-size: 24px;">
                                <b>Witaj ${name}!</b>
                            </td>
                        </tr>
                        <tr>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 20px 20px 20px;">
                                Dziękujemy za założenie konta w naszym serwisie<br />
                                <br />
                                Skorzystaj z dwóch darmowych dostaw, 
                                aby przekonać się jak wygodne mogą być codzienne zakupy, gdy robisz je prosto ze swojego domu.<br />
                                <br />
                                Zacznij już teraz na <a style="color: green" href="z-dowozem.com">z-dowozem.com</a> !<br />
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="black" style="color: white; padding: 10px 10px 10px 10px">
                                Miłego dnia, oraz udanych zakupów.<br />
                                Zespół Z-dowozem
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>`
        return content;

    },

    account_plain: (name) => {
        const content = `
        Witaj ${name}!\n
        Dziękujemy za założenie konta w naszym serwisie.\n
        Skorzystaj z dwóch darmowych dostaw, aby przekonać się jak wygodne mogą być codzienne zakupy,\n
         gdy robisz je prosto ze swojego domu.\n
        Zacznij już teraz na z-dowozem.com !
        `
    },

    order: (products, name) => {
        const productsTransformed = products.map( ( product ) => {
            return` 
            <tr>
                <td style="text-align: left; padding-left: 10px">${product.productName}</td>
                <td>${product.price.toFixed(2) }zł</td>
                <td>${product.amount}</td>
                <td>${(product.price * product.amount * 100 / 100).toFixed(2) }zł</td>
            </tr>`;
        })
        let deliveryPrice = 16.90;
        let sumPrice = 0 + deliveryPrice;
        deliveryPrice = (16.90 * 100 / 100).toFixed(2)
        products.forEach( ( item ) => {
            sumPrice += item.price * item.amount;
            console.log([item.price,item.amount,sumPrice]);
            
        } )
        const content = `
        <table border="1" width="100%">
            <tr>
                <td align="center" style="">
                    <img src="cid:logo" alt="z-dowozem.com" width="200" height="200" style="display: block;" />
                </td>
            </tr>
            <tr>
                <td style="padding: 20px 10px 20px 10px; text-align: center; font-family: Arial, sans-serif;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="font-size: 24px;">
                                <b>Witaj ${name}!</b>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 20px 20px 20px;">
                                Pomyślnie złożyłeś zamówienie w sklepie z-dowozem.com.<br />
                                <br />
                                System PayU poinformuje cię w osobnej wiadomości, o statusie płatności.<br />
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 10px 10px 10px;">
                                Zamówione produkty:
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 20px 20px 20px;">
                                <table border="1" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <th>Produkt</th>
                                        <th>Cena</th> 
                                        <th>Ilość</th>
                                        <th>Suma</th>
                                    </tr>
                                    ${productsTransformed.join('')}
                                    <tr>
                                    <td style="text-align: left; padding-left: 10px">Przesyłka</td>
                                        <td>${deliveryPrice}zł</td>
                                        <td>1</td>
                                        <td>${deliveryPrice}zł</td>
                                    </tr>
                                    <tr>
                                        <th style="text-align: left; padding-left: 10px">Suma</th>
                                        <th></th> 
                                        <th></th>
                                        <th>${(sumPrice * 100 / 100).toFixed(2)} zł</th>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 20px 20px 20px;">
                                <span style="color: green">Zakupy powinny znaleźć się u Ciebie do 2h od momentu złożenia zamówienia.</span><br />
                            </td>
                        </tr>

                        <tr>
                            <td bgcolor="black" style="color: white; padding: 10px 10px 10px 10px">
                                Miłego dnia, oraz udanych zakupów.<br />
                                Zespół z-dowozem.com
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>  
        `
        return content;
    },
    
    order_plain: (products, name) => {
        let deliveryPrice = (16.90 * 100 / 100).toFixed(2);
        let sumPrice = 0 + deliveryPrice;
        products.forEach( ( item ) => {
            sumPrice += item.price * item.amount;
            console.log([item.price,item.amount,sumPrice]);
            
        } )

        const productsTransformed = products.map( ( product ) => {
            return` 
                ${product.productName} - ${product.amount} x ${product.price} = ${Math.round( (product.price * product.amount) * 100 / 100).toFixed(2)} zł \n`;
        })
        const content = `
        Witaj ${name}! \n
        Pomyślnie złożyłeś zamówienie w sklepie z-dowozem.com. \n
        System PayU poinformuje cię w osobnej wiadomości, o statusie płatności. \n\n
        Zamówione produkty:\n\n
        ${productsTransformed}\n
        Przesyłka - 1 x 16.90 zł \n

        Suma: ${sumPrice} zł \n
        Zakupy powinny znaleźć się u Ciebie do 2h od momentu złożenia zamówienia.\n
        Miłego dnia, oraz udanych zakupów.\n
        Zespół z-dowozem.com\n`;
        return content;
    }
}

module.exports = mail_content || 'Mail Content Problem!';