import TwitterBot from '..';

export default class CustomBot extends TwitterBot {
	// Like some tweets and follow who's posted it.
	randomFollowLikes(query, {lang = 'en', result_type = 'recent'} = {}) {
		let following = [];
		return new Promise((resolve, reject) => {
			Bot.log('START SCRAPING');
			Bot.search(query, (err, res) => {
				if (err) reject(err);
		
				const tweets = res.statuses;
		
				for(let i=0; i<3; i++) {
					const tweet = randomFrom(tweets);
					const user = {
						username: tweet.user.screen_name,
						id: tweet.user.id_str
					}
		
					Bot.like(tweet.id_str, err => {
						if (!err) {
							Bot.log(chalk`{red Liked:} ${tweet.id_str}`);
						}
	
						Bot.follow(tweet.user.id_str, (err, res) => {
							if (!err) {
								Bot.log(chalk`Started following: {cyan @${user.username}} ({yellow ${user.id}})`);
								following.push(user.id)
							}						
						});
					});
				}
	
				resolve(following);
			}, {
				lang, 
				result_type
			})
		})
	}
}

// USAGE EXAMPLE
//
// import config from '../config.json';
// const B = new CustomBot(config);
// B.randomFollowLikes('#nodejs #twitterbot')