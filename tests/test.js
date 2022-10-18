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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
var Scraper_1 = require("../libs/Scraper");
var _a = process.env, first = _a.first, second = _a.second, link = _a.link;
var scraper = new Scraper_1.Scraper(first, second);
//first test correct match link
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var b;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, scraper.get_match_link()];
            case 1:
                b = _a.sent();
                console.log("is the correct link :");
                return [2 /*return*/];
        }
    });
}); });
//second test
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var b, t;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            //first step
            return [4 /*yield*/, scraper.get_match_link()];
            case 1:
                //first step
                _a.sent();
                return [4 /*yield*/, scraper.get_urls_attached_to_btns()];
            case 2:
                b = _a.sent();
                return [4 /*yield*/, scraper.get_m3u8_urls()];
            case 3:
                t = _a.sent();
                console.log(scraper);
                console.log(t);
                return [2 /*return*/];
        }
    });
}); })();
