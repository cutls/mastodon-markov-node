require('dotenv').config()
const axios = require('axios')
const markovTwitter = require('node-markovify').markovTwitter
const fs = require('fs')
const options = {
    state_size: 1,
    numTweetsToPredict: 1,
    popularFirstWord: true
}
const thisMarkovTwitter = new markovTwitter(options)
const toot = function () {
    fs.readFile('node_modules/node-markovify/examples/text/twitter-nflSundayTicket.txt', 'utf-8', function (err, text) {
        options.tweets = text.split('\n')
        thisMarkovTwitter.generateMarkovTweets(options, async function (toots) {
            console.log(toots)
            const toot = toots[0]
            try {
                if (!toot) return
                await axios.post(
                    `https://${process.env.DOMAIN}/api/v1/statuses`,
                    { status: toot.replace(' ', '') + ' #bot', visibility: 'unlisted' },
                    { headers: { Authorization: `Bearer ${process.env.TO_ACCESSTOKEN}` } }
                )
            } catch { }
        })
    })
}

exports.toot = toot