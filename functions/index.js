const functions = require('firebase-functions');

const Twitter = require('twitter');
const auth = require('./twitter-auth.json');

exports.searchAndRetweet = functions.pubsub.schedule('every 15 minutes').onRun(searchAndRetweet);

async function searchAndRetweet() {
	const client = new Twitter(auth);
	let tweets = await client.get('statuses/home_timeline', { tweet_mode: 'extended' });
	tweets = tweets.filter(tweet => tweet.entities.hashtags.some(hashtag => hashtag.text.toLowerCase() == 'decadejam'));
	tweets = tweets.filter(tweet => !tweet.retweeted);
	tweets.forEach(tweet => client.post(`statuses/retweet/${tweet.id_str}`, {}));
}
