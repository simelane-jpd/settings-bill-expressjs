const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const SettingsBill = require('./Settings-bill');

const app = express();
const settingsBill = SettingsBill();

var hbs = exphbs.create({
    layoutsDir : './views/layouts',
    helpers: {
        getColor: function () {
            if (settingsBill.hasReachedWarningLevel()) {
                return 'warning';
            } else if (settingsBill.hasReachedCriticalLevel()) {
                return 'danger';
            }
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static('public'));



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())




app.get('/', function (req, res) {
    res.render('index', {
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals()
    });

});

app.post('/settings', function (req, res) {
    console.log(req.body);
    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel

    });

    res.redirect('/');

});

app.post('/action', function (req, res) {

    settingsBill.recordAction(req.body.actionType)
    res.redirect('/');

});



app.get('/actions', function (req, res) {
    res.render('actions', { actions: settingsBill.actions() });

});

app.get('/actions/:actionType', function (req, res) {
    const actionType = req.params.actionType;
    res.render('actions', { actions: settingsBill.actionsFor(actionType) });

});



const PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log("App started at port:", PORT)
});