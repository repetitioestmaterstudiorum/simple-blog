import React, { useContext, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Context } from '../DataState.js'
import { Loader } from '../components/Loader.js'

// ---

export const Post = ({ match }) => {
	const { posts, getPostsComments, comments } = useContext(Context)

	// get the right post based on the id parameter in the url
	const {
		params: { id },
	} = match
	const post = posts.find(p => p._id === id)

	useEffect(() => {
		window.scrollTo(0, 0)
		getPostsComments(id)
	}, [])

	const relevantComments = id && comments[id]

	return posts.length ? (
		<div className='container'>
			<img
				src={post.imageUrl}
				style={{ margin: '10px 0 30px', width: '-webkit-fill-available' }}
			/>
			<p>
				<strong>
					{post.author} // {new Date(post.createdAt).toLocaleDateString('de-ch')}
				</strong>
			</p>
			<h2>{post.title}</h2>
			<p>{post.text}</p>
			{post.commentsCount ? (
				<>
					<h3>Comments</h3>
					{relevantComments?.length ? (
						relevantComments.map(comment => (
							<Comment key={comment._id} comment={comment} />
						))
					) : (
						<Loader />
					)}
				</>
			) : null}
			<Homelink />
		</div>
	) : (
		<Loader />
	)
}

const Comment = ({ comment }) => (
	<p>
		<span>
			<strong>
				{comment.author} // {new Date(comment.createdAt).toLocaleDateString('de-ch')}
			</strong>
		</span>
		<span>
			{' '}
			<em>{comment.text}</em>
		</span>
	</p>
)

const Homelink = () => {
	const isOnHomeScreen = useLocation().pathname === '/'

	return (
		!isOnHomeScreen && (
			<div style={{ textAlign: 'center', padding: '1.5rem 0 2rem' }}>
				<Link to={'/'}>
					<button className='btn btn-outline-dark'>&#127968; Home</button>
				</Link>
			</div>
		)
	)
}
