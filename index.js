var newrelic  = require('newrelic'),
    koa       = require('koa'),
    compress  = require('koa-compress'),
    jade      = require('koa-jade'),
    route     = require('koa-route'),
    koaBody   = require('koa-better-body'),
    statics   = require('koa-static')(__dirname + '/public'),
    globals   = require('./globals'),
    logger    = require('./lib/logger'),
    app       = koa();

app.use(compress());
app.use(koaBody({
    formLimit: (15 * 10e7),
    jsonLimit: (15 * 10e7)
}));
app.use(statics);

app.use(jade.middleware({
  viewPath: __dirname + '/views',
  debug: false,
  pretty: false,
  compileDebug: false
}));

// logger
app.use(function *(next){
    var start = new Date;
    yield next;
    var ms = new Date - start;
    logger.info('%s %s - %sms', this.method, this.url, ms);
    console.log('%s %s - %sms', this.method, this.url, ms);
});

app.use(route.get('/', function* () {
    yield this.render('index', {
        title: 'Boxer',
        globals: globals
    });
}));

app.listen(process.env.PORT || process.env.NODE_PORT || 3001);
