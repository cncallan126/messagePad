var fs = require('fs')
var http = require('http')
var template = require('art-template')
var url = require('url')

var items = [{

        name: "李四",
        content: "Hello World!",
        date: "2019年9月19日 14:26:33"

    },
    {
        name: "张三",
        content: "Hello World!",
        date: "2019年9月20日 14:26:33"
    }
]

http.createServer(function(req, res) {
    var urlObj = url.parse(req.url, true)
    var pathName = urlObj.pathname
    if (pathName === '/') { //服务器根目录，首页
        fs.readFile('./views/index.html', function(error, data) {
            if (error) {
                return res.end('404 Not Found.')
            }
            var result = template.render(data.toString(), {
                comments: items
            })
            res.end(result)
        })
    } else if (pathName.indexOf('/public/') === 0) { //开放项目中的public
        fs.readFile('.' + pathName, function(error, data) {
            if (error) {
                return res.end('404 Not Found.')
            }
            res.end(data)
        })
    } else if (pathName === '/post') { //留言页
        fs.readFile('./views/pinglun.html', function(error, data) {
            if (error) {
                return res.end('404 Not Found.')
            }
            res.end(data)
        })
    } else if (pathName === '/pinglun') {
        // res.end(JSON.stringify(urlObj.query))
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()
        urlObj.query.date = year + '年' + month + '月' + day + '日 ' + hour + ':' + minute + ':' + second
        items.push(urlObj.query)


        res.statusCode = 302
        res.setHeader('Location', '/')
        res.end()
    } else {
        fs.readFile('./views/404.html', function(error, data) {
            if (error) {
                return res.end('404 Not Found.')
            }
            res.end(data)
        })
    }
}).listen(3000, function() {
    console.log('Server is running...')
})