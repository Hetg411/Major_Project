let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
   const coords = { lat: coordinates[1], lng: coordinates[0] };
  map = new Map(document.getElementById("map"), {
    center:coords,
    zoom: 8,
  });
   new google.maps.Marker({
    position: coords,
    map,
    title: `Exact location will be provided after Booking.`,
  });

  
}

initMap();