var  Component = require('react').Component;
var React = require('react');
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';
import Footer from '../components/Footer';
/*var AddTodo = require('../components/AddTodo');
var TodoList = require('../components/TodoList');
var Footer  = require('../components/Footer');*/

export default class App extends Component {
    render() {
        return (
            <div>
            <AddTodo
        onAddClick={text =>
        console.log('add todo', text)
    } />
<TodoList
    todos={[{
        text: 'Use Redux',
        completed: true
    }, {
    text: 'Learn to connect it to React',
        completed: false
}]}
onTodoClick={todo =>
console.log('todo clicked', todo)
} />
<Footer
filter='SHOW_ALL'
onFilterChange={filter =>
console.log('filter change', filter)
} />
</div>
);
}
}