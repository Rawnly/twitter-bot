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
	tweet(status) {
		return new Promise((resolve, reject) => {
			if ( typeof status !== 'string' ) {
				reject(new SyntaxError(`Expected string. Got: ${typeof status}`));
			} else if ( status.length > 280 ) {
				reject(new Error(`Too many characters! ${status.length}/280`));
			}
	
			this.twit.post('statuses/update', { status }, (err, data, response) => {
				if ( err ) return reject(err);

				resolve(data, response);
			});
		});
	}

	// Delete posted tweet
	unTweet(id) {
		return new Promise((resolve, reject) => {
			this.twit.post('statuses/destroy', {id}, (err, data, response) => {
				if (err) return reject(err);
				resolve(data, response);
			});
		});
	}

	// Like a tweet
	like(id) {
		return new Promise((resolve, reject) => {
			this.twit.post('favorites/create', { id }, (err, data, response) => {
				if (err) return reject(err);
				resolve(data, response);
			});
		});
	}

	// Delete a like on a tweet
	disLike(id) {
		return new Promise((resolve, reject) => {
			this.twit.post('favorites/destroy', { id }, (err, data, response) => {
				if (err) return reject(err);
				resolve(data, response);
			});
		});
	}

	// Get all likes
	getLikes() {
		return new Promise((resolve, reject) => {
			this.twit.get('favorites/list', (err, data, response) => {
				if (err) return reject(err);
				resolve(data, response);
			});
		});
	}

	// UnRetweet
	unRetweet(id) {
		return new Promise((resolve, reject) => {
			this.twit.post('statuses/unretweet', { id }, (err, data, response) => {
				if (err) return reject(err);
				resolve(data, response);
			});
		});
	}

	// Retweet
	retweet(id) {
		return new Promise((resolve, reject) => {
			this.twit.post('statuses/retweet', { id }, (err, data, response) => {
				if (err) return reject(err);
				resolve(data, response);
			});
		});
	}

	// Search something
	search(q, callback, { lang = 'en', result_type = 'recent'} = {}) {
		return new Promise((resolve, reject) => {
			if ( typeof q !== 'string' ) return reject(new SyntaxError(`Expected string. Got: ${typeof status}`));
			this.twit.get('search/tweets', {q, lang, result_type}, (err, data, response) => {
				if (err) return reject(err);
				resolve(data, response);
			});
		});
	}

	// Follow specific user
	follow(id) {
		return new Promise((resolve, reject) => {
			this.twit.post('friendships/create', { id }, (err, data, response) => {
				if (err) return reject(err);
				resolve(data, response);
			});
		});
	}

	// Unfollow specific user
	unfollow(id) {
		return new Promise((resolve, reject) => {
			this.twit.post('friendships/destroy', { id }, (err, data, response) => {
				if (err) return reject(err);
				resolve(data, response);
			});
		});
	}

	// Get followers
	getFollowers() {
		return new Promise((resolve, reject) => {
			this.twit.get('followers/ids', (err, data, response) => {
				if (err) return reject(err);
				resolve(data, response);
			});
		});
	}

	// Get friends (people that YOU are following)
	getFriends() {
		return new Promise((resolve, reject) => {
			this.twit.get('friends/ids', (err, data, response) => {
				if (err) return reject(err);
				resolve(data, response);
			});
		});
	}

	// Check if someone is following you.
	isFollower(id) {
		return new Promise((resolve, reject) => {
			this.twit.get('followers/ids', {id}, (err, data, response) => {
				if (err) return reject(err);
				resolve(data, response);
			});
		});
	}

	// Unfollow all people that doesn't follows you. | Prune friends..
	prune() {
		return new Promise((resolve, reject) => {
			this.getFollowers((err, res) => {
				if (err) return reject(err);
				const followers = res.ids;
	
				this.getFriends((err, res) => {
					if (err) return reject(err);
					let unfollowed = [];
					let friends = res.ids;
	
					friends.forEach(user => {
						if ( !followers.includes(user) ) {
							unfollowed.push(user);
							this.unfollow(user);
						}
					});
	
					resolve(err, unfollowed);
				});
			});
		});
	}
}
