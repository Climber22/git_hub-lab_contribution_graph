// React
import React from 'react';
import ReactDom from 'react-dom';

// components
import AccountNameForm from './components/AccountNameForm.jsx';
import CalenderHeatmap from './components/CalenderHeatmap.jsx';
import ExportButton from './components/ExportButton.jsx';

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
      <div style={{ margin: '0 10vw' }}>
        <CalenderHeatmap {...this.state.contributionDataList} />
        <AccountNameForm
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          loading={this.state.loading}
          {...this.state.accountName}
        />
        <ExportButton {...this.state.accountName} />
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('app'));
