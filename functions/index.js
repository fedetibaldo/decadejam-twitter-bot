const functions = require('firebase-functions');

const Twitter = require('twitter');
const auth = require('./twitter-auth.json');

exports.searchAndRetweet = functions.pubsub.schedule('every 15 minutes').onRun(searchAndRetweet);

async function searchAndRetweet() {
	const client = new Twitter(auth);
	let tweets = await client.get('search/tweets', { q: '#decadejam', result_type: 'recent', tweet_mode: 'extended' });
	tweets = tweets.statuses.filter(tweet => tweet.entities.hashtags.some(hashtag => hashtag.text.toLowerCase() == 'decadejam'));
	tweets = tweets.filter(tweet => !tweet.retweeted_status || tweet.is_quote_status);
	tweets.forEach(async (tweet) => {
		try {
			await client.post(`statuses/retweet/${tweet.id_str}`, {})
		} catch (error) {
			// code: 327, message: 'You have already retweeted this Tweet.'
		}
	});
}
