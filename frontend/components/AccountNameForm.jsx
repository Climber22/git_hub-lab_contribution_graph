// React
import React from 'react';
import PropTypes from 'prop-types';

// components
import { Form } from 'semantic-ui-react';

export default function AccountNameForm(props) {
  return (
    <Form onSubmit={props.handleSubmit} widths="equal" loading={props.loading}>
      <Form.Group>
        <Form.Input
          name="github"
          value={props.github}
          onChange={props.handleChange}
          placeholder="Account name of Github"
        />
        <Form.Input
          name="gitlab"
          value={props.gitlab}
          onChange={props.handleChange}
          placeholder="Account name of Gitlab"
        />
        <Form.Button content="Submit" />
      </Form.Group>
    </Form>
  );
}

AccountNameForm.propTypes = {
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  github: PropTypes.string,
  gitlab: PropTypes.string,
  loading: PropTypes.bool
};
