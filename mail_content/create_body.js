var mail_content = {

    account: (name) => {
        
        const content = `
        <table border="1" width="100%">
            <tr>
                <td align="center" style="">
                    <img src="cid:logo" alt="Creating Email Magic" width="200" height="200" style="display: block;" />
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

    order: (products) => {
        const productsTransformed = products.map( ( product ) => {
            return` 
            <tr>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.amount}</td>
                <td>${ Math.round( (product.price * product.amount) * 100 / 100).toFixed(2) }</td>
            </tr>`;
        })
        const content = `
        <table border="1" width="100%">
            <tr>
                <td align="center" style="">
                    <img src="logo.png" alt="Creating Email Magic" width="200" height="200" style="display: block;" />
                </td>
            </tr>
            <tr>
                <td style="padding: 20px 10px 20px 10px; text-align: center; font-family: Arial, sans-serif;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td style="font-size: 24px;">
                                <b>Witaj Norbert!</b>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 20px 20px 20px;">
                                Pomyślnie złożyłeś zamówienie w sklepie z-dowozem.com.<br />
                                <br />
                                System PayU poinformuje cię w osobnej wiadomości, o statusie płatności.<br />
                                <br />
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 10px 10px 10px;">
                                Zamwione produkty:
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
                                    ${productsTransformed}
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 20px 20px 20px;">
                                <span style="color: green">Zakupy powinny znaleźć się u Ciebie do 2h od momentu opłacenia zamówienia.</span><br />
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
    }
}

module.exports = mail_content || 'Mail Content Problem!';