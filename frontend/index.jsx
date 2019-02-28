// React
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// components
import App from './components/App.jsx';

// others
import axios from 'axios';
import moment from 'moment';

export default class AppRouter extends React.Component {
  constructor(props) {
    super(props);

    const defaultContributionDataList = this.getDefaultContributionDataList();

    this.state = {
      accountName: {
        github: '',
        gitlab: ''
      },
      contributionDataList: {
        github: defaultContributionDataList,
        gitlab: defaultContributionDataList
      },
      loading: false
    };
  }

  getDefaultContributionDataList = () => {
    const date = moment()
      .subtract(1, 'years')
      .subtract(1, 'days');

    const defaultValue = [];
    while (date.diff(moment(), 'days') !== 0) {
      defaultValue.push({ date: date.format('YYYY-MM-DD'), count: 0 });
      date.add(1, 'days');
    }
    return defaultValue;
  };

  handleChange = (e, { name, value }) => {
    const accountName = { ...this.state.accountName };
    accountName[name] = value;
    this.setState({ accountName });
  };

  handleSubmit = async () => {
    this.setState({ loading: true });
    const res = await axios.get('http://localhost:8080', {
      params: { ...this.state.accountName }
    });

    this.setState({
      contributionDataList: {
        github: this.updateContributionDataList(
          [...this.state.contributionDataList.github],
          res.data.github
        ),
        gitlab: this.updateContributionDataList(
          [...this.state.contributionDataList.gitlab],
          res.data.gitlab
        )
      },
      loading: false
    });
  };

  updateContributionDataList(dataList, newDataList) {
    if (newDataList !== null) {
      newDataList.forEach(newData => {
        const index = dataList.findIndex(
          prevData => prevData.date === newData.date
        );
        dataList[index] = { ...newData };
      });
    }
    return dataList;
  }

  render() {
    return (
      <Router>
        <Route path="/" component={App} />
      </Router>
    );
  }
}

ReactDom.render(<AppRouter />, document.getElementById('app'));
