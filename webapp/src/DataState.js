import React, { useState, useEffect, createContext } from 'react'
import axios from 'axios'

// ---

export const Context = createContext()

export const DataState = ({ children }) => {
	const [posts, setPosts] = useState([])
	const [comments, setComments] = useState({})

	// load posts from the backend
	useEffect(() => getAllPosts(), [])
	const getAllPosts = async () => {
		try {
			const { data } = await axios.get('/api/posts')
			setPosts(data)
		} catch (err) {
			console.error(err)
		}
	}

	// logic for posts
	const getPostsComments = async postId => {
		const newComments = await axios.get(`/api/comments/${postId}`)
		setComments({ ...comments, [postId]: newComments?.data || [] })
	}

	return (
		<Context.Provider value={{ posts, getPostsComments, comments }}>
			{children}
		</Context.Provider>
	)
}
