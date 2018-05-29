
var React = require('react');
var  Component=require('react').Component;
var  PropTypes=require('react').PropTypes;
//var  Todo=require('./Todo');
import Todo from './Todo';

export default class TodoList extends Component {
    render() {
        return (
            <ul>
            {this.props.todos.map((todo, index) =>
            <Todo {...todo}
        key={index}
        onClick={() => this.props.onTodoClick(index)} />
)}
</ul>
);
}
}

TodoList.propTypes = {
    onTodoClick: PropTypes.func.isRequired,
    todos: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired
    }).isRequired).isRequired
};