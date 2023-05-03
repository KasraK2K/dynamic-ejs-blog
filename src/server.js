const express = require('express')
const compression = require('compression')
const fs = require('fs')
const path = require('path')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(express.static('statics'))

const port = process.env.PORT || 8000
const serverAddress =
  process.env.NODE_ENV === 'production'
    ? 'firstdash.com'
    : process.env.NODE_ENV === 'development'
      ? 'dev.firstdash.com'
      : `http://localhost:${port}`

app.set('view engine', 'ejs')
app.set('views', './src/views/pages')

app.get('/', (req, res) => {
  const data = {
    title: 'App Page',
    app: {
      title: 'Application Page'
    },
    elements: [
      {
        component: 'hiro',
        configuration: {
          title: 'This is a Hiro!',
        },
      },
      {
        component: 'slider',
        configuration: {
          images: ['image_one', 'image_two', 'image_three'],
        },
      },
    ],
  }

  for (const element of data.elements) {
    const basePath = path.resolve(
      process.cwd(),
      `statics/vendors/${element.component}/${element.component}`
    )
    const baseAddress = `${serverAddress}/vendors/${element.component}/${element.component}`

    const stylePath = `${baseAddress}.css`
    const scriptPath = `${baseAddress}.js`

    if (fs.existsSync(`${basePath}.css`)) element.style = stylePath
    if (fs.existsSync(`${basePath}.js`)) element.script = scriptPath
  }

  res.render('app', data)
})

app.listen(port, () => console.log(`Server running on http://localhost:${port}`))