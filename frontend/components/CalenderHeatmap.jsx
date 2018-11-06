// React
import React from 'react';
import PropTypes from 'prop-types';

// components
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';

// styles
import 'react-calendar-heatmap/dist/styles.css';

const getMergedContributionData = (github, gitlab) => {
  const mergedData = [];
  github.forEach((githubData, i) => {
    mergedData.push({
      date: githubData.date,
      count: githubData.count + gitlab[i].count
    });
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
  return (
    <div>
      <CalendarHeatmap
        startDate={props.github[0].date}
        endDate={props.github[props.github.length - 1].date}
        values={getMergedContributionData(props.github, props.gitlab)}
        classForValue={value => assignClassByValue(value)}
        tooltipDataAttrs={value => ({
          'data-tip': `${value.date} has count: ${value.count}`
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
