import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { DataState } from './DataState.js'
import { PostOverview } from './pages/PostOverview.js'
import { Post } from './pages/Post.js'
import { FourOFour } from './pages/404.js'
import { Header } from './components/Header.js'
import { Footer } from './components/Footer.js'

// ---

export const Routes = () => {
	return (
		<Router>
			<>
				<Header />
				<DataState>
					<Switch>
						<Route exact path='/' component={PostOverview} />
						<Route exact path='/post/:id' component={Post} />
						<Route component={FourOFour} />
					</Switch>
				</DataState>
				<Footer />
			</>
		</Router>
	)
}
