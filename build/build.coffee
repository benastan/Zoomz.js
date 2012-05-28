haml = require 'haml'
fs = require 'fs'
path = require 'path'
http = require 'http'
files = ['basic']
data = {}
media_url = process.argv[2]
port = parseInt process.argv[3], 10

if process.argv.length < 3 and path.existsSync 'build.config'
	settings = JSON.parse fs.readFileSync('build.config', 'utf-8')
	media_url = setting[0]
	port = parseInt settings[1], 10

if media_url is undefined
	media_url = ''

for file in files
	data[file] = haml(fs.readFileSync('tpl/'+file+'.haml', 'utf-8'))
		media_url: media_url
	fs.writeFileSync '../examples/'+file+'.html', data[file], 0, 'utf-8'
	if not first then first = data[file]

if port
	http.createServer((q, s) ->
		uri = q.url.substr(1)
		if data[uri]
			s.end data[uri]
		else
			filename = '../examples/'+uri
			if path.existsSync filename
				s.end fs.readFileSync filename
	).listen port
	console.log 'Examples running on port '+port