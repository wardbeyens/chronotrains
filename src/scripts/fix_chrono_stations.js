import fetchTrainlineStations, { collect } from 'trainline-stations'
import fromPairs from 'lodash/fromPairs.js'
import { readFileSync, writeFileSync } from 'fs';
import cleanStationName from 'db-clean-station-name'

const fixStationName = station => ({
	...station,
	name: cleanStationName(station.name),
})

const main = async () => {


    let rawdata = readFileSync('./chrono_stations.json');
    let rawStations = JSON.parse(rawdata);

    let stationsList = {};
    for (let index = 0; index < rawStations.length; index++) {
        const ps = rawStations[index].properties;
        stationsList[ps.id] = {
            id: ps.id,
            name: cleanStationName(ps.name)
        }
    }

    writeFileSync("./chrono_stations_name_fix.json", JSON.stringify(stationsList, null, 2));

    // process.stdout.write(JSON.stringify(stations, null, 2))

}

main();
