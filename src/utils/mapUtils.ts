
export const fitMapToBounds = (map: google.maps.Map, markers: google.maps.Marker[]) => {
  if (markers.length === 0) return;

  const bounds = new window.google.maps.LatLngBounds();
  markers.forEach(marker => {
    bounds.extend(marker.getPosition()!);
  });
  map.fitBounds(bounds);
};

export const clearMarkers = (markers: google.maps.Marker[]) => {
  markers.forEach(marker => marker.setMap(null));
  return [];
};

export const closeAllInfoWindows = (markers: google.maps.Marker[]) => {
  markers.forEach(marker => {
    if ((marker as any).infoWindow) {
      (marker as any).infoWindow.close();
    }
  });
};
