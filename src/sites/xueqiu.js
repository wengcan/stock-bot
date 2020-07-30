import axiosInstance from '../request';
const defaltHeaders = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Host': 'stock.xueqiu.com',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36};'
}
class Xueqiu{
    cookies = 'device_id=24700f9f1986800ab4fcc880530dd0ef;';
    constructor(){
        axiosInstance.get(`https://xueqiu.com/`).then(response => {
            const cookiesHeader = response.headers['set-cookie'];
            this.cookies += cookiesHeader.map(h=>{
                let content = h.split(";")[0];
                return content.endsWith("=")?"": content;
            }).filter(h=>h!="").join(";") + ";";
        });
    }
    get headers(){
        return {
            ...defaltHeaders,
            Cookie: this.cookies
        }
    }
    request(url, withHeaders = true){
        return axiosInstance.get(url, withHeaders?{
            headers: this.headers
        }:{})       
        .then(response =>response.data)
        .catch(err=>{
            console.log(err);
        });
    }
    quote(symbol){
        // `https://stock.xueqiu.com/v5/stock/quote.json?symbol=${symbol}&extend=detail`;
        const url = `https://stock.xueqiu.com/v5/stock/batch/quote.json?symbol=${symbol}&_=${+ new Date()}`;
        return this.request(url);
    }
    batchQuoteResp(items){
        return items.map(({quote})=>{
            const {open, last_close, current, name, percent}= quote;
            return `${percent>=0?'🔴' : '🟢'} ${name}  \n今开: ${open}\n昨收: ${last_close}\n现价: ${current}\n涨幅: ${percent}% `;
        }).join("\n\n");
    }
    list(page,size){
        const url = `https://xueqiu.com/service/v5/stock/screener/quote/list?page=${page}&size=${size}&order=desc&orderby=percent&order_by=percent&market=CN&type=sh_sz&_=${+ new Date()}`;
        return this.request(url, false).then(res=>res.data).then(data=>{
            return data;
        })
    }
}

export default new Xueqiu();