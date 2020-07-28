import fs from 'fs';
const path = require("path");
import colors from 'colors';
import  {Wechaty}  from 'wechaty';
import  {PuppetPadplus} from 'wechaty-puppet-padplus';
import  xueqiu from './sites/xueqiu';
import message from './bot';
import {token} from "../config";

const directoryPath = __dirname;
const pageSize = 30;
let totalPage;
const bot = new Wechaty({
    puppet: new PuppetPadplus({
      token
    }),
    name: "WeChat-Robot"
});

export function loadData(){
  const cacheFile = path.join(directoryPath, "data.tmp");
  function listPage(page){
    console.log(`get list from xueqiu, current page${page}`);
    xueqiu.list(page,pageSize).then(data=>{
      const {count, list} = data;
      if(!totalPage){
        totalPage = Math.ceil(count / pageSize); 
      }
      let str = list.map(l=>`"${l.name}":"${l.symbol}"`).join(",\n") + (page <= totalPage ? ",\n" :"}");
      fs.appendFile(cacheFile, str, ()=>{
        if(page <= totalPage){
          listPage(page+1);
        }else{
          console.log(`all pages loaded!`.green);
        }
      });
    });
  }
  
  fs.open(cacheFile, 'r', (err, fd) => {
    if(err){
      fs.writeFile(cacheFile, 'export const data ={\n', ()=>{
        // start from first page 
        console.log("get stock list from xueqiu".green);
        listPage(1);
      });
    }
    fd && fs.close(fd, (err) => {
      if (err) throw err;
    });
});
}

export default function main(){
    bot
    .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`))
    .on('login', user => console.log(`User ${user} logined`))
    .on('message', message)
    .start();
}