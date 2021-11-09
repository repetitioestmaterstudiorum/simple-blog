// constants used throughout the app
const C = {}

// ---

C.api = {
	port: process.env.PORT || '4000',
}

C.sampleData = {
	relativeSampeDataFolderPath: 'sample-data',
	postsFile: 'posts.json',
	commentsFile: 'comments.json',
	get sampleDataPath() {
		return `${__dirname}/${this.relativeSampeDataFolderPath}`
	},
	get postsFilePath() {
		return `${this.sampleDataPath}/${this.postsFile}`
	},
	get commentsFilePath() {
		return `${this.sampleDataPath}/${this.commentsFile}`
	},
}

// ---

module.exports = { C }
