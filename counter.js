var React = require('react');
var ReactDOM = require('react-dom');

/******************************************************************************
IMPLEMENT BASIC REDUX FUNCTIONS
******************************************************************************/
/*
const createStore = (reducer) => {
  let state;
  let listeners = [];
  const getState = () => state;
  const dispatch = (action) => {
    // pass the action to the reducer to invoke on the current state
    state = reducer(state, action);
    // notify each listener about the state update
    listeners.forEach(listener => listener());
  };
  const subscribe = (listener) => {
    // add the listener
    listeners.push(listener);
    // return a function that can be called to remove this listener
    return () => {
      listeners = listeners.filter(l => l !== listener);
    }
  };
  // dispatch dummy action to provoke reducer to return state with initial values
  dispatch({});

  // these methods form a "store" to be returned
  return { getState, dispatch, subscribe };
};

const combineReducers = (reducers) => {
	return (state = {}, action) => {
		return Object.keys(reducers).reduce(
			(nextState, key) => {
				nextState[key] = reducers[key](
					state[key],
					action
				);
				return nextState;
			},
			{}
		);
	};
};
*/
const { createStore } = Redux;
const { combineReducers } = Redux;

/******************************************************************************
DEFINE AND COMBINE REDUCERS
******************************************************************************/

const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        text: action.text,
        id: action.id,
        completed: false
      };
    case 'TOGGLE_TODO':
      console.log("toggling todo... state.id: " + state.id + " and action.id: " + action.id);
      if (state.id !== action.id) {
        console.log("returning state");
        return state;
      }
      console.log("returning UPDATED state with text: " + state.text + " and id: " + state.id + " and completed: " + !state.completed);
      return {
        text: state.text,
        id: state.id,
        completed: !state.completed
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => {
        todo(t, action);
      });
    default:
      return state;
  }
};

const reducers = combineReducers({
  counter,
  todos
});

/******************************************************************************
CREATE REDUX STORE BASED ON REDUCERS
******************************************************************************/

// create a store with counter() as the reducer
var store = createStore(reducers);

/******************************************************************************
DEFINE REACT COMPONENTS
******************************************************************************/

const Counter = ({
  value,
  onIncrement,
  onDecrement
}) => (
    <div>
      <h1>{value}</h1>
      <button onClick={onIncrement}>+</button>
      <button onClick={onDecrement}>-</button>
    </div>
);

let nextTodoId = 0;

class TodoWidget extends React.Component {
  render() {
    console.log("render");
    return (
      <div>
        <input ref={node => {
          this.input = node;
        }} />
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          });
          this.input.value = '';
        }}>
          Add Todo
        </button>
        <ul>
          {this.props.todos.map((todo) => {
            console.log(store.getState().todos);
            return (
              <li key={todo.id}
                  onClick={() => {
                    console.log("toggling todo.id: " + todo.id);
                    store.dispatch({
                      type: 'TOGGLE_TODO',
                      id: todo.id
                    });
                  }}
                  style={{
                    textDecoration:
                      todo.completed ?
                        'line-through' :
                        'none'
                  }}>
                {todo.text}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
};

const App = () => {
  return (
    <div>
      <Counter
        value={store.getState().counter}
        // define buttons' event handlers as functions that dispatch actions to the store
        onIncrement={() =>
          store.dispatch({ // dispatch action of type 'INCREMENT' to the store
            type: 'INCREMENT'
          })
        }
        onDecrement={() =>
          store.dispatch({
            type: 'DECREMENT'
          })
        }
      />
      <TodoWidget todos={store.getState().todos} />
    </div>
  );
}

/******************************************************************************
DEFINE REACT DOM
******************************************************************************/

// extract render() into its own method so that it can be called upon page load
// as well as upon click events
const render = () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
};

/******************************************************************************
START APPLICATION
******************************************************************************/

// subscribe() "lets you register a callback that the Redux store will call
// any time an action has been dispatched so that you can update the UI of your
// application to reflect the current application state"
store.subscribe(render);

// call this once explicitly to render the initial state (which is 0)
render();
