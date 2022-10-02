import prisma from "~/lib/prisma";
import fetch from "node-fetch";
import { Prisma, Station } from "@prisma/client";
import { distance, point } from "@turf/turf";
const fs = require("fs");
import { dirname, resolve } from "path";
import { fileURLToPath, URL } from "url";

function insert(str: string, index: number, value: string) {
  return str.slice(0, index) + value + str.slice(index);
}

//"coordinates": [8.399583, 48.994348]  [long, lat]
export const main = async () => {
  let stations = await fetch("https://www.chronotrains.com/api/stations").then(
    (res) => res.json()
  );

  let sqlStations = stations.features
    .map((s: any) => {
      let name = s.properties.name;
      let i = 0;
      while (name.includes("'") && i < name.length) {
        if (name[i] == "'") {
          name = insert(name, i, "'");
          i += 2;
        } else i += 1;
      }
      if (i != 0) console.log(name);
      let id = s.properties.id;
      let lng = s.geometry.coordinates[0];
      let lat = s.geometry.coordinates[1];

      // return {
      //   name: s.properties.name,
      //   id: s.properties.id,
      //   lng: s.geometry.coordinates[0],
      //   lat: s.geometry.coordinates[1],
      // };

      return `\t(${id}, 'unknown', ${Math.round(lng * 1e7)}, ${Math.round(
        lat * 1e7
      )}, false)`;
    })
    .join(",\n");

  const header = `INSERT INTO stations(id, name, longitude_e7, latitude_e7, direct_times_fetched)\nVALUES\n`;

  try {
    fs.writeFileSync(
      resolve(__dirname, "./create-stations.sql"),
      header + sqlStations + ";"
    );
  } catch (err) {
    console.error(err);
  }
};

main();
