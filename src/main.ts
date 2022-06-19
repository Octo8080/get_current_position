import LatLon from "https://esm.sh/geodesy@2.4.0/latlon-spherical.js";
window.onload = () => {
  if (!navigator.geolocation) return;
  setInterval(getPosition, 1000);
};

function getPosition() {
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function onSuccess(position: GeolocationCoordinates) {
  const propaties: string[] = [];
  for (var key in position.coords) {
    propaties.push(`${key} = ${position.coords[key]}`);
  }
  const propatiesString = propaties.reduce((pre, cur) => pre + `\n` + cur);

  const { distance, direction } = getDistanceAndDirection(position.coords);

  const viewString =
    propatiesString +
    `\n距離1：${distance}\n方角x:${direction.x}\n方角y:${direction.y}`;

  document.getElementById("output").innerText = viewString;
}
function onError(error: GeolocationPositionError) {
  const propaties: string[] = [];
  for (var key in error) {
    propaties.push(`${key} = ${error[key]}`);
  }
  const propatiesString = propaties.reduce((pre, cur) => pre + `\n` + cur);
  document.getElementById("output").innerText = propatiesString;
}

// こちらの座標は東京ドイツ村周辺
const target = {
  latitude: 35.40564021220976,
  longitude: 140.0539013101807,
  altitude: 45,
};

function getDistanceAndDirection(params: {
  latitude: number;
  longitude: number;
  altitude: number;
}): { distance: number; direction: { x: number; y: number } } {
  const selfPosition = new LatLon(params.latitude, params.longitude);
  const targetPosition = new LatLon(target.latitude, target.longitude);

  // 2座標間距離
  const distance = selfPosition.distanceTo(targetPosition);

  // 2座標間平面方向角度
  const direction = { x: 0, y: 0 };
  direction.x = convert(selfPosition.finalBearingTo(targetPosition));

  // 2座標間垂直方向角度
  const altitudeDiff = target.altitude - params.altitude;
  direction.y = (Math.atan2(distance, -altitudeDiff) * 180) / Math.PI - 90;

  return { distance, direction };
}

// 北を0とした0~360度系を南を0とした0~360度系に変換
function convert(arg: number) {
  return (360 - arg + 180) % 360;
}
