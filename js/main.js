// Global template
var templateHtml = $('#templates .list').html();
var template = _.template(templateHtml);

// A view for an individual list item
var ListItemView = Backbone.View.extend({
  className: 'todo',

  events: {
    'change .checkbox': 'checkOff',
    'click .delete': 'delete',
    'click .move-up': 'moveUp',
    'click .move-down': 'moveDown'
  },

  initialize: function (options) {
    this.name = options.name;
    this.complete = false;
  },

  logListItemHeader: function (e) {
    // console.log('You clicked', e.currentTarget)
    console.log('I am', this.name)
  },

  checkOff: function () {
    this.complete = true;
    this.render();
  },

  delete: function () {
    $(this.el).detach();
  },

  moveUp: function () {
    var current = $(this.el);
    current.prev(':visible').before(current);
  },

  moveDown: function () {
    var current = $(this.el);
    current.next(':visible').after(current);
  },

  render: function () {
    var newListItemHtml = template({
      name: this.name,
      complete: this.complete,
      id: this.id
    });

    $(this.el).html(newListItemHtml);
    return this;
  }
});


// This view controls the displaying of all the list items
var ShowListView = Backbone.View.extend({

  initialize: function (options) {
    this.listViews = [];

    for (var i = 0; i < options.tasks.length; i++){
      var newListView = new ListItemView(options.tasks[i]);
      this.listViews.push(newListView);
    }
  },

  addItem: function (name) {
    var newItemView = new ListItemView({ name: name, id: this.listViews.length});
    this.listViews.push(newItemView);
    // Add to page so we don't have to re-render everything
    $(this.el).append( newItemView.render().el );
  },

  itemsLeft: function(){
    console.log('items left', this.listViews.length);
    $('#number-items-left').html(this.listViews.length);
  },


  render: function () {
    // Clear the contents
    $(this.el).empty();

    // For each list item, generate html and add it to the page
    for (var i = 0; i < this.listViews.length; i++){
      // Render the list view and grab its elements
      var newListElement = this.listViews[i].render().el;
      $(this.el).append(newListElement);
    }
    this.itemsLeft();
    return this;
  }
});



var initialTasks = [
  {
    name: 'Finish ToDo list',
    complete: false,
    id: 0
  },
  {
    name: 'Finish MakerSquare course',
    complete: false,
    id: 1
  }
];

var listView = new ShowListView({
  tasks: initialTasks,
  el: $('#to-do-list')
});
listView.render();


// When form is submitted
$(document).on('click', '#add', function (e) {
  e.preventDefault();
  var name = $('[name=input-box').val();
  $('[name=input-box').val('');

  listView.addItem(name);
});


