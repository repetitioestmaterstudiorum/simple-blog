import React from 'react'
import { Link } from 'react-router-dom'

// ---

export const FourOFour = () => (
	<div className='container'>
		<h2>404</h2>
		<p>It's sad but true: this page doesn't exist here!</p>
		<Link to={'/'}>
			<button className='btn btn-outline-primary'>&#127968; Home</button>
		</Link>
	</div>
)
