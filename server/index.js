import 'babel-polyfill';
import fs from 'fs';
import Koa from 'koa';
import Router from 'koa-router';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';
import { spawn } from 'child_process';
import matchRequire from 'match-require';

const app = new Koa();
const router = new Router();

const port = 9001;

router
  .post('/eval', async function (cxt, next) {
    try {
      const result = await evalCode(cxt.request.body.code);
      cxt.body = result;
    } catch (e) {
      console.log(e);
      cxt.status = 400;
      cxt.body = e;
    }
  })

app
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port);

function evalCode(code) {
  return new Promise(async (resolve, reject) => {
    const deps = matchRequire.findAll(code);
    const depsInstalled = await Promise.all(deps.map(dep => checkIfDepInstalled(dep)));
    const needInstalled = deps.filter((dep, index) => !depsInstalled[index])

    await Promise.all(needInstalled.map(installDep));

    const evaluate = spawn('node', ['-e', code]);
    let all = [];
    let out = [];
    let err = [];
    evaluate.stdout.on('data', (data) => {
      all.push(data.toString());
      out.push(data.toString());
    });
    evaluate.stderr.on('data', (data) => {
      all.push(data.toString());
      err.push(data.toString());
    });
    evaluate.on('close', (code) => {
      resolve({ all, out, err, code, dependencies: deps });
    });
  })
}

async function installDep (dep) {
  return new Promise((resolve, reject) => {
    const evaluate = spawn('npm', ['install', '--no-save', dep]);
    evaluate.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    evaluate.stderr.on('data', (data) => {
      console.log(data.toString());
    });
    evaluate.on('close', (code) => {
      console.log('done installing', dep);
      resolve();
    });
  })
}

async function checkIfDepInstalled(dep) {
  return new Promise((resolve, reject) => {
    fs.access(`${__dirname}/../node_modules/${dep}/`, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}
