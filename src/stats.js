const fs     = require('fs')
const path   = require('path')
const byline = require('byline')

const DATA_DIR = 'data/xyz'

let xmax = -Infinity
let ymax = -Infinity
let zmax = -Infinity

let xmin = Infinity
let ymin = Infinity
let zmin = Infinity

let files = fs.readdirSync(DATA_DIR)
files = files
  .filter(f => { return path.extname(f) == '.xyz' })
  .map(f => { return path.join(DATA_DIR, f) })

const fileList = files.slice()

function process() {
  var stream = byline(fs.createReadStream(fileList.shift(), { encoding: 'utf8' }))

  stream.on('data', d => {
    [x, y, z] = d.split(' ').map(parseFloat)
    if(x > xmax) xmax = x
    if(y > ymax) ymax = y
    if(z > zmax) zmax = z
    if(x < xmin) xmin = x
    if(y < ymin) ymin = y
    if(z < zmin) zmin = z
  })

  stream.on('end', () => {
    if(fileList.length > 0) {
      process()
    } else {
      // console.log(xmax, xmin, ymax, ymin, zmax, zmin);
      fs.writeFileSync('stats.json', JSON.stringify({
        files: files,
        x: [xmin, xmax],
        y: [ymin, ymax],
        z: [zmin, zmax]
      }))
    }
  })
}

process()
