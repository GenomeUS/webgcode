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
      var res = JSON.parse(this.responseText)
      cb(res)}}
  xmlhttp.open("GET", url, true)
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
        console.log("unzipping.. ", current/total)
      })
    }
  })
  }, function(error) {
    console.warn(error)
  })
}


plot = function(data){
	app.set('code', data)
	app.launchSimulation()
}


console.log(QueryString()["gcode"])

get_file(QueryString()["gcode"], console.log)



var demo = "G1 X30 G2 X40 Y20 R10 G1 Y10 G2 X30 Y0 R10 G1 X10 G2 X0 Y10 Z-15 R10 (yeah spiral !) G3 X-10 Y20 R-10 (yeah, long arc !) G3 X0 Y10 I10 (center) G91 G1 X10 Z10 G3 Y10 R5 Z3 (circle in incremental) Y10 R5 Z3 (again, testing modal state) G20 G0 X1 (one inch to the right) G3 X-1 R1 (radius in inches) G3 X1 Z0.3 I0.5 J0.5 (I,J in inches) G21 (back to mm) G80 X10 (do nothing) G90 G0 X30 Y30 Z30 G18 (X-Z plane) G3 Z40 I0 K5 G19 (Y-Z plane) G3 Z50 J0 K5 G17 (back to X-Y plane)"