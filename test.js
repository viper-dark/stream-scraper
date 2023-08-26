var servs = ["live-cdn","live-cdn2"];
var serv = servs[Math.floor(Math.random() * servs.length)];
const regex = /'([^']+)'/;
const str = "https://'+serv+'.ninecdn.online/hls/bn2_360.m3u8"
const match =str.replace(regex,"coco")
console.log(match)
