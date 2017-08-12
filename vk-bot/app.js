'use strict';

const { Caster } = require('@castery/caster');
const { VKPlatform } = require('@castery/caster-vk');

const bot = new Caster;
const platform = new VKPlatform({
	isGroup: true,
	adapter: {
		token: '<token here>'
	}
});

bot.use(platform);

bot.start()
.then(() => {
	console.log('Bot started!');
})
.catch((error) => {
	console.error('Error starting bot!', error);
});

bot.incoming.use({
	name: 'raw-logger',

	async handler(context, next) {
		await next();

		console.log(context);
	}
});

bot.outcoming.use({
	name: 'add-counter-to-text',

	async handler(context, next) {
		if (context.type !== 'message') {
			return await next();
		}

		if (!context.text) {
			context.text = '';
		}

		context.text += `\n\nCounter: ${sessions.get(context.sender.id).counter}`;

		await next();
	}
});

const sessions = new Map;

bot.incoming.use({
	name: 'user-session',

	async handler(context, next) {
		if (!sessions.has(context.sender.id)) {
			const session = {};

			context.session = session;
			sessions.set(context.sender.id, session);
		} else {
			context.session = sessions.get(context.sender.id);
		}

		await next();
	}
});

bot.incoming.use({
	name: 'my-counter',

	async handler(context, next) {
		const { session } = context;

		if (!('counter' in session)) {
			session.counter = 0;
		}

		session.counter += 1;

		await next();
	}
});

bot.hear(/hi/i, async (context, next) => {
	await context.send('Hi!');
});

bot.hear(/\/cat/i, async (context, next) => {
	await context.send({
		attachments: [
			{
				type: 'image',
				source: 'http://lorempixel.com/output/cats-q-c-640-480-1.jpg'
			}
		]
	});
});
