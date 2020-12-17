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
            return res.render('success');
        }

        if (req.query.status.includes('pending')){
            return res.render('pending');
        }

        if (req.query.status.includes('failure')){
            return res.render('failure');
        }
    },
    notif: (req,res)=>{
        res.status(200).end('ok');
    },
    buy: (req,res) => {
        let preference = {
            items: [
                {
                    id: '1234',
                    title: 'Product Name',
                    description: 'Dispositivo móvil de Tienda e-commerce',
                    picture_url: '',
                    unit_price: 10,
                    quantity: 1,
                    currency_id: 'ARS'
                }
            ],
            payment_methods: {
                installments: 12,
                excluded_payment_types: [
                    {id: 'atm'}
                ],
                excluded_payment_methods: [
                    {id: 'visa'}
                ]
            },
            payer: {
                name: 'Ryan',
                suname: 'Dahl',
                mail: 'test_user_63274575@testuser.com',
                phone: {
                    area_code: '11',
                    number: 55556666
                },
                adress: {
                    zip_code: '1234',
                    street_name: 'Monroe',
                    street_number: 860
                }
            },
            external_reference: 'margaritahazana@gmail.com',
            back_urls: {
                success: 'http://localhost:3000/callback?status=success',
                pending: 'http://localhost:3000/callback?status=pending',
                failure: 'http://localhost:3000/callback?status=failure'
            },
            auto_return: 'approved',
            notification_url: 
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