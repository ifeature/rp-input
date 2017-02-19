import React, { Component, PropTypes } from 'react';
import { debounce } from 'lodash';

const isValid = (value, filter) => {
  if (typeof filter === 'string') {
    const pattern = new RegExp(filter);
    return pattern.test(value);
  }
  if (typeof filter === 'function') {
    if (value.trim().length > 0) {
      return filter(value);
    }
  }
  return true;
};

const createDebouced = (func, debouncedTime) => (
  debouncedTime ? debounce(func, debouncedTime) : func
);

class Input extends Component {
  static propTypes = {
    debouncedTime: PropTypes.number,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    maxLength: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    filter: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  };
  static get defaultProps() {
    return {
      value: '',
      maxLength: '',
      placeholder: '',
      filter: null,
      debouncedTime: 500,
    };
  }
  state = {
    value: this.props.value,
  };
  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }
  onChange = (event) => {
    const { value } = event.target;
    if (isValid(value, this.props.filter)) {
      this.setState({
        value: event.target.value,
      }, () => {
        this.onChangeDebounced(this.state.value);
      });
    }
  };
  onChangeDebounced = createDebouced(this.props.onChange, this.props.debouncedTime);
  render() {
    const { value } = this.state;
    return (
      <input
        type="text"
        value={value}
        onChange={this.onChange}
        placeholder={this.props.placeholder}
        maxLength={this.props.maxLength}
      />
    );
  }
}

export default Input;
