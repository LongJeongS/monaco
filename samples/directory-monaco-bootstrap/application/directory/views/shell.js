(function(window, Monaco, _, $, app) {

    // shellview that holds the main layout of the application 
    // as well as the nav and search bars
    app.add('Shell', Monaco.View.extend({

        // Template used when rendering this view, it is currently disabled
        // since we are assyncrousnoly loading the templates. For a complete
        // explanation check the code and comments on index.html
        // template: _.template(app.templates['shell']),

        // method executed when an instance of this class is created, use it
        // to set the initial state of the class instance
        initialize: function() {

            // bind an event that will close the dropdown when the user
            // clicks anywhere
            $('body').on('click.dropdown', function(evt) {
                $('.dropdown').removeClass('open');
            });

            // create a listener to sync the ative state of the menu items
            this.listenTo(this, 'select-menu', this.selectMenuItem);

            // instanciate the collection to be used on the employee search
            this.searchResults = new app.collections.EmployeesSearch();
        },

        // render the ui for this view
        render: function() {

            // renders the template storing it inside the view's element container
            this.$el.html(this.template());

            // returns the view instance so you can chain other commands after
            // renderig the view
            return this;
        },

        // this method will close the view - unbining any events and removing any html
        // generated by this view
        remove: function() {
            // make sure we unbind any manual events we bound to dom elements
            // before calling the original remove method for this view
            $('body').off('click.dropdown');
            return Monaco.View.prototype.remove.apply(this, arguments);
        },

        // subviews of the shell - in this app will be the search results list (EmployeeList)
        // by default Monaco subviews gets created just after their master view; they get render
        // just after the master view renders; and they get removed before the master view does.
        views: {
            'ul.dropdown-menu' : { 
                viewClass: function() { return app.views.EmployeeSearchResult; }, 
                collection: function() { return this.searchResults; }
            }
        },

        // ui events directly related with the html content of this view
        events: {
            'keyup .search-query'     : 'search',
            'keypress .search-query'  : 'onkeypress'
        },

        // callback triggered when the user types any key on the search field
        search: function(evt) {
            // retrive the input form value
            var key = $('#searchText').val();

            // reset the `searchResults` collection by passing a data filter
            this.searchResults.fetch({reset: true, data: {name: key}});

            // with a minimal pause open the dropdown
            setTimeout(function() {
                $('.dropdown').addClass('open');
            });
        },

        // callback to the keypress event to make sure the enter key doesn't trigger
        // the default event
        onkeypress: function(evt) {
            if (evt.KeyCode === 13) { //enter key pressed
                evt.preventDefault();
            }
        },

        selectMenuItem: function(menuItem) {
            var fragment = Monaco.history.getFragment(),
                menuItem;

            $('.navbar .nav li').removeClass('active');

            if (fragment === '') {
                menuItem = 'home-menu';
            }
            else if (fragment && fragment.indexOf('contact') === 0) {
                menuItem = 'contact-menu';   
            }
            if (menuItem) {
                $('.' + menuItem).addClass('active');
            }
        }
    }));
}(window, window.Monaco, window._, window.jQuery, window.app));