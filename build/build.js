var haml = require('haml'),
		fs = require('fs'),
		path = require('path'),
		files = [
			'basic',
		],
		file,
		data = {},
		media_url = process.argv[2],
		port = parseInt(process.argv[3], 10),
		http = require('http'),
		settings;

if (process.argv.length < 3 && path.existsSync('build.config')) {
	settings = fs.readFileSync('build.config', 'utf-8');
	settings = JSON.parse(settings);
	media_url = settings[0];
	port = parseInt(settings[1], 10);
}
if (media_url === undefined) {
	media_url = '';
}
for (var i in files) {
	file = files[i];
	data[file] = haml(fs.readFileSync('tpl/'+file+'.haml', 'utf-8'))({media_url: media_url});
	fs.writeFileSync('../examples/'+file+'.html', data[file], 0, 'utf-8');
}

if (port) {
	http.createServer(function(q, s) {
		var path = q.url.substr(1);
		if (path in data) {
			s.end(data[path]);
		}
	}).listen(port);
	console.log('Examples running on port '+port);
}
