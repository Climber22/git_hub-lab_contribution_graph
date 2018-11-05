// React
import React from 'react';
import ReactDom from 'react-dom';

// components
import AccountNameForm from './components/AccountNameForm.jsx';
import CalenderHeatmap from './components/CalenderHeatmap.jsx';

// others
import axios from 'axios';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountName: {
        github: '',
        gitlab: ''
      },
      contributionData: {
        github: [],
        gitlab: []
      },
      isContributionDataLoaded: false
    };
  }

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
      contributionData: { ...res.data },
      isContributionDataLoaded: true
    });
  };

  render() {
    return (
      <div>
        <AccountNameForm
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          {...this.state.accountName}
        />
        {this.state.isContributionDataLoaded ? (
          <CalenderHeatmap {...this.state.contributionData} />
        ) : null}
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('app'));
