https://github.com/naaaaaaaaaaaf/mastodon-markov-bot

のnode.js版です。

.env.sampleを.envにして`yarn build`、`yarn start`でOK。

### いるもの

* `mecab`が通る環境
* Node.js (v12で確認)とyarn

### .env

```
DOMAIN = cutls.com
FROM_ACCOUNTID = 1 # WebUIとかでユーザーのカラムを開いた時のURLなんかでわかる。Adminなら1が多い？
FROM_ACESSTOKEN = # モデルになるユーザーのアクセストークン。
TO_ACCESSTOKEN = # トゥートする方のアクセストークン。
TOOT_INTERVAL = # トゥートする間隔(秒)。デフォルトは20分。
```