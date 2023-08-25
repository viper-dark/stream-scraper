import { Scraper } from './Scraper.Class.js'
//import puppeteer from 'puppeteer'
//zzzzzzzzzzzzzzzzzz



/* (async () => {
   
   
  
    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        console.log("*********************** aws lamdad imported :",process.env.AWS_LAMBDA_FUNCTION_VERSION);
        
        chromium  = await import("@sparticuz/chromium");
      puppeteer = await import("puppeteer-core");
      
    } else {
        console.log("*************************** regural pupeteer imported !");
        
      puppeteer = await import("puppeteer");
    }
  
  })(); */
/* if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    chrome = require("chrome-aws-lambda");
    puppeteer = require("puppeteer-core");
} else {
    puppeteer = require("puppeteer");
} */


let options = {};



import axios from 'axios';
import cherio from 'cherio';

export class ScraperDynamic extends Scraper {
    constructor(first_team: string, second_team: string) {
        super(first_team, second_team)

    }

    override async get_urls_attached_to_btns() {
        let chromium ;
        let puppeteer;
     //  (async () => {
   
   
  
            if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
                console.log("*********************** aws lamdad imported :",process.env.AWS_LAMBDA_FUNCTION_VERSION);
                
                  puppeteer = (await import('puppeteer')).default;
               //   chromium = (await import('@sparticuz/chromium-min')).default;
              
          /*  } else {
                console.log("*************************** regural pupeteer imported !");
                
           //   puppeteer = await import("puppeteer");
            }*/
          
         // })();


      /*   if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
            console.log("************************* setting options for pupeteer !");
            console.log("************************* loging chrome !",chromium );
            console.log("************************* loging peputeer !",puppeteer );
           // console.log("************************* loging pepeteer  !",puppeteer );
            
            options = {
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(
                  "https://github.com/Sparticuz/chromium/releases/download/v110.0.1/chromium-v110.0.1-pack.tar"
                ),
               
            
                
                
                headless: true,
                ignoreHTTPSErrors: true,
            };
            console.log("****************option set ");
            
        } */
        console.time("browser runtime")
        const browser = await puppeteer.launch()
        // const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(this.match_link);

        //waiting t=for the frame to load
        const frame = await page.waitForSelector("#iframe");
        //getting the content frame  
        const contentFrame = await frame.contentFrame();

        //getting the btns href attributes
        const anchorsHrefs = await contentFrame?.$$eval("body > ul > li > a", el => el.map(el => { return { quality: el.textContent, url: el.getAttribute("href") } }))
        if (anchorsHrefs) {
            console.log("a/btns  tags hrefs attrs found: \n");

            this.iframe_urls.push(...anchorsHrefs.map(e => { e.referer = this.match_link; return e }))
            console.log(this.iframe_urls);

        } else
            console.log("no btns found !");

        console.timeEnd("browser runtime",);
        browser.close()

    }

        return 0

    }

    public override async get_m3u8_urls(): Promise<boolean> {
        const urls: any[] = [];
        //getting the final iframe urls using our private method

        //extracting the m3u8 url

        for (let index = 0; index < this.iframe_urls.length; index++) {
            console.log("iframe:", index);

            const { url, referer } = this.iframe_urls[index];
            let m3u8_url = "";
            //making our final html request
            const { data: iframeHtml } = await axios.get(url, {
                headers: { Referer: referer },
            });
            let $ = cherio.load(iframeHtml);

            //itearating over script tags to match the m3u8 source
            $("script").each((i, el) => {
                const script = $(el).html();
                //regex to match the m3u8 in script string
                const regex1 = /https?:\/\/[^\s"]+\.m3u8\b/g;
                //regex to match the coded string within the script
                const regex2 = /AlbaPlayerControl\('([^']+)'\)/;


                const nonCodedLink = script.match(regex1)?.[0]
                const codedLink = script.match(regex2)?.[0]
                console.log(i);
                //when a none coded regular m3u8 link is found
                if (nonCodedLink) {
                    console.log(nonCodedLink);
                    m3u8_url = nonCodedLink

                    return false

                }
                //when finding a link in coded format
                if (codedLink) {
                    //decoding the link
                    console.log(codedLink);

                    let buff = Buffer.from(codedLink, 'base64');
                    m3u8_url = buff.toString('utf-8');
                    return false
                }

            })

            if (m3u8_url) {
                this.hls_data.push({
                    m3u8Link: m3u8_url,
                    referer: url,
                    quality: this.iframe_urls[index].quality,
                });
            }

        }
        if (!this.hls_data.length) {
            console.error(
                "ERROR no hls data was found !make sure you have called the necessery methods first!"
            );
            return false;
        }
        console.log(`congratulations ${this.hls_data.length} has been found for match team1 team 2`);

        return true;

    }
}