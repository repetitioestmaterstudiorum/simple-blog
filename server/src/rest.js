const express = require('express')
const cors = require('cors')
const { hostname } = require('os')
const path = require('path')

const app = express()
const router = express.Router()

const { getPosts, getComments, addComment, updateComment } = require('./db.js')

// ---

// parse request body as JSON
router.use(express.json())

// log each request to /api/*
router.get('*', (req, res, next) => {
	console.info(`${req.method}: ${req.originalUrl} (${new Date().toUTCString()})`)
	next()
})

// list all posts
router.get('/posts/', (req, res) => {
	res.send(getPosts())
})

// get one post (by id)
router.get('/posts/:id', (req, res) => {
	const postId = req.params?.id
	if (postId) {
		res.send(getPosts({ postId }))
	} else {
		console.error(`GET /posts/:id called without id param`)
		res.status(400).send('Missing request parameter!')
	}
})

// list comments for specific post
router.get('/comments/:postId', (req, res) => {
	const postId = req.params?.postId
	if (postId) {
		res.send(getComments({ postId }))
	} else {
		console.error(`GET /comments/:postId called without postId param`)
		res.status(400).send('Missing request parameter!')
	}
})

// create a new comment
router.post('/comments/', (req, res) => {
	const comment = req.body
	if (comment) {
		addComment(comment)
		res.sendStatus(200)
	} else {
		console.error(`POST /comments/ called without req.body`)
		res.status(400).send('Missing request body!')
	}
})

// update an existing comment
router.put('/comments/:id', (req, res) => {
	const commentId = req.params?.id
	const updatedComment = req.body
	if (commentId && updatedComment) {
		updateComment({ commentId, updatedComment })
		res.sendStatus(200)
	} else {
		console.error(`PUT /comments/:id called without id param`)
		res.status(400).send('Missing request body or parameter!')
	}
})

// general error handling in case any functionality above throws an error
router.use((err, req, res, next) => {
	console.error(err.stack)
	// this could speed up support if an app user contacts us regarding an error
	const incidentCode = `${hostname()}-${Date.now()}`
	console.error(`Incident code: ${incidentCode}`)
	res.status(500).send(
		`Something went wrong :( If you contact support, send them this incident code: ${incidentCode}`
	)
})

// ---

// allow requests from other origins
app.use(cors())

// prepend /api for all server endpoints, handle routes of the above router
app.use('/api', router)

// serve static files of the webapp build
app.use(express.static(path.resolve(__dirname, '../../webapp/build')))
// handle all other get requests not handled before with the webapp build
app.get('*', (req, res, next) => {
	res.sendFile(path.resolve(__dirname, '../../webapp/build', 'index.html'))
})

// ---

module.exports = { app }
