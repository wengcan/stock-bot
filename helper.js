import fs from 'fs';
import path from "path";
import colors from 'colors';
import  xueqiu from './src/sites/xueqiu';

const args = process.argv.slice(2);
const directoryPath = __dirname;
const pageSize = 30;
let totalPage = 0;
function loadData(){
    const cacheFile = path.join(directoryPath, "../","src", "data", "index.js");
    const goNext = page => {
      if(page <= totalPage){
        listPage(page+1);
      }else{
        console.log(`all pages loaded!`.green);
      }
    }

    function listPage(page){
      console.log(`get list from xueqiu, current page ${page}`);
      xueqiu.list(page,pageSize).then(data=>{
        const {count, list} = data;
        if(!totalPage){
          totalPage = Math.ceil(count / pageSize); 
        }
        let listArr = [];
        list.forEach(item=>{
          if(item.symbol.indexOf('SH1') !== 0 && item.symbol.indexOf('SZ2') !== 0){
            let symbol = item.symbol.replace(/[SHZ]+/,"");
            listArr.push(`"${item.name}":"${symbol}"`);
          }
        });
        if(listArr.length >0){
          let str =  listArr.join(",\n") + (page < totalPage ? ",\n" :"\n}");
          fs.appendFile(cacheFile, str, ()=>{
            goNext(page);
          });
        }else{
          goNext(page);
        }

      }).catch(e=>{
        setTimeout(()=>{
         listPage(page);
        }, 5000);
      });
    }
    
    fs.open(cacheFile, 'r', (err, fd) => {
      //if(err){}
      fs.writeFile(cacheFile, 'export const data ={\n', ()=>{
        // start from first page 
        console.log("get stock list from xueqiu".green);
        listPage(1);
      }); 
      fd && fs.close(fd, (err) => {
        if (err) throw err;
      });
  });
}

console.log(args[0]);
switch (args[0]) {
    case 'data':
        loadData();
        break;
    default:
        console.log("noting to do".red); 
}