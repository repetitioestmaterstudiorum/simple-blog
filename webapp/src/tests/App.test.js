import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { App } from '../App.js'

// ---

test('Shows "Simple Blog" twice on the page', () => {
	render(<App />)
	const linkElement = screen.queryAllByText(/Simple Blog/)
	expect(linkElement.length).toBe(2)
})
