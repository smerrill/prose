// A server for use with OpenShift's NodeJS cartridge.

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8888;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri).replace(/\.\.\//g, '');

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      // Simple MIME type detection.
      contentType = "text/plain"
      switch(filename.split(".").pop()) {
        case 'jpeg':
        case 'jpg':
          contentType = "image/jpeg";
          break;
        case 'gif':
          contentType = "image/gif";
          break;
        case 'png':
          contentType = "image/png";
          break;
        case 'js':
          contentType = "application/x-javascript";
          break;
        case 'css':
          contentType = "text/css";
          break;
        case 'html':
        case 'htm':
          contentType = "text/html";
          break;
      }
      response.writeHead(200, {"Content-Type": contentType});
      response.write(file, "binary");
      response.end();
    });
  });

}).listen(process.env.OPENSHIFT_NODEJS_PORT || 3000, process.env.OPENSHIFT_NODEJS_IP || "localhost");
