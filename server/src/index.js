const fs = require('fs')

const { C } = require('./constants.js')
const { db } = require('./db.js')
const { app } = require('./rest.js')

// ---

console.info(`--- Simple Blog: server started ---
Project path: ${process.cwd()}`)

// fill db with sample data from json files
db.posts = JSON.parse(fs.readFileSync(C.sampleData.postsFilePath, { encoding: 'utf8' }))
db.comments = JSON.parse(fs.readFileSync(C.sampleData.commentsFilePath, { encoding: 'utf8' }))

// start the rest endpoint
app.listen(C.api.port, () => console.info(`Express is listening on http://localhost:${C.api.port}`))
