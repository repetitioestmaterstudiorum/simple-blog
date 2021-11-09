// in-memory database
const db = {
	posts: [],
	comments: [],
}

// ---

// database access and modification functions
function getPosts({ postId } = {}) {
	return postId
		? [db.posts.find(p => p._id === postId && !p.deleted)]
		: db.posts.filter(p => !p.deleted)
}

function getComments({ postId }) {
	return db.comments.filter(c => c.postId === postId && !c.deleted)
}

function addComment({ comment }) {
	if (!comment) return console.error(`addComment() called without comment`)
	db.comments.push(comment)

	// update commentsCount on post (increase by 1)
	const postIndex = db.posts.findIndex(p => p._id === comment.postId)
	if (postIndex > -1) db.posts[postIndex].commentsCount += 1

	console.info(`addComment(): added comment with id ${comment._id}`)
	return true
}

function updateComment({ commentId, updatedComment }) {
	if (!commentId || !updatedComment) return console.error(`updateComment() is missing arguments`)

	const index = db.comments.findIndex(c => c._id === commentId)
	if (index > -1) {
		db.comments[index] = updatedComment
		console.info(`updateComment(): updated comment with id ${commentId}`)
		return true
	} else {
		console.error(`updateComment(): comment with id ${commentId} not found!`)
		return false
	}
}

// ---

module.exports = { db, getPosts, getComments, addComment, updateComment }
