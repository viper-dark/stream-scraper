"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const axios = require("axios").default;
const cherio = require("cherio");
const fs = require("fs");
function getStream(iframeLink) {
    return __awaiter(this, void 0, void 0, function* () {
        //getting the iframe html content
        const { data: iframeHtml } = yield axios.get(iframeLink, {
            headers: { Referer: "https://fc.livekoora.online/" },
        });
        //loading the the html to cherio
        let $ = cherio.load(iframeHtml);
        let m3uLink = "";
        const Referer = iframeLink;
        //iterating over the script tags found in the html
        $("script").each(function (i, elem) {
            var _a;
            //the script as string
            const script = $(elem).html();
            // the regex to find urls
            const urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
            const url = (_a = script.match(urlR)) === null || _a === void 0 ? void 0 : _a[0];
            let isM3uLink = false;
            //checking if the url is valid
            url ? (isM3uLink = url.startsWith("http") && url.endsWith("m3u8")) : null;
            //is the link is found stop the iteration over the scripts <script/>
            if (isM3uLink && url) {
                m3uLink = url;
                return false;
            }
        });
        if (!m3uLink) {
            console.error("ERROR no m3u8 url found with the supplied iframe link😨");
            return null;
        }
        return { m3uLink, Referer };
        // fs.writeFileSync("iframe.html", $.html());
    });
}
module.exports = getStream;
