require('dotenv').config()
const axios = require('axios')
const MeCab = new require('mecab-async')
const mecab = new MeCab()
const fs = require('fs')

const makeModel = async function() {
    let old = 0
    try {
        old = fs.readFile('latest')
    } catch {}
    try {
        const tootsRaw = await axios.get(
            `https://${process.env.DOMAIN}/api/v1/accounts/${process.env.FROM_ACCOUNTID}/statuses?since_id=${old}`,
            { headers: { Authorization: `Bearer ${process.env.FROM_ACCESSTOKEN}` } }
        )
        let output = ''
        const toots = tootsRaw.data
        if (!toots.length) return false
        const latest = toots[0].id
        for(let tootObject of toots) {
            const status = tootObject.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'').replace(/((https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+))/, '')
            const wakachiArr = mecab.wakachiSync(status)
            const wakachiStr = wakachiArr.join(' ')
            output = output + "\n" + wakachiStr
        }
        fs.appendFileSync('model.txt', output)
        fs.writeFileSync('latest', latest)
    } catch(e) {
        console.error(e)
    }
}
exports.makeModel = makeModel