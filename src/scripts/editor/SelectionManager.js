let d3 = require('d3');
let Signals = require('js-signals');
let Utils = require('../core/Utils');

export default class SelectionManager {
  constructor(tweenTime) {
    this.tweenTime = tweenTime;
    this.selection = [];
    this.onSelect = new Signals.Signal();
  }

  removeDuplicates() {
    var result = [];
    for (var i = 0; i < this.selection.length; i++) {
      var item = this.selection[i];
      var found = false;
      for (var j = 0; j < result.length; j++) {
        var item2 = result[j];
        if (item.isEqualNode(item2)) {
          found = true;
          break;
        }
      }
      if (found === false) {
        result.push(item);
      }
    }
    this.selection = result;
  }

  removeItem(item) {
    var index = this.selection.indexOf(item);
    if (index > -1) {
      this.selection.splice(index, 1);
    }
  }

  sortSelection() {
    var compare = function(a, b) {
      if (!a.__data__ || !b.__data__) {
        return 0;
      }
      if (a.__data__.time < b.__data__.time) {
        return -1;
      }
      if (a.__data__.time > b.__data__.time) {
        return 1;
      }
      return 0;
    };
    this.selection = this.selection.sort(compare);
  }

  reset() {
    this.selection = [];
    this.highlightItems();
    this.onSelect.dispatch(this.selection, false);
  }

  triggerSelect() {
    this.onSelect.dispatch(this.selection, false);
  }

  select(item, addToSelection = false) {
    if (!addToSelection) {
      this.selection = [];
    }
    if (item instanceof Array) {
      for (var i = 0; i < item.length; i++) {
        var el = item[i];
        this.selection.push(el);
      }
    }
    else {
      this.selection.push(item);
    }

    this.removeDuplicates();
    this.highlightItems();
    this.sortSelection();
    this.onSelect.dispatch(this.selection, addToSelection);
  }

  getSelection() {
    return this.selection;
  }

  highlightItems() {
    d3.selectAll('.bar--selected').classed('bar--selected', false);
    d3.selectAll('.key--selected').classed('key--selected', false);

    for (var i = 0; i < this.selection.length; i++) {
      var item = this.selection[i];
      var d3item = d3.select(item);
      if (d3item.classed('bar')) {
        d3item.classed('bar--selected', true);
      }
      else if (d3item.classed('key')) {
        d3item.classed('key--selected', true);
      }
    }
  }
}
