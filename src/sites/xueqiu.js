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
export default class Xueqiu{
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
    quote(codesStr){
        const url = `https://stock.xueqiu.com/v5/stock/quote.json?symbol=${codesStr}&extend=detail`;
        console.log(this.cookies);
        return  axiosInstance
        .get(url, {
            headers: {
                ...defaltHeaders,
                Cookie: this.cookies
            }
        })       
        .then(response => {
            console.log(response.data);
        });
    }
}