import fs from 'node:fs/promises'
import express from 'express'
import { renderToString } from 'react-dom/server';
//
import SsrTop from '../src/SsrTop';
// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

const ssrHtml = SsrTop();
//console.log(ssrHtml);
// Cached production assets
const templateHtml = isProduction
  ? ssrHtml
  : '';
//
import testRouter from './api/test';

console.log(".NODE_ENV =", process.env.NODE_ENV);
// Create http server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//
// API
app.use('/api/test', testRouter);
// Add Vite or respective production middlewares
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base
  })
  app.use(vite.middlewares)
} else {
  app.use(express.static('public'));
}

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    let template
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    } else {
      template = templateHtml
      render = (await import('./server/entry-server.js')).render
    }
    const rendered = await render();
    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
