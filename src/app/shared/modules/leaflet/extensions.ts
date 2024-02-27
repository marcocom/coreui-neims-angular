import * as L from 'leaflet';

const MARKER_ICON_URL = {
  'marker-1': 'assets/images/marker-1.svg',
  'marker-2': 'assets/images/marker-2.svg',
  'marker-1-alt': 'assets/images/marker-1-alt.svg',
  'marker-2-alt': 'assets/images/marker-2-alt.svg',
};
const DEFAULT_RADIUS = 8;

export const defaultMarkerIcon = L.icon({
  iconUrl: 'assets/marker-icon.png',
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  shadowSize: [41, 41],
  tooltipAnchor: [16, -28],
  popupAnchor: [1, -34],
});

export const marker1Icon = L.icon({
  iconUrl: MARKER_ICON_URL['marker-1'],
  iconSize: [18, 27],
  iconAnchor: [9, 27],
});

export const marker2Icon = L.icon({
  iconUrl: MARKER_ICON_URL['marker-2'],
  iconSize: [18, 27],
  iconAnchor: [9, 27],
});

export const marker1AltIcon = L.icon({
  iconUrl: MARKER_ICON_URL['marker-1-alt'],
  iconSize: [24, 36],
  iconAnchor: [12, 36],
});

export const marker2AltIcon = L.icon({
  iconUrl: MARKER_ICON_URL['marker-2-alt'],
  iconSize: [24, 36],
  iconAnchor: [12, 36],
});

export function customMarkerWithText(
  icon: 'marker-1-alt' | 'marker-2-alt',
  text: string
): L.DivIcon {
  const wrapper = L.DomUtil.create('div');
  const img = L.DomUtil.create('img', 'custom-marker-img', wrapper);
  img.src = MARKER_ICON_URL[icon];
  const span = L.DomUtil.create('span', 'custom-marker-text', wrapper);
  span.innerText = text;

  return L.divIcon({
    html: wrapper.innerHTML,
    className: 'custom-marker',
  });
}

function createMarker(
  latLng: L.LatLngExpression,
  options: L.MarkerOptions = {}
): L.Marker {
  return L.marker(latLng, options);
}

function createCircleMarker(
  lat: number,
  lng: number,
  radius?: number
): L.CircleMarker {
  return L.circleMarker([lat, lng], {
    radius: radius ?? DEFAULT_RADIUS,
    className: 'circle-marker',
  });
}

const markers = {
  defaultMarkerIcon,
  marker1Icon,
  marker2Icon,
  marker1AltIcon,
  marker2AltIcon,
  customMarkerWithText,
  createMarker,
  createCircleMarker,
};

Object.freeze(markers);

export { markers as Markers };

export const LegendControl = L.Control.extend({
  onAdd: () => L.DomUtil.get('map-legend'),
});

export function addCustomControl(
  content: HTMLElement,
  position: L.ControlPosition
): L.Control {
  const AddMarkerControl = L.Control.extend({
    onAdd: () => content,
  });
  const addMarkerControl = new AddMarkerControl({ position });

  return addMarkerControl;
}
