import React from "react";

class NumberField extends React.Component {
  static propTypes = {
    input: React.PropTypes.shape({
      value: React.PropTypes.string,
      onChange: React.PropTypes.func.isRequired
    }).isRequired,
    disabled: React.PropTypes.bool.isRequired,
    readOnly: React.PropTypes.bool.isRequired
  };

  render() {
    const { desc, input, disabled, readOnly } = this.props;
    const applyReadOnly = !disabled && readOnly;
    return (
      <div className="field">
        <input type="number" value={this.props.input.value} id={desc.id} {...input} readOnly={applyReadOnly} disabled={disabled} />
      </div>
    );
  }
}

export default crudl.baseField(NumberField);
