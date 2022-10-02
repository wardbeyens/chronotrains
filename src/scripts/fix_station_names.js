// import fetchTrainlineStations, { collect } from 'trainline-stations'
import fromPairs from 'lodash/fromPairs.js'
import { readFileSync, writeFileSync } from 'fs';
import cleanStationName from 'db-clean-station-name'
// import stations from 'db-stations'
import stations from 'db-hafas-stations'

const fixName = (n) => {
    n = cleanStationName(n);
    n = n.replace(/,/g, ' -');
    return n;
}



const buildStations = async () => {
    console.error('fetching stations...')
    let rawdata = readFileSync('stations.json');
    return JSON.parse(rawdata);

    // console.error('fetching latest stations…')
    // const rawStations = await collect(fetchTrainlineStations())

    // console.error('building station dataset…')
    // const validAndFormattedStations = rawStations
    //     .flatMap((s) => {
    //         if (!(s.id && s.db_id && s.name)) return []
    //         const id = String(s.db_id)
    //         return [{
    //             id: (id.length === 9 && id.slice(0, 2)) ? id.slice(2) : id,
    //             name: s.name
    //         }]
    //     })

    // console.error('done.')
    // return fromPairs(validAndFormattedStations.map(s => [s.id, s]))
}

const getDataBaseStations = async () => {
    console.error('fetching db_stations...')
    let rawdata = readFileSync('db_stations.json');
    return JSON.parse(rawdata);
}

const getDirektBahnStations = async () => {
    let rawdata = readFileSync('./direkt_bahn.json');
    return JSON.parse(rawdata);
}

const getChronoStations = async () => {
    let rawdata = readFileSync('./chrono_stations_name_fix.json');
    return JSON.parse(rawdata);
}

const main = async () => {
    let notFound = 0;

    const stationsFromTrainLine = await buildStations();
    const stationsFromDirektBahn = await getDirektBahnStations();
    const stationsFromChrono = await getChronoStations();


    let dataBaseStations = await getDataBaseStations();
    console.log(Object.keys(dataBaseStations).length);

    for (let i = 0; i < dataBaseStations.length; i++) {
        const s = dataBaseStations[i];
        const id = s.id;
        let name;



        if (stationsFromDirektBahn[id]) {
            name = fixName(stationsFromDirektBahn[id].name)
        } else if (stationsFromTrainLine[id]) {
            name = fixName(stationsFromTrainLine[id].name)
        } else if (stationsFromChrono[id]) {
            name = fixName(stationsFromChrono[id].name)
        }

        name ? dataBaseStations[i].name = name : notFound++;
    }

    writeFileSync("./db_stations_with_name.json", JSON.stringify(dataBaseStations, null, 2));
    console.log("Not found: " + notFound);

    // process.stdout.write(JSON.stringify(stations, null, 2))

    // const prismaStations = await prisma.station.findMany()
    // console.log(prismaStations);


    // await prisma.station.update({
    //     where: { id: +station.id },
    //     data: { directTimesFetched: true },
    //   });
}

main();