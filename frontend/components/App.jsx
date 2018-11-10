// React
import React from 'react';
import PropTypes from 'prop-types';

// components
import AccountNameForm from './AccountNameForm.jsx';
import CalenderHeatmap from './CalenderHeatmap.jsx';
import ExportButton from './ExportButton.jsx';

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

  componentDidMount = async () => {
    const params = new URLSearchParams(this.props.location.search);
    const github = params.get('github');
    const gitlab = params.get('gitlab');

    this.setState({
      loading: true
    });

    const res = await axios.get('http://localhost:8080', {
      params: { github, gitlab }
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
      accountName: { github, gitlab },
      loading: false
    });
  };

  componentDidUpdate = async prevProps => {
    if (prevProps.location !== this.props.location) {
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
    }
  };

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
    const params = new URLSearchParams(this.props.location.search);
    params.set('github', this.state.accountName.github);
    params.set('gitlab', this.state.accountName.gitlab);
    this.props.history.push({
      search: params.toString()
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

App.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};
