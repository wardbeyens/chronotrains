import { readFileSync } from 'fs';

let rawdata = readFileSync('stations.json');
let data = JSON.parse(rawdata);
console.log(Object.keys(data).length);