import CacheData from './cache';
import {parseMsg} from './utils';
import  xueqiu from './sites/xueqiu';
import {activeRooms} from "../config";
const roomCacheData = new CacheData();

let roomKeys = [];


export default async function message(message) {
    let room = message.room();
    let from = message.from();
    let text = message.text(); 
    if (room) {
        const topic = await room.topic();
        if (activeRooms.indexOf(topic) >= 0) {
            const roomKey = `_ROOM_${room.id}`;
            if(!roomCacheData.get(roomKey)){
                roomKeys.push(roomKey);
                roomCacheData.add(roomKey, room);
            }
            const [names, codes] =  parseMsg(text, true);
            if(codes.length > 0){
                xueqiu
                    .quote(codes.join(","))
                    .then(({data})=>{
                        const {items} = data;
                        const msg = xueqiu.batchQuoteResp(items);
                        room.say(msg);
                    });
            }

        }
        console.log(`Message: ${room}, ${from.name()}, ${text}`)
    }
}