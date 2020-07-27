const puppeteer = require("puppeteer");
const path = require('path')
const fs = require('fs')

const start = async () => {
  let users = []
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const qtdPages = 6
  for (let i = 1; i <= qtdPages; i++) {
    console.log(`🧠 Criando Arquivo:  ${'▉'.repeat(i)}${'▒'.repeat(qtdPages - i)} ${(i / qtdPages).toFixed(2) * 100} %`)
    await page.goto(`https://github.com/danrigoni?page=${i}&tab=following`)
    for (let j = 1; j <= 50; j++) {
        try {

            const location = await page.$eval(`#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.flex-shrink-0.col-12.col-md-9.mb-4.mb-md-0 > div:nth-child(2) > div > div:nth-child(${j}) > div.d-table-cell.col-9.v-align-top.pr-3 > p`, el => el.innerText);
            const userTag = await page.$eval(`#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.flex-shrink-0.col-12.col-md-9.mb-4.mb-md-0 > div:nth-child(2) > div > div:nth-child(${j}) > div.d-table-cell.col-9.v-align-top.pr-3 > a > span.link-gray.pl-1`, user => user.innerText)
            if(users[userTag] != userTag){
                users.push({userTag, location})
            }
            
        } catch (error) {
            continue
        }
       
        

    }
  }
  createDocument(users)
  browser.close()
};

start();

function createDocument(data){
    return new Promise((resolve, reject) => {
        try {
            const createArquive = fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data), {encoding:'utf-8'})
            console.log('✅ Arquivo criado com sucesso!')
            
            resolve(createArquive)

        } catch (error) {
            reject(error)
        }
    })
}