require('dotenv').config()
const axios = require('axios')
const markovTwitter = require('node-markovify').markovTwitter
const fs = require('fs')
const options = {
    state_size:1,
    numTweetsToPredict: 1,
    popularFirstWord: true
}
const thisMarkovTwitter = new markovTwitter(options)

fs.readFile('model.txt','utf-8',function(err,text){
    options.tweets = text.split('\n')
    thisMarkovTwitter.generateMarkovTweets(options,function(toot){
        console.log(toot)
    })
})