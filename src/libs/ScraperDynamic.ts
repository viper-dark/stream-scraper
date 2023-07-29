import { Scraper } from './Scraper.js'
//import puppeteer from 'puppeteer'
//zzzzzzzzzzzzzzzzzz

let chrome = {};
let puppeteer;

(async () => {
   
   
  
    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
       chrome = await import("chrome-aws-lambda");
      puppeteer = await import("puppeteer-core");
      
    } else {
      puppeteer = await import("puppeteer");
    }
  
    // The rest of your code goes here...
    // You can access 'puppeteer' and 'options' variables inside this IIFE.
    // Example:
   /*  */
  
    // Continue with your code...
  })();
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


        if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
            options = {
                args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
                defaultViewport: chrome.defaultViewport,
                executablePath: await chrome.executablePath,
                headless: true,
                ignoreHTTPSErrors: true,
            };
        }

        const browser = await puppeteer.launch(options)
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

        console.timeLog("browser time");
        browser.close()



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