var CounterTemp;

// Action:
var increaseAction = function() {
    return {type: 'increase'};
};
var actions = {
    increaseAction: increaseAction
};
// Reducer:
var counter = function(state, action) {
    var count;
    if(typeof state === 'undefined') {
        state = {count: 0};
    }
    count = state.count;
    switch(action.type) {
        case 'increase':
            return {count: count + 1};
        default:
            return state;
    }
};
// Store:
var store = Redux.createStore(counter);

$.reduxInit(actions, store);

$(function() {
    var $App = $("#root");
    CounterTemp = _.template($("#counter").html());
    $App
        .redux("on")
        .on("reduxChange", onReduxChange)
        .click("button", function() {
            $App.trigger("redux:increaseAction", []);
        })
        .html(CounterTemp({count: 0}));
});
function onReduxChange(e, state) {
    $(this).html(CounterTemp({count: state.count}));
}
