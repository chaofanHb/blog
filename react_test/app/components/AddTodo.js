var React = require('react');
var  Component=require('react').Component;
var  findDOMNode=require('react').findDOMNode;
var  PropTypes=require('react').PropTypes;
const ReactDOM = require('react-dom');

export default class AddTodo extends Component {
    render() {
        return (
            <div>
            <input type='text' ref='input' />
            <button onClick={e => this.handleClick(e)}>
    Add
</button>
</div>
);
}

handleClick(e) {
    //const node = findDOMNode(this.refs.input);
    const node = ReactDOM.findDOMNode(this.refs.input)
    const text = node.value.trim();
    this.props.onAddClick(text);
    node.value = '';
}
}

AddTodo.propTypes = {
    onAddClick: PropTypes.func.isRequired
};