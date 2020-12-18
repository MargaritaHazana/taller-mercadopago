const mercadopago = require('mercadopago');
const { response } = require('express');

mercadopago.configure({
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
})

module.exports = {
    home: (req, res) => {
        return res.render("index");
    },
    detail: (req, res) => {
        return res.render("detail", { ...req.query });
    },
    callback: (req,res)=>{
        console.log(req.query);
        if (req.query.status.includes('success')){
            return res.render('success', {
                payment_type: req.query.payment_type,
                external_reference: req.query.external_reference,
                collection_id: req.query.collection_id
            });
        }

        if (req.query.status.includes('pending')){
            return res.render('pending');
        }

        if (req.query.status.includes('failure')){
            return res.render('failure');
        }
    },
    notif: (req,res)=>{
        console.log('webhook',req.body);
        res.status(200).end('ok');
    },
    buy: (req,res) => {
        let preference = {
            items: [
                {
                    id: '1234',
                    title: 'Product Name',
                    description: 'Dispositivo móvil de Tienda e-commerce',
                    picture_url: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.muycomputerpro.com%2Fwp-content%2Fuploads%2F2014%2F01%2Faplicaciones-moviles.jpg&imgrefurl=https%3A%2F%2Fwww.muycomputerpro.com%2F2014%2F01%2F15%2Fingresos-dispositivos-moviles&tbnid=o9Z-bSNtW22kuM&vet=12ahUKEwi3_OmoodbtAhXlB9QKHb0HA0YQMygAegUIARCrAQ..i&docid=U0zlClllyNsm-M&w=630&h=473&q=dispositivo%20movil&ved=2ahUKEwi3_OmoodbtAhXlB9QKHb0HA0YQMygAegUIARCrAQ',
                    unit_price: 10,
                    quantity: 1
                }
            ],
            payment_methods: {
                installments: 6,
                excluded_payment_types: [
                    {id: 'atm'}
                ],
                excluded_payment_methods: [
                    {id: 'amex'}
                ]
            },
            payer: {
                name: 'Lalo',
                suname: 'Landa',
                mail: 'test_user_63274575@testuser.com',
                phone: {
                    area_code: '11',
                    number: 22223333
                },
                address: {
                    zip_code: '1111',
                    street_name: 'False',
                    street_number: 123
                }
            },
            external_reference: 'margaritahazana@gmail.com',
            back_urls: {
                success: 'https://mercadopago-taller.herokuapp.com/callback?status=success',
                pending: 'https://mercadopago-taller.herokuapp.com/callback?status=pending',
                failure: 'https://mercadopago-taller.herokuapp.com/callback?status=failure'
            },
            auto_return: 'approved',
            notification_url: 'https://mercadopago-taller.herokuapp.com/notif'
        }
        mercadopago.preferences.create(preference)
            .then(response =>{
                global.init_point = response.body.init_point;
                res.render('confirm');
            })
            .catch(error => {
                console.log(error);
                res.send('error');
            })
    }
}