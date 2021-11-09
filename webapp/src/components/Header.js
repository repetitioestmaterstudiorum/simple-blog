import React from 'react'
import { Link } from 'react-router-dom'

// ---

export const Header = () => (
	<div className='container' id='header'>
		<h1>
			<Link to={'/'}>Simple Blog</Link>
		</h1>
		<p>by Thomas Tanner</p>
	</div>
)
