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


plot = function(data){
	app.set('code', data)
	app.launchSimulation()
}

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