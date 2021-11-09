import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import { Context } from '../DataState.js'
import { Loader } from '../components/Loader.js'

// ---

export const PostOverview = () => {
	const { posts } = useContext(Context)

	return posts?.length ? (
		<div className='container'>
			{posts.map(post => (
				<PostExcerpt key={post._id} post={post} />
			))}
		</div>
	) : (
		<Loader />
	)
}

export const PostExcerpt = ({ post }) => (
	<div className='row my-5'>
		<Link to={`/post/${post._id}`}>
			<div className='col-lg-6'>
				<LazyLoadImage
					alt={post.title}
					src={post.imageUrl}
					style={{ width: '-webkit-fill-available', float: 'left' }}
				/>
			</div>
			<div className='col-lg-6' style={{ float: 'right' }}>
				<div style={{ padding: '20px 20px 0' }}>
					<p>
						<strong>
							{new Date(post.createdAt).toLocaleDateString('de-ch')} //{' '}
							{post.commentsCount} comments
						</strong>
					</p>
					<h5>{post.title}</h5>
					<p className='small-p'>{post.text.substr(0, 200) + ' ...'}</p>
					<button className='btn btn-primary'>Read more...</button>
				</div>
			</div>
		</Link>
	</div>
)
