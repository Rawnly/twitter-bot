import Twit from 'twit';
import chalk from 'chalk';

export default class TwitterBot {
	constructor(config) {
		this.twit = new Twit(config);
		this.getConfig = this.twit.getAuth;
	}

	log(...str) {
		str = str.map(string => {
			if ( typeof string == 'string' ) {
				return chalk`{dim ${string}}`;
			}

			return string;
		});

		str.unshift(chalk`{green {bold BOT:}}`);
		
		console.log.apply(this, str);
	}

	info(...str) {
		str = str.map(string => {
			if ( typeof string == 'string' ) {
				return chalk`{dim ${string}}`;
			}

			return string;
		});

		str.unshift(chalk`{blue {bold BOT:}}`);
		
		console.log.apply(this, str);
	}

	warn(...str) {
		str = str.map(string => {
			if ( typeof string == 'string' ) {
				return chalk`{dim ${string}}`;
			}

			return string;
		});

		str.unshift(chalk`{yellow {bold BOT:}}`);
		
		console.log.apply(this, str);
	}

	error(...str) {
		str = str.map(string => {
			if ( typeof string == 'string' ) {
				return chalk`{dim ${string}}`;
			}

			return string;
		});

		str.unshift(chalk`{red {bold BOT:}}`);
		
		console.log.apply(this, str);
	}
	
	// Tweet a new status
	tweet(status, callback) {
		if ( typeof status !== 'string' ) {
			callback(new SyntaxError(`Expected string. Got: ${typeof status}`))
		} else if ( status.length > 280 ) {
			callback(new Error(`Too many characters! ${status.length}/280`))
		}

		this.twit.post('statuses/update', { status }, callback);
	}

	// Delete posted tweet
	unTweet(id, callback) {
		this.twit.post('statuses/destroy', {id}, callback);
	}

	// Like a tweet
	like(id, callback) {
		this.twit.post('favorites/create', { id }, callback);
	}

	// Delete a like on a tweet
	disLike(id, callback) {
		this.twit.post('favorites/destroy', { id }, callback);
	}

	// Get all likes
	getLikes(callback) {
		this.twit.get('favorites/list', callback);
	}

	// UnRetweet
	unRetweet(id, callback) {
		this.twit.post('statuses/unretweet', { id }, callback);
	}

	// Retweet
	retweet(id) {
		if ( typeof status !== 'string' ) return callback(new SyntaxError(`Expected string. Got: ${typeof status}`))
		if ( status.length > 280 ) return	callback(new Error(`Too many characters! ${status.length}/280`))

		this.twit.post('statuses/retweet', { id }, callback);
	}

	// Search something
	search(q, callback, { lang = 'en', result_type = 'recent'} = {}) {
		if ( typeof q !== 'string' ) return callback(new SyntaxError(`Expected string. Got: ${typeof status}`))
		this.twit.get('search/tweets', {q, lang, result_type}, callback);
	}

	// Follow specific user
	follow(id, callback) {
		this.twit.post('friendships/create', { id }, callback)
	}

	// Unfollow specific user
	unfollow(id, callback) {
		this.twit.post('friendships/destroy', { id }, callback)
	}

	// Get followers
	getFollowers(callback) {
		this.twit.get('followers/ids', callback);
	}

	// Get friends (people that YOU are following)
	getFriends(callback) {
		this.twit.get('friends/ids', callback);
	}

	// Check if someone is following you.
	isFollower(id, callback) {
		this.twit.get('followers/ids', (err, res) => {
			if ( err ) return callback(err);

			callback(err, res.ids.includes(id));
		})
	}

	// Unfollow all people that doesn't follows you. | Prune friends..
	prune(callback) {
		this.getFollowers((err, res) => {
			if (err) return callback(err);
			const followers = res.ids;

			this.getFollowers((err, res) => {
				if (err) return callback(err);
				let unfollowed = [];

				friends.forEach(user => {
					if ( !followers.includes(user) ) {
						unfollowed.push(user);
						this.unfollow(user);
					}
				})

				callback(err, unfollowed);
			})
		})
	}
}
