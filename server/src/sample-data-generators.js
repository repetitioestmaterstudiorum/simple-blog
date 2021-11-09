const uuid4 = require('uuid4')
const loremIpsum = require('lorem-ipsum').loremIpsum
const axios = require('axios').default
const fs = require('fs')

const { C } = require('./constants.js')

// ---

const sampleDataGenerationConfig = {
	howManyPosts: 2,
	commentsPerPost: { min: 0, max: 15 },
	wordsPerSentence: { min: 3, max: 15 },
	sentencesPerPostTitle: { min: 1, max: 1 },
	sentencesPerPostText: { min: 30, max: 250 },
	sentencesPerCommentText: { min: 1, max: 10 },
	imageWidth: '1320',
	imageHeight: '816',
	extendIfExistingFiles: true,
	sampleDataPath: C.sampleData.sampleDataPath,
	postsFilePath: C.sampleData.postsFilePath,
	commentsFilePath: C.sampleData.commentsFilePath,
}

// generate data and save it to json files

async function generateSampleData({ config }) {
	const posts = getPosts({ config })
	const comments = posts.flatMap(p =>
		getComments({
			postId: p._id,
			commentsCount: p.commentsCount,
			config,
		})
	)
	await extendWithRandomImageUrls({ posts, config }).catch(err => console.error(err))
	return { posts, comments, config }
}
generateSampleData({ config: sampleDataGenerationConfig }).then(data => {
	const sampleDataPath = data.config.sampleDataPath
	console.log('sampleDataPath :>> ', sampleDataPath)
	ensurePathExists(sampleDataPath)

	// posts
	const postsFilePath = data.config.postsFilePath
	console.log('postsFilePath :>> ', postsFilePath)
	const posts = data.config.extendIfExistingFiles
		? [...JSON.parse(fs.readFileSync(postsFilePath)), ...data.posts]
		: data.posts
	fs.writeFileSync(postsFilePath, JSON.stringify(posts))

	// comments
	const commentsFilePath = data.config.commentsFilePath
	console.log('commentsFilePath :>> ', commentsFilePath)
	const comments = data.config.extendIfExistingFiles
		? [...JSON.parse(fs.readFileSync(commentsFilePath)), ...data.comments]
		: data.comments
	fs.writeFileSync(commentsFilePath, JSON.stringify(comments))
})

// posts and comments generators and function that resolves picsum urls to permanent image urls
function getPosts({ config }) {
	const { howManyPosts, sentencesPerPostTitle, sentencesPerPostText, commentsPerPost } = config
	const posts = []
	for (let i = 0; i < howManyPosts; i++) {
		const timeStamp = new Date()
		posts.push({
			_id: uuid4(),
			title: getSentences({
				sentencesRange: sentencesPerPostTitle,
				wordsPerSentence: config.wordsPerSentence,
			}),
			text: getSentences({
				sentencesRange: sentencesPerPostText,
				wordsPerSentence: config.wordsPerSentence,
			}),
			author: getAuthor(),
			imageUrl: `https://picsum.photos/${config.imageWidth}/${config.imageHeight}`, // will be replaced with permanent url when calling extendWithRandomImageUrls(), but in case posts are used before, this will work as well (but will show same image for each post)
			commentsCount: getRandomIntBetween(commentsPerPost),
			createdAt: timeStamp,
			updatedAt: timeStamp,
		})
	}
	return posts
}

function getComments({ postId, commentsCount, config }) {
	const comments = []
	for (let i = 0; i < commentsCount; i++) {
		const timeStamp = new Date()
		comments.push({
			_id: uuid4(),
			postId,
			author: getAuthor(),
			text: getSentences({
				sentencesRange: config.sentencesPerCommentText,
				wordsPerSentence: config.wordsPerSentence,
			}),
			createdAt: timeStamp,
			updatedAt: timeStamp,
		})
	}
	return comments
}

async function extendWithRandomImageUrls({ posts, config }) {
	const imageUrlPromises = Array(posts.length)
		.fill()
		.map(_ => axios.get(`https://picsum.photos/${config.imageWidth}/${config.imageHeight}`))
	await Promise.all(imageUrlPromises)
		.then(imageUrls =>
			imageUrls.forEach(
				(imageUrl, i) => (posts[i].imageUrl = imageUrl.request.res.responseUrl)
			)
		)
		.catch(err => console.error(err))
	return
}

// helpers
function getSentences({ sentencesRange, wordsPerSentence }) {
	let sentences = ''
	for (let i = 0; i < getRandomIntBetween(sentencesRange); i++) {
		const howManyWords = getRandomIntBetween(wordsPerSentence)
		sentences += `${loremIpsum(howManyWords)} `
	}
	return sentences
}

function getRandomIntBetween({ min, max }) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function getAuthor() {
	const oneWord = loremIpsum({ count: 1, units: 'words' })
	return oneWord.charAt(0).toUpperCase() + oneWord.slice(1)
}

function ensurePathExists(path) {
	if (!fs.existsSync(path)) fs.mkdirSync(path)
}
