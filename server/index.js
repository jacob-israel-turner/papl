import Koa from 'koa';
import Router from 'koa-router';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();

const port = 9001;

router
  .post('/eval', function (cxt, next) {
    try {
      const result = eval(cxt.request.body.code);
      cxt.body = result;
    } catch (e) {
      cxt.status = 400;
      cxt.body = e;
    }
    cxt.body = 'doneee';
  })

app
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port);


