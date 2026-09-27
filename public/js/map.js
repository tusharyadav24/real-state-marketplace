maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
  container: 'map',
  style: maptilersdk.MapStyle.STREETS,
  center: coordinates, 
  zoom: 9
});

const marker = new maptilersdk.Marker({color: "#FF0000"})
  .setLngLat(coordinates)
  .addTo(map);