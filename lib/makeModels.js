require('dotenv').config()
const axios = require('axios')
const MeCab = new require('mecab-async')
const mecab = new MeCab()

async function makeModel() {
    try {
        const toots = await axios.get(
            `https://${BASE_URL}/api/v1/accounts/${process.env.FROM_ACCOUNTID}/statuses`,
            { headers: { Authorization: `Bearer ${process.env.FROM_ACCESSTOKEN}` } }
        )
        for(let tootObject of toots) {
            const status = tootObject.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'')
            const wakachiArr = mecab.wakachiSync(status)
            const wakachiStr = wakachiArr.join(' ')
            console.log(wakachiStr)
        }
    } catch(e) {
        console.error(e)
    }
}
makeModel()