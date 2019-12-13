import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import Dashboard from './src/containers/Dashboard/dashboard';
import Pending from './src/containers/Employee/pending';
import Approved from './src/containers/Employee/approved';
import Rejected from './src/containers/Employee/rejected';
import Sattled from './src/containers/Employee/sattled';
import TokenExpireWaring from './src/containers/Common/tokenExpireWarning.js';
import Loading from './src/containers/Common/loading';


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
						<Route exact path='/' component={Dashboard} />
						<Route path="/dashboard" component={Dashboard} />
						<Route path="/pending" component={Pending} />
						<Route path="/sattled" component={Sattled} />
						<Route path="/rejected" component={Rejected} />
						<Route path="/approved" component={Approved} />




					</Switch>
				</div>
			</Router >

		)
	}
}
