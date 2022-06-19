(() => {
  // deno:https://esm.sh/v86/geodesy@2.4.0/deno/latlon-spherical.js
  var B = "\u202F";
  var R = class {
    static get separator() {
      return B;
    }
    static set separator(t) {
      B = t;
    }
    static parse(t) {
      if (!isNaN(parseFloat(t)) && isFinite(t))
        return Number(t);
      let s = String(t).trim().replace(/^-/, "").replace(/[NSEW]$/i, "").split(/[^0-9.,]+/);
      if (s[s.length - 1] == "" && s.splice(s.length - 1), s == "")
        return NaN;
      let n = null;
      switch (s.length) {
        case 3:
          n = s[0] / 1 + s[1] / 60 + s[2] / 3600;
          break;
        case 2:
          n = s[0] / 1 + s[1] / 60;
          break;
        case 1:
          n = s[0];
          break;
        default:
          return NaN;
      }
      return /^-|[WS]$/i.test(t.trim()) && (n = -n), Number(n);
    }
    static toDms(t, s = "d", n = void 0) {
      if (isNaN(t) || typeof t == "string" && t.trim() == "" || typeof t == "boolean" || t == 1 / 0 || t == null)
        return null;
      if (n === void 0)
        switch (s) {
          case "d":
          case "deg":
            n = 4;
            break;
          case "dm":
          case "deg+min":
            n = 2;
            break;
          case "dms":
          case "deg+min+sec":
            n = 0;
            break;
          default:
            s = "d", n = 4;
            break;
        }
      t = Math.abs(t);
      let a = null, i = null, o = null, e = null;
      switch (s) {
        default:
        case "d":
        case "deg":
          i = t.toFixed(n), i < 100 && (i = "0" + i), i < 10 && (i = "0" + i), a = i + "\xB0";
          break;
        case "dm":
        case "deg+min":
          i = Math.floor(t), o = (t * 60 % 60).toFixed(n), o == 60 && (o = 0 .toFixed(n), i++), i = ("000" + i).slice(-3), o < 10 && (o = "0" + o), a = i + "\xB0" + R.separator + o + "\u2032";
          break;
        case "dms":
        case "deg+min+sec":
          i = Math.floor(t), o = Math.floor(t * 3600 / 60) % 60, e = (t * 3600 % 60).toFixed(n), e == 60 && (e = 0 .toFixed(n), o++), o == 60 && (o = 0, i++), i = ("000" + i).slice(-3), o = ("00" + o).slice(-2), e < 10 && (e = "0" + e), a = i + "\xB0" + R.separator + o + "\u2032" + R.separator + e + "\u2033";
          break;
      }
      return a;
    }
    static toLat(t, s, n) {
      let a = R.toDms(R.wrap90(t), s, n);
      return a === null ? "\u2013" : a.slice(1) + R.separator + (t < 0 ? "S" : "N");
    }
    static toLon(t, s, n) {
      let a = R.toDms(R.wrap180(t), s, n);
      return a === null ? "\u2013" : a + R.separator + (t < 0 ? "W" : "E");
    }
    static toBrng(t, s, n) {
      let a = R.toDms(R.wrap360(t), s, n);
      return a === null ? "\u2013" : a.replace("360", "0");
    }
    static fromLocale(t) {
      let s = 123456.789 .toLocaleString(), n = { thousands: s.slice(3, 4), decimal: s.slice(7, 8) };
      return t.replace(n.thousands, "\u205C").replace(n.decimal, ".").replace("\u205C", ",");
    }
    static toLocale(t) {
      let s = 123456.789 .toLocaleString(), n = { thousands: s.slice(3, 4), decimal: s.slice(7, 8) };
      return t.replace(/,([0-9])/, "\u205C$1").replace(".", n.decimal).replace("\u205C", n.thousands);
    }
    static compassPoint(t, s = 3) {
      if (![1, 2, 3].includes(Number(s)))
        throw new RangeError(`invalid precision \u2018${s}\u2019`);
      t = R.wrap360(t);
      let n = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"], a = 4 * 2 ** (s - 1);
      return n[Math.round(t * a / 360) % a * 16 / a];
    }
    static wrap90(t) {
      if (-90 <= t && t <= 90)
        return t;
      let s = t, n = 90, a = 360;
      return 4 * n / a * Math.abs(((s - a / 4) % a + a) % a - a / 2) - n;
    }
    static wrap180(t) {
      if (-180 <= t && t <= 180)
        return t;
      let s = t, n = 180, a = 360;
      return ((2 * n * s / a - a / 2) % a + a) % a - n;
    }
    static wrap360(t) {
      if (0 <= t && t < 360)
        return t;
      let s = t, n = 180, a = 360;
      return (2 * n * s / a % a + a) % a;
    }
  };
  Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  };
  Number.prototype.toDegrees = function() {
    return this * 180 / Math.PI;
  };
  var l = R;
  var f = Math.PI;
  var c = class {
    constructor(t, s) {
      if (isNaN(t))
        throw new TypeError(`invalid lat \u2018${t}\u2019`);
      if (isNaN(s))
        throw new TypeError(`invalid lon \u2018${s}\u2019`);
      this._lat = l.wrap90(Number(t)), this._lon = l.wrap180(Number(s));
    }
    get lat() {
      return this._lat;
    }
    get latitude() {
      return this._lat;
    }
    set lat(t) {
      if (this._lat = isNaN(t) ? l.wrap90(l.parse(t)) : l.wrap90(Number(t)), isNaN(this._lat))
        throw new TypeError(`invalid lat \u2018${t}\u2019`);
    }
    set latitude(t) {
      if (this._lat = isNaN(t) ? l.wrap90(l.parse(t)) : l.wrap90(Number(t)), isNaN(this._lat))
        throw new TypeError(`invalid latitude \u2018${t}\u2019`);
    }
    get lon() {
      return this._lon;
    }
    get lng() {
      return this._lon;
    }
    get longitude() {
      return this._lon;
    }
    set lon(t) {
      if (this._lon = isNaN(t) ? l.wrap180(l.parse(t)) : l.wrap180(Number(t)), isNaN(this._lon))
        throw new TypeError(`invalid lon \u2018${t}\u2019`);
    }
    set lng(t) {
      if (this._lon = isNaN(t) ? l.wrap180(l.parse(t)) : l.wrap180(Number(t)), isNaN(this._lon))
        throw new TypeError(`invalid lng \u2018${t}\u2019`);
    }
    set longitude(t) {
      if (this._lon = isNaN(t) ? l.wrap180(l.parse(t)) : l.wrap180(Number(t)), isNaN(this._lon))
        throw new TypeError(`invalid longitude \u2018${t}\u2019`);
    }
    static get metresToKm() {
      return 1 / 1e3;
    }
    static get metresToMiles() {
      return 1 / 1609.344;
    }
    static get metresToNauticalMiles() {
      return 1 / 1852;
    }
    static parse(...t) {
      if (t.length == 0)
        throw new TypeError("invalid (empty) point");
      if (t[0] === null || t[1] === null)
        throw new TypeError("invalid (null) point");
      let s, n;
      if (t.length == 2 && ([s, n] = t, s = l.wrap90(l.parse(s)), n = l.wrap180(l.parse(n)), isNaN(s) || isNaN(n)))
        throw new TypeError(`invalid point \u2018${t.toString()}\u2019`);
      if (t.length == 1 && typeof t[0] == "string" && ([s, n] = t[0].split(","), s = l.wrap90(l.parse(s)), n = l.wrap180(l.parse(n)), isNaN(s) || isNaN(n)))
        throw new TypeError(`invalid point \u2018${t[0]}\u2019`);
      if (t.length == 1 && typeof t[0] == "object") {
        let a = t[0];
        if (a.type == "Point" && Array.isArray(a.coordinates) ? [n, s] = a.coordinates : (a.latitude != null && (s = a.latitude), a.lat != null && (s = a.lat), a.longitude != null && (n = a.longitude), a.lng != null && (n = a.lng), a.lon != null && (n = a.lon), s = l.wrap90(l.parse(s)), n = l.wrap180(l.parse(n))), isNaN(s) || isNaN(n))
          throw new TypeError(`invalid point \u2018${JSON.stringify(t[0])}\u2019`);
      }
      if (isNaN(s) || isNaN(n))
        throw new TypeError(`invalid point \u2018${t.toString()}\u2019`);
      return new c(s, n);
    }
    distanceTo(t, s = 6371e3) {
      if (t instanceof c || (t = c.parse(t)), isNaN(s))
        throw new TypeError(`invalid radius \u2018${s}\u2019`);
      let n = s, a = this.lat.toRadians(), i = this.lon.toRadians(), o = t.lat.toRadians(), e = t.lon.toRadians(), h = o - a, r = e - i, M = Math.sin(h / 2) * Math.sin(h / 2) + Math.cos(a) * Math.cos(o) * Math.sin(r / 2) * Math.sin(r / 2), u = 2 * Math.atan2(Math.sqrt(M), Math.sqrt(1 - M));
      return n * u;
    }
    initialBearingTo(t) {
      if (t instanceof c || (t = c.parse(t)), this.equals(t))
        return NaN;
      let s = this.lat.toRadians(), n = t.lat.toRadians(), a = (t.lon - this.lon).toRadians(), i = Math.cos(s) * Math.sin(n) - Math.sin(s) * Math.cos(n) * Math.cos(a), o = Math.sin(a) * Math.cos(n), h = Math.atan2(o, i).toDegrees();
      return l.wrap360(h);
    }
    finalBearingTo(t) {
      t instanceof c || (t = c.parse(t));
      let s = t.initialBearingTo(this) + 180;
      return l.wrap360(s);
    }
    midpointTo(t) {
      t instanceof c || (t = c.parse(t));
      let s = this.lat.toRadians(), n = this.lon.toRadians(), a = t.lat.toRadians(), i = (t.lon - this.lon).toRadians(), o = { x: Math.cos(s), y: 0, z: Math.sin(s) }, e = { x: Math.cos(a) * Math.cos(i), y: Math.cos(a) * Math.sin(i), z: Math.sin(a) }, h = { x: o.x + e.x, y: o.y + e.y, z: o.z + e.z }, r = Math.atan2(h.z, Math.sqrt(h.x * h.x + h.y * h.y)), M = n + Math.atan2(h.y, h.x), u = r.toDegrees(), d = M.toDegrees();
      return new c(u, d);
    }
    intermediatePointTo(t, s) {
      if (t instanceof c || (t = c.parse(t)), this.equals(t))
        return new c(this.lat, this.lon);
      let n = this.lat.toRadians(), a = this.lon.toRadians(), i = t.lat.toRadians(), o = t.lon.toRadians(), e = i - n, h = o - a, r = Math.sin(e / 2) * Math.sin(e / 2) + Math.cos(n) * Math.cos(i) * Math.sin(h / 2) * Math.sin(h / 2), M = 2 * Math.atan2(Math.sqrt(r), Math.sqrt(1 - r)), u = Math.sin((1 - s) * M) / Math.sin(M), d = Math.sin(s * M) / Math.sin(M), N = u * Math.cos(n) * Math.cos(a) + d * Math.cos(i) * Math.cos(o), w = u * Math.cos(n) * Math.sin(a) + d * Math.cos(i) * Math.sin(o), b = u * Math.sin(n) + d * Math.sin(i), m = Math.atan2(b, Math.sqrt(N * N + w * w)), g = Math.atan2(w, N), y = m.toDegrees(), $ = g.toDegrees();
      return new c(y, $);
    }
    destinationPoint(t, s, n = 6371e3) {
      let a = t / n, i = Number(s).toRadians(), o = this.lat.toRadians(), e = this.lon.toRadians(), h = Math.sin(o) * Math.cos(a) + Math.cos(o) * Math.sin(a) * Math.cos(i), r = Math.asin(h), M = Math.sin(i) * Math.sin(a) * Math.cos(o), u = Math.cos(a) - Math.sin(o) * h, d = e + Math.atan2(M, u), N = r.toDegrees(), w = d.toDegrees();
      return new c(N, w);
    }
    static intersection(t, s, n, a) {
      if (t instanceof c || (t = c.parse(t)), n instanceof c || (n = c.parse(n)), isNaN(s))
        throw new TypeError(`invalid brng1 \u2018${s}\u2019`);
      if (isNaN(a))
        throw new TypeError(`invalid brng2 \u2018${a}\u2019`);
      let i = t.lat.toRadians(), o = t.lon.toRadians(), e = n.lat.toRadians(), h = n.lon.toRadians(), r = Number(s).toRadians(), M = Number(a).toRadians(), u = e - i, d = h - o, N = 2 * Math.asin(Math.sqrt(Math.sin(u / 2) * Math.sin(u / 2) + Math.cos(i) * Math.cos(e) * Math.sin(d / 2) * Math.sin(d / 2)));
      if (Math.abs(N) < Number.EPSILON)
        return new c(t.lat, t.lon);
      let w = (Math.sin(e) - Math.sin(i) * Math.cos(N)) / (Math.sin(N) * Math.cos(i)), b = (Math.sin(i) - Math.sin(e) * Math.cos(N)) / (Math.sin(N) * Math.cos(e)), m = Math.acos(Math.min(Math.max(w, -1), 1)), g = Math.acos(Math.min(Math.max(b, -1), 1)), y = Math.sin(h - o) > 0 ? m : 2 * f - m, $ = Math.sin(h - o) > 0 ? 2 * f - g : g, T = r - y, x = $ - M;
      if (Math.sin(T) == 0 && Math.sin(x) == 0 || Math.sin(T) * Math.sin(x) < 0)
        return null;
      let q = -Math.cos(T) * Math.cos(x) + Math.sin(T) * Math.sin(x) * Math.cos(N), E = Math.atan2(Math.sin(N) * Math.sin(T) * Math.sin(x), Math.cos(x) + Math.cos(T) * q), v = Math.asin(Math.min(Math.max(Math.sin(i) * Math.cos(E) + Math.cos(i) * Math.sin(E) * Math.cos(r), -1), 1)), P = Math.atan2(Math.sin(r) * Math.sin(E) * Math.cos(i), Math.cos(E) - Math.sin(i) * Math.sin(v)), D = o + P, k = v.toDegrees(), W = D.toDegrees();
      return new c(k, W);
    }
    crossTrackDistanceTo(t, s, n = 6371e3) {
      t instanceof c || (t = c.parse(t)), s instanceof c || (s = c.parse(s));
      let a = n;
      if (this.equals(t))
        return 0;
      let i = t.distanceTo(this, a) / a, o = t.initialBearingTo(this).toRadians(), e = t.initialBearingTo(s).toRadians();
      return Math.asin(Math.sin(i) * Math.sin(o - e)) * a;
    }
    alongTrackDistanceTo(t, s, n = 6371e3) {
      t instanceof c || (t = c.parse(t)), s instanceof c || (s = c.parse(s));
      let a = n;
      if (this.equals(t))
        return 0;
      let i = t.distanceTo(this, a) / a, o = t.initialBearingTo(this).toRadians(), e = t.initialBearingTo(s).toRadians(), h = Math.asin(Math.sin(i) * Math.sin(o - e));
      return Math.acos(Math.cos(i) / Math.abs(Math.cos(h))) * Math.sign(Math.cos(e - o)) * a;
    }
    maxLatitude(t) {
      let s = Number(t).toRadians(), n = this.lat.toRadians();
      return Math.acos(Math.abs(Math.sin(s) * Math.cos(n))).toDegrees();
    }
    static crossingParallels(t, s, n) {
      if (t.equals(s))
        return null;
      let a = Number(n).toRadians(), i = t.lat.toRadians(), o = t.lon.toRadians(), e = s.lat.toRadians(), r = s.lon.toRadians() - o, M = Math.sin(i) * Math.cos(e) * Math.cos(a) * Math.sin(r), u = Math.sin(i) * Math.cos(e) * Math.cos(a) * Math.cos(r) - Math.cos(i) * Math.sin(e) * Math.cos(a), d = Math.cos(i) * Math.cos(e) * Math.sin(a) * Math.sin(r);
      if (d * d > M * M + u * u)
        return null;
      let N = Math.atan2(-u, M), w = Math.acos(d / Math.sqrt(M * M + u * u)), b = o + N - w, m = o + N + w, g = b.toDegrees(), y = m.toDegrees();
      return { lon1: l.wrap180(g), lon2: l.wrap180(y) };
    }
    rhumbDistanceTo(t, s = 6371e3) {
      t instanceof c || (t = c.parse(t));
      let n = s, a = this.lat.toRadians(), i = t.lat.toRadians(), o = i - a, e = Math.abs(t.lon - this.lon).toRadians();
      Math.abs(e) > f && (e = e > 0 ? -(2 * f - e) : 2 * f + e);
      let h = Math.log(Math.tan(i / 2 + f / 4) / Math.tan(a / 2 + f / 4)), r = Math.abs(h) > 1e-11 ? o / h : Math.cos(a);
      return Math.sqrt(o * o + r * r * e * e) * n;
    }
    rhumbBearingTo(t) {
      if (t instanceof c || (t = c.parse(t)), this.equals(t))
        return NaN;
      let s = this.lat.toRadians(), n = t.lat.toRadians(), a = (t.lon - this.lon).toRadians();
      Math.abs(a) > f && (a = a > 0 ? -(2 * f - a) : 2 * f + a);
      let i = Math.log(Math.tan(n / 2 + f / 4) / Math.tan(s / 2 + f / 4)), e = Math.atan2(a, i).toDegrees();
      return l.wrap360(e);
    }
    rhumbDestinationPoint(t, s, n = 6371e3) {
      let a = this.lat.toRadians(), i = this.lon.toRadians(), o = Number(s).toRadians(), e = t / n, h = e * Math.cos(o), r = a + h;
      Math.abs(r) > f / 2 && (r = r > 0 ? f - r : -f - r);
      let M = Math.log(Math.tan(r / 2 + f / 4) / Math.tan(a / 2 + f / 4)), u = Math.abs(M) > 1e-11 ? h / M : Math.cos(a), d = e * Math.sin(o) / u, N = i + d, w = r.toDegrees(), b = N.toDegrees();
      return new c(w, b);
    }
    rhumbMidpointTo(t) {
      t instanceof c || (t = c.parse(t));
      let s = this.lat.toRadians(), n = this.lon.toRadians(), a = t.lat.toRadians(), i = t.lon.toRadians();
      Math.abs(i - n) > f && (n += 2 * f);
      let o = (s + a) / 2, e = Math.tan(f / 4 + s / 2), h = Math.tan(f / 4 + a / 2), r = Math.tan(f / 4 + o / 2), M = ((i - n) * Math.log(r) + n * Math.log(h) - i * Math.log(e)) / Math.log(h / e);
      isFinite(M) || (M = (n + i) / 2);
      let u = o.toDegrees(), d = M.toDegrees();
      return new c(u, d);
    }
    static areaOf(t, s = 6371e3) {
      let n = s, a = t[0].equals(t[t.length - 1]);
      a || t.push(t[0]);
      let i = t.length - 1, o = 0;
      for (let r = 0; r < i; r++) {
        let M = t[r].lat.toRadians(), u = t[r + 1].lat.toRadians(), d = (t[r + 1].lon - t[r].lon).toRadians();
        o += 2 * Math.atan2(Math.tan(d / 2) * (Math.tan(M / 2) + Math.tan(u / 2)), 1 + Math.tan(M / 2) * Math.tan(u / 2));
      }
      h(t) && (o = Math.abs(o) - 2 * f);
      let e = Math.abs(o * n * n);
      return a || t.pop(), e;
      function h(r) {
        let M = 0, u = r[0].initialBearingTo(r[1]);
        for (let w = 0; w < r.length - 1; w++) {
          let b = r[w].initialBearingTo(r[w + 1]), m = r[w].finalBearingTo(r[w + 1]);
          M += (b - u + 540) % 360 - 180, M += (m - b + 540) % 360 - 180, u = m;
        }
        return M += (r[0].initialBearingTo(r[1]) - u + 540) % 360 - 180, Math.abs(M) < 90;
      }
    }
    equals(t) {
      return t instanceof c || (t = c.parse(t)), !(Math.abs(this.lat - t.lat) > Number.EPSILON || Math.abs(this.lon - t.lon) > Number.EPSILON);
    }
    toGeoJSON() {
      return { type: "Point", coordinates: [this.lon, this.lat] };
    }
    toString(t = "d", s = void 0) {
      if (!["d", "dm", "dms", "n"].includes(t))
        throw new RangeError(`invalid format \u2018${t}\u2019`);
      if (t == "n")
        return s == null && (s = 4), `${this.lat.toFixed(s)},${this.lon.toFixed(s)}`;
      let n = l.toLat(this.lat, t, s), a = l.toLon(this.lon, t, s);
      return `${n}, ${a}`;
    }
  };

  // deno:file:///usr/src/app/src/main.ts
  window.onload = () => {
    if (!navigator.geolocation)
      return;
    setInterval(getPosition, 1e3);
  };
  function getPosition() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }
  function onSuccess(position) {
    const propaties = [];
    for (var key in position.coords) {
      propaties.push(`${key} = ${position.coords[key]}`);
    }
    const propatiesString = propaties.reduce((pre, cur) => pre + `
` + cur);
    const { distance, direction } = getDistanceAndDirection(position.coords);
    const viewString = propatiesString + `
\u8DDD\u96E21\uFF1A${distance}
\u65B9\u89D2x:${direction.x}
\u65B9\u89D2y:${direction.y}`;
    document.getElementById("output").innerText = viewString;
  }
  function onError(error) {
    const propaties = [];
    for (var key in error) {
      propaties.push(`${key} = ${error[key]}`);
    }
    const propatiesString = propaties.reduce((pre, cur) => pre + `
` + cur);
    document.getElementById("output").innerText = propatiesString;
  }
  var target = {
    latitude: 35.40564021220976,
    longitude: 140.0539013101807,
    altitude: 45
  };
  function getDistanceAndDirection(params) {
    const selfPosition = new c(params.latitude, params.longitude);
    const targetPosition = new c(target.latitude, target.longitude);
    const distance = selfPosition.distanceTo(targetPosition);
    const direction = { x: 0, y: 0 };
    direction.x = convert(selfPosition.finalBearingTo(targetPosition));
    const altitudeDiff = target.altitude - params.altitude;
    direction.y = Math.atan2(distance, -altitudeDiff) * 180 / Math.PI - 90;
    return { distance, direction };
  }
  function convert(arg) {
    return (360 - arg + 180) % 360;
  }
})();
