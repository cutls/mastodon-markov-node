require('dotenv').config()
const axios = require('axios')
const MeCab = new require('mecab-async')
const mecab = new MeCab()
const fs = require('fs')

const makeModel = async function () {
    let old = 0
    try {
        old = fs.readFileSync(__dirname + '/latest.txt', 'utf-8')
    } catch { }
    console.log(old)
    try {
        const tootsRaw = await axios.get(
            `https://${process.env.DOMAIN}/api/v1/accounts/${process.env.FROM_ACCOUNTID}/statuses?since_id=${old}&limit=40`,
            { headers: { Authorization: `Bearer ${process.env.FROM_ACCESSTOKEN}` } }
        )
        let output = ''
        let toots = tootsRaw.data
        if (!toots.length) return false
        const latest = toots[0].id
        if (toots.length === 40) {
            for(let i = 0; i <= 4; i++) {
                const againRaw = await axios.get(
                    `https://${process.env.DOMAIN}/api/v1/accounts/${process.env.FROM_ACCOUNTID}/statuses?max_id=${toots[toots.length - 1].id}&limit=40`,
                    { headers: { Authorization: `Bearer ${process.env.FROM_ACCESSTOKEN}` } }
                )
                const again = againRaw.data
                toots = toots.concat(again)
            }
        }
        console.log(toots.length)
        for (let tootObject of toots) {
            if(tootObject.reblog) continue
            if(tootObject.visibility != 'public') continue
            const status = tootObject.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').replace(/((https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+))/, '')
            const wakachiArr = mecab.wakachiSync(status)
            const wakachiStr = wakachiArr.join(' ')
            output = output + "\n" + wakachiStr
        }
        fs.appendFileSync(__dirname + '/model.txt', output)
        fs.writeFileSync(__dirname + '/latest.txt', latest)
    } catch (e) {
        console.error(e)
    }
}
exports.makeModel = makeModel