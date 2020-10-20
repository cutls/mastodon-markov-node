require('dotenv').config()
const axios = require('axios')
const markovTwitter = require('node-markovify').markovTwitter
const fs = require('fs')
const options = {
    state_size: 2,
    numTweetsToPredict: 1,
    popularFirstWord: false
}
const thisMarkovTwitter = new markovTwitter(options)
const toot = function () {
    fs.readFile(__dirname + '/model.txt', 'utf-8', function (err, text) {
        options.tweets = text.split('\n')
        thisMarkovTwitter.generateMarkovTweets(options, async function (toots) {
            const toot = [...new Set(toots)].join('。')
            try {
                if (!toot) return
                await axios.post(
                    `https://${process.env.DOMAIN}/api/v1/statuses`,
                    { status: toot.replace(/\s/g, '') + ' #bot', visibility: 'unlisted' },
                    { headers: { Authorization: `Bearer ${process.env.TO_ACCESSTOKEN}` } }
                )
            } catch { }
        })
    })
}

exports.toot = toot