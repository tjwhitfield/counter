// you click
// JS detects click and invokes the event handler
// the event handler dispatches an 'INCREMENT' event to the store
// the store lets its one and only reducer function handle all dispatched actions
// the reducer (counter()) updates the store's state based on which action type was dispatched
// the store's state is changed, so the store notifies all subscribed callbacks
// the render() callback runs, getting the updated state and displaying it on the page

counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

const { createStore } = Redux;
// create a store with counter() as the reducer
const store = createStore(counter);

// extract render() into its own method so that it can be called upon page load
// as well as upon click events
const render = () => {
  document.body.innerText = store.getState();
}

// subscribe() "lets you register a callback that the Redux store will call
// any time an action has been dispatched so that you can update the UI of your
// application to reflect the current application state"
store.subscribe(render);
// call this once explicitly to render the initial state (which is 0)
render();

document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT' });
});
