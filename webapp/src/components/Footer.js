import React from 'react'

// ---

export const Footer = () => (
	<footer className='footer fixed-bottom' style={footerStyle}>
		<div className='container' style={{ textAlign: 'center' }}>
			<span className='text-muted'>© Simple Blog</span>
			<button
				style={{ marginLeft: '20px' }}
				className='btn btn-disabled'
				onClick={() => window.scrollTo(0, 0)}
			>
				&#128285;
			</button>
		</div>
	</footer>
)

const footerStyle = {
	width: '100%',
	height: '60px',
	lineHeight: '60px',
	backgroundColor: '#f5f5f5',
}
