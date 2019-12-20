const express = require('express')
const next = require('next')
const qs = require('querystring')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

function parseUrl(url: string) {
  const p = /(^.+)($|\?)/.exec(url)
  const q = url.split('?')
  // console.log(q);
  console.log(p);

}
function main() {

  app.prepare().then(() => {
    const server = express()

    server.get('/:book/:chapter', (req, res) => {
      // console.log(req);
      // console.log(req);
      (parseUrl(req.url));
      // console.log(qs.parse(req.url));

      return app.render(req, res, '/[book]/[chapter]', req.query)
    })

    server.get('/b', (req, res) => {
      return app.render(req, res, '/b', req.query)
    })

    server.get('/posts/:id', (req, res) => {
      return app.render(req, res, '/posts', { id: req.params.id })
    })

    server.all('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, err => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })

}
main()

export {

};
