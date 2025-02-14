export const NagoyaCentralPark = {
  NagoyaCentralPark: {
    name: "名古屋セントラルパーク",
    rootPath: "/NagoyaCentralPark/",
    networkFile: {
      node: "CentralPark_B1_Node.geojson",
      link: "CentralPark_B1_Link.geojson",
    },
    terrainFile: "central.geojson",
    geoFiles: [
      "CentralPark_B1_Build_Connect.geojson",
      "CentralPark_B1_Building.geojson",
      "CentralPark_B1_Drawing.geojson",
      "CentralPark_B1_Facility.geojson",
      "CentralPark_B1_Fixture.geojson",
      "CentralPark_B1_Floor_Connect.geojson",
      "CentralPark_B1_Floor.geojson",
      "CentralPark_B1_Opening.geojson",
      "CentralPark_B1_Site.geojson",
      "CentralPark_B1_Space.geojson",
      "CentralPark_B1_TWSI_Line.geojson",
      "CentralPark_B1_TWSI_Point.geojson",
    ],
    center: [-266467.79169992125, -87879.0502576503] as [number, number],
    coordinate: {
      lat: 35.173876354000001,
      lon: 136.90734294800001,
    },
    source: {
      text: "セントラルパーク地下街 屋内地図オープンデータ(国土交通省)",
      url: "https://www.geospatial.jp/ckan/dataset/city-nagoya-indoor-centralpark?resource_id=f803f525-bd47-44f3-8a99-9ad1a01205f8",
    },
  },
};
