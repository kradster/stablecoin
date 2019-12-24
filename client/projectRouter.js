import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";

import TokenExpireWaring from './src/containers/Common/tokenExpireWarning.js';
import Loading from './src/containers/Common/loading';
import AbiMethods from './src/containers/abi/AbiMethods';


var JWT = require('jsonwebtoken');

const history = createHistory();

export default class ProjectRouter extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userData: ''
		};

	}
	componentWillMount() {
		if (sessionStorage.getItem('userData') !== null) {
			let tempData = JSON.parse(sessionStorage.getItem('userData'));
			this.setState({ userData: tempData.userData });
		}
	}

	componentDidMount(){
		var decoded = localStorage.JWT_TOKEN !== undefined ?  JWT.decode(localStorage.getItem('JWT_TOKEN')).role : ''
	}

	render() {
		return (


			<Router history={history}>
				<div className="row mrbt">
				<Loading/>
					<TokenExpireWaring/>
					<Switch>
						<Route exact path='/' component={AbiMethods} />
						
						<Route path="/abi" component={AbiMethods} />




					</Switch>
				</div>
			</Router >

		)
	}
}
