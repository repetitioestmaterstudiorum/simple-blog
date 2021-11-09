const { db, getPosts, getComments, addComment, updateComment } = require('../src/db.js')

// ---

describe('Unit tests for db.js', () => {
	const timeStamp = new Date()
	const samplePosts = [
		{
			_id: '1',
			title: 'test title',
			text: 'some text here',
			author: 'poet',
			imageUrl: 'https://picsum.photos/200/100',
			commentsCount: 2,
			createdAt: timeStamp,
			updatedAt: timeStamp,
		},
		{
			_id: '2',
			title: 'super title',
			text: 'best text here',
			author: 'max',
			imageUrl: 'https://picsum.photos/300/200',
			commentsCount: 1,
			createdAt: timeStamp,
			updatedAt: timeStamp,
		},
	]
	const sampleComments = [
		{
			_id: '1',
			postId: '1',
			text: 'lorem dolor ipsum',
			author: 'poet',
			createdAt: timeStamp,
			updatedAt: timeStamp,
		},
		{
			_id: '2',
			postId: '1',
			text: 'lorem ipsum',
			author: 'maximus',
			createdAt: timeStamp,
			updatedAt: timeStamp,
		},
		{
			_id: '3',
			postId: '2',
			text: 'jestum scriptum',
			author: 'aurelius',
			createdAt: timeStamp,
			updatedAt: timeStamp,
		},
	]

	test('all functions are defined', () => {
		expect(getPosts).toBeDefined()
		expect(getComments).toBeDefined()
		expect(addComment).toBeDefined()
		expect(updateComment).toBeDefined()
	})

	test('db contains posts and comments arrays that are initially empty', () => {
		expect(db.posts).toEqual([])
		expect(db.comments).toEqual([])
	})

	test('getPosts() - one post or all', () => {
		// add sample data to db
		db.posts = samplePosts

		// get one post
		const onePost = getPosts({ postId: '1' })
		expect(onePost.length).toBe(1)
		expect(onePost[0]).toEqual(samplePosts[0])

		// get all posts
		const allPosts = getPosts()
		expect(allPosts.length).toBe(samplePosts.length)
		expect(allPosts).toEqual(samplePosts)

		// cleanup
		db.posts = []
	})

	test('getComments() by postId', () => {
		// add sample data to db
		db.comments = sampleComments

		const comments = getComments({ postId: '1' })
		expect(comments.length).toBe(2)
		expect(comments).toEqual([
			{
				_id: '1',
				postId: '1',
				text: 'lorem dolor ipsum',
				author: 'poet',
				createdAt: timeStamp,
				updatedAt: timeStamp,
			},
			{
				_id: '2',
				postId: '1',
				text: 'lorem ipsum',
				author: 'maximus',
				createdAt: timeStamp,
				updatedAt: timeStamp,
			},
		])

		// providing no postId should return undefined
		let undefinedTimes = 0
		try {
			getComments()
		} catch (err) {
			undefinedTimes++
		}
		expect(undefinedTimes).toBe(1)

		// cleanup
		db.comments = []
	})

	test('addComment', () => {
		// ensure db comments emptyness
		expect(db.comments.length).toBe(0)

		addComment({ comment: sampleComments[0] })
		expect(db.comments.length).toBe(1)
		expect(db.comments[0]).toEqual(sampleComments[0])

		// ensure adding a comment increases the post's commentsCount
		db.posts = samplePosts
		db.comments = sampleComments
		expect(db.posts[0].commentsCount).toBe(2)
		const addCommentRes = addComment({ comment: sampleComments[0] })
		expect(db.posts[0].commentsCount).toBe(3)
		expect(addCommentRes).toBe(true)

		// cleanup
		db.posts = []
		db.comments = []
	})

	test('updateComment()', () => {
		// add sample data to db
		db.posts = samplePosts
		db.comments = sampleComments

		// providing no commentId and no updatedComment should return undefined
		let undefinedTimes = 0
		try {
			updateComment()
		} catch (err) {
			undefinedTimes++
		}

		// updating a comment
		const newComment = {
			_id: '1',
			postId: '1',
			text: 'lorem dolor ipsum',
			author: 'another poet',
			createdAt: timeStamp,
			updatedAt: timeStamp,
		}
		updateComment({
			commentId: '1',
			updatedComment: newComment,
		})

		expect(db.comments[0]).toEqual(newComment)

		// cleanup
		db.posts = []
		db.comments = []
	})
})
