

import  {Wechaty}  from 'wechaty';
import  {PuppetPadplus} from 'wechaty-puppet-padplus';
import message from './bot';
import {token} from "../config";
import onScan from './onScan'

const bot = new Wechaty({
    puppet: new PuppetPadplus({
      token
    }),
    name: "WeChat-Robot"
});


export default function main(){
    bot
    // .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`))
    .on('scan', onScan)
    .on('login', user => console.log(`User ${user} logined`))
    .on('message', message)
    .start();
}