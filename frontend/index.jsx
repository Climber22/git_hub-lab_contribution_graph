// React
import React from 'react';
import ReactDom from 'react-dom';

// components
import AccountNameForm from './components/AccountNameForm.jsx';
import CalenderHeatmap from './components/CalenderHeatmap.jsx';

// others
import axios from 'axios';
import moment from 'moment';

export default class App extends React.Component {
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
      }
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
      }
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
      <div>
        <AccountNameForm
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          {...this.state.accountName}
        />
        <CalenderHeatmap {...this.state.contributionDataList} />)
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('app'));
