// React
import React from 'react';
import PropTypes from 'prop-types';

// components
import { Button } from 'semantic-ui-react';

// others
import canvg from 'canvg';

export default class ExportButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  CANVAS_ID = 'download_canvas';

  createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', this.CANVAS_ID);
    canvas.style.width = width * 5;
    canvas.style.height = height * 5;
    canvas.style.display = 'none';
    document.querySelector('body').appendChild(canvas);
    return canvas;
  }

  setCssAsInline(svg) {
    const rectTags = svg.querySelectorAll('rect');
    [].forEach.call(rectTags, rect => {
      const fillColor = window.getComputedStyle(rect).getPropertyValue('fill');
      rect.style.fill = fillColor;
    });

    const textTags = svg.querySelectorAll('text');
    [].forEach.call(textTags, text => {
      const fillColor = window.getComputedStyle(text).getPropertyValue('fill');
      const fontSize = window
        .getComputedStyle(text)
        .getPropertyValue('font-size');
      text.style.fill = fillColor;
      text.style.fontSize = fontSize;
    });
  }

  handleClick() {
    this.setState({ loading: true });

    const svgEle = document.getElementsByClassName('react-calendar-heatmap')[0];
    const { width, height } = svgEle.getBoundingClientRect();
    this.setCssAsInline(svgEle);
    const svgEle2 = svgEle.cloneNode(true);

    svgEle2.setAttribute('width', width * 5);
    svgEle2.setAttribute('height', height * 5);
    const svgStr = new XMLSerializer().serializeToString(svgEle2);
    if (!document.getElementById(this.CANVAS_ID)) {
      this.createCanvas(width, height);
    }
    canvg(this.CANVAS_ID, svgStr);
    const canvas = document.getElementById(this.CANVAS_ID);

    const aTag = document.createElement('a');
    aTag.href = canvas.toDataURL('image/png');
    aTag.download = `github_${this.props.github}_gitlab_${this.props.gitlab}`;
    const clickEvent = document.createEvent('MouseEvent');
    clickEvent.initEvent(
      'click',
      true,
      true,
      window,
      1,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    aTag.dispatchEvent(clickEvent);
    this.setState({ loading: false });
  }

  render() {
    return (
      <Button loading={this.state.loading} onClick={() => this.handleClick()}>
        Export as PNG
      </Button>
    );
  }
}

ExportButton.propTypes = {
  github: PropTypes.string,
  gitlab: PropTypes.string
};
