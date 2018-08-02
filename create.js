make_element = function(tag, opts={}){
  var el = document.createElement(tag)
  if (opts["class"]) {el.setAttribute("class", opts["class"])}
  if (opts["id"]) {el.setAttribute("id", opts["id"])}
  if (opts["href"]) {el.setAttribute("href", opts["href"])}
  if (opts["text"]) {el.textContent = opts["text"]}
  return el}

QueryString = function () {
  var query_string = {}
  var query = window.location.search.substring(1)
  var vars = query.split("&")
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=")
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1])
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]))}}
  return query_string}

get_file = function(url, cb){
  var xmlhttp = new XMLHttpRequest()
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = this.response
      cb(res)}}
  xmlhttp.addEventListener("progress", function(e){
    if (e.lengthComputable) {
      var n = e.loaded / e.total;

    }
  })
  xmlhttp.open("GET", url, true)
  xmlhttp.responseType = "arraybuffer";
  xmlhttp.send()}

unzip = function(blob, cb){
  zip.createReader(new zip.BlobReader(blob), function(reader) {
  reader.getEntries(function(entries) {
    if (entries.length) {
      entries[0].getData(new zip.BlobWriter(), function(blob) {
        cb(blob)
        reader.close(function() {
        })

      }, function(current, total) {

      })
    }
  })
  }, function(error) {
    console.warn(error)
  })
}

lines = function(s){
  return s.split(/\s*[\r\n]+\s*/g);
}


SETTINGS = {
  absoluteExtrusion:false,
  feedrateMultiplyer:100,
  filamentDiameter:1.75,
  firmwareRetractLength:2,
  firmwareRetractSpeed:50,
  firmwareRetractZhop:0,
  firmwareUnretractLength:2,
  firmwareUnretractSpeed:50,
  maxJerk:[10, 10, 1, 10],
  maxPrintAcceleration: [1000, 1000, 100, 10000],
  maxSpeed: [100, 100, 10, 100],
  maxTravelAcceleration: [1000, 1000, 100, 10000],
  timeScale: 1.01}


plot = function(data){
  gcodeLines = lines(data)
	app.set('code', data)
	app.launchSimulation()
  gcodeProcessorWorker.postMessage([gcodeLines, SETTINGS]);
}

window.onload = function(e){
  get_file(QueryString()["gcode"], function(res){
  var blob = new Blob([res], { type: "application/zip" })
  unzip(blob, function(res){
    var reader = new FileReader();
    reader.onload = function() {
        var res = reader.result
      plot(res)
    }
    reader.readAsBinaryString(res);
  })
})
}


setview3d = function(e){
	document.body.classList.remove("v2d")
}

setview2d = function(e){
	document.body.classList.add("v2d")
}

analysis = function(data){
  console.log(data)
  var grams = parseFloat(data.filamentUsage) * 2.4 
  document.querySelector("#filament-usage").innerText = grams.toFixed(1) + " grams"
}