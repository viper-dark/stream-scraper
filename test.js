const regex2 = /AlbaPlayerControl\('([^']+)'\)/
const regex = /AlbaPlayerControl\('([^']+)','([^']+)'\);/;
const script ="AlbaPlayerControl('aHR0cHM6Ly9saXZlLWNkbi5uaW5lY2RuLm9ubGluZS9obHMvYm4zXzcyMC5tM3U4','cloudinary');"
const matches = script.match(regex)
//const capturedValues = matches.map(match => match.slice(1, -1));
console.log("match",typeof matches)
console.log("match",matches[0])
console.log("match",matches.input)

//console.log(codedLink)

