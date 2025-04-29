var express = require('express');
var path = require('path');
const indexRouter = require('./routes/index-router')
const contactsRouter = require('./routes/contacts-router.js')
const adminRouter = require('./routes/admin-router.js')
const paymentRouter = require('./routes/payment-router.js')
const app = express();
const db = require('./db/db.js');
app.set('port',3000);
db();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs')

app.use('/',indexRouter);
app.use('/contact',contactsRouter);
app.use('/admin',adminRouter);
app.use('/payment',paymentRouter);


app.listen(app.get('port'),()=>{
    console.log("El Servidor corre en el puerto:", app.get('port'));
    
})