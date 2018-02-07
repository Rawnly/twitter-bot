import 'babel-polyfill';
import TwitterBot from '..';
import config from 'build/config.json';
import chalk from 'chalk';
import Conf from 'conf';
import ms from 'ms';

const storage = new Conf();
const Bot = new TwitterBot(config);

if ( !storage.has('following') ) {
	Bot.log('Creating the list');
	storage.set('following', []);
}



// TWITTER BOT
setInterval(followAndLikeRandomPeople, ms('2 hours'));



function followAndLikeRandomPeople(query, {lang = 'en', result_type = 'recent'} = {}) {
	let following = storage.get('following');
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
							storage.set('following', following);
						}						
					});
				});
			}

			resolve(following);
		}, {lang, result_type})
	})

	return storage.get('following');
}

function randomFrom(arr) {
	if (!Array.isArray(arr)) throw new SyntaxError('Expected array, given: ' + typeof arr);
	return arr[Math.floor(Math.random()*arr.length)]
}