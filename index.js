require('dotenv').config()
const toot = require('./lib/post.js')
const makeModel = require('./lib/makeModels.js')
toot.toot()
makeModel.makeModel()
setInterval(function () { toot.toot() }, process.env.TOOT_INTERVAL * 1000 ? process.env.TOOT_INTERVAL * 1000 : 1200 * 1000)
setInterval(function () { makeModel.makeModel() }, 3600 * 1000)