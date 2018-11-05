// React
import React from 'react';
import PropTypes from 'prop-types';

// components
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';

// styles
import 'react-calendar-heatmap/dist/styles.css';

const sortByDate = contributionData => {
  return contributionData.sort((a, b) => new Date(a.date) - new Date(b.date));
};

const getOldestDate = (github, gitlab) => {
  const githubOldestDate = new Date(github[0].date);
  const gitlabOldestDate = new Date(gitlab[0].date);
  return githubOldestDate < gitlabOldestDate
    ? githubOldestDate
    : gitlabOldestDate;
};

const getLatedtDate = (github, gitlab) => {
  const githubLatestDate = new Date(github[github.length - 1].date);
  const gitlabLatestDate = new Date(gitlab[gitlab.length - 1].date);
  return githubLatestDate > gitlabLatestDate
    ? githubLatestDate
    : gitlabLatestDate;
};

const getMergedContributionData = (github, gitlab) => {
  const mergedData = [];
  [...github, ...gitlab].forEach(data => {
    const sameDateDataIndex = mergedData.findIndex(
      ele => ele.date === data.date
    );

    sameDateDataIndex !== -1
      ? (mergedData[sameDateDataIndex].count =
          mergedData[sameDateDataIndex].count + data.count)
      : mergedData.push(data);
  });
  return mergedData;
};

const assignClassByValue = value => {
  if (!value) {
    return 'color-empty';
  }
  if (value.count === 0) {
    return 'color-github-0';
  } else if (value.count >= 1 && value.count < 7) {
    return 'color-github-1';
  } else if (value.count >= 7 && value.count < 14) {
    return 'color-github-2';
  } else if (value.count >= 14 && value.count < 21) {
    return 'color-github-3';
  } else if (value.count >= 21) {
    return 'color-github-4';
  }
};

export default function CalenderHeatmap(props) {
  const github = sortByDate(props.github);
  const gitlab = sortByDate(props.gitlab);

  return (
    <div>
      <CalendarHeatmap
        startDate={getOldestDate(github, gitlab)}
        endDate={getLatedtDate(github, gitlab)}
        values={getMergedContributionData(github, gitlab)}
        classForValue={value => assignClassByValue(value)}
        tooltipDataAttrs={value => ({
          'data-tip': `${value.date.slice(0, 10)} has count: ${value.count}`
        })}
      />
      <ReactTooltip />
    </div>
  );
}

CalenderHeatmap.propTypes = {
  github: PropTypes.array,
  gitlab: PropTypes.array
};
