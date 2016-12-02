// Hello.
//
// This is JSHint, a tool that helps to detect errors and potential
// problems in your JavaScript code.
//
// To start, simply enter some JavaScript anywhere on this page. Your
// report will appear on the right side.
//
// Additionally, you can toggle specific options in the Configure
// menu.

(function() {

    // Initialize places
    var placeData = [{
        name: 'Marina Beach',
        lat: 13.0500,
        lng: 80.2824,
        imgSrc: 'img/download.jpg',
        imgAttribute: 'Marina',
        description: 'Marina Beach is the longest beach in India. Read to know more about the Marina Beach, located at the eastern side of Chennai along the Bay of Bengal..'
    }, {
        name: 'Kapaleeshwarar Temple',
        lat: 13.0336,
        lng: 80.2702,
        imgSrc: 'img/download2.jpg',
        imgAttribute: 'Kapaleeshwarar Temple Wiki',
        description: 'Kapaleeshwarar Temple, Mylapore, Chennai is a temple of Shiva located in Mylapore, Chennai . The temple has numerous shrines, with those of Kapaleeswarar and Karpagambal being the most prominent.'
    }, {
        name: 'Fort St. George ',
        lat: 13.0796,
        lng: 80.2875,
        imgSrc: 'img/download3.jpg',
        imgAttribute: 'Fort St. George.',
        description: 'The year 1644 adds another glorious chapter in the history of the South Indian city Chennai, then known as Madras, conferring upon it a gift of the St. George Fort along the shores of Bay of Bengal.'
    }, {
        name: 'Santhome basilica',
        lat: 13.033499866,
        lng: 80.27333224,
        imgSrc: 'img/download4.jpg',
        imgAttribute: 'Santhome basilica.',
        description: 'Santhome basilica a religious monument which had a historical basis in Mylapore. Santhome basilica is one of the three churches in the world which holds the tomb of Apostles of Jesus Christ. St. Thomas is the apostle of Jesus after whom the church stands today in the name Santhome.'
    }, {
        name: 'Vandalur Zoo',
        lat: 12.8793,
        lng: 80.0819,
        imgSrc: 'img/download5.jpg',
        imgAttribute: 'Arignar Anna Zoological Park',
        description: 'Arignar Anna Zoological Park, also known as the Vandalur Zoo, is a zoological garden located in Vandalur, a suburb in the southwestern part of Chennai, Tamil Nadu, about 31 kilometres from the city centre and 15 kilometres from Chennai Airport.'
    }, {
        name: 'Vivekananda House',
        lat: 13.0495,
        lng: 80.2804,
        imgSrc: 'img/download6.jpg',
        imgAttribute: 'Vivekanandar Illam',
        description: 'Vivekanandar Illam or Vivekananda House, earlier known as Ice House or Castle Kernan at Chennai, India is an important place for the Ramakrishna Movement in South India.'
    }, {
        name: 'Vadapalani Andavar Temple',
        lat: 13.0529,
        lng: 80.2136,
        imgSrc: 'img/download7.jpg',
        imgAttribute: 'Vadapalani Andavar Temple.',
        description: 'Vadapalani Andavar Temple is a Hindu temple that is dedicated to Lord Muruga. It is located in Vadapalani, Chennai. It was renovated in the 1920s and a Rajagopuram was built during that time'
    }, {
        name: 'Guindy National Park',
        lat: 13.0038,
        lng: 80.2389,
        imgSrc: 'img/download8.jpg',
        imgAttribute: 'Photo of Guindy National Park ',
        description: 'Guindy National Park is a 2.70 km² Protected area of Tamil Nadu, located in Chennai, South India, is the 8th smallest National Park of India and one of the very few national parks situated inside a city.'
    }, {
        name: 'Ripon Building',
        lat: 13.0819,
        lng: 80.2716,
        imgSrc: 'img/download9.jpg',
        imgAttribute: 'Ripon Building',
        description: 'The Ripon Building is the seat of the Chennai Corporation in Chennai, Tamil Nadu. It is a fine example of the Neoclassical style of architecture, a combination of Gothic, Ionic and Corinthian.'
    }];

    // Constructor for Place
    var Place = function(data) {
        this.name = data.name;
        this.lat = data.lat;
        this.lng = data.lng;
        this.imgSrc = data.imgSrc;
        this.imgAttribute = data.imgAttribute;
        this.description = data.description;
    };

    // Initialize ViewModel
    var ViewModel = function() {
        var self = this;

        // Set location list observable array from PlaceData
        this.placeList = ko.observableArray([]);
        // Get value from search field.
        this.search = ko.observable('');

        // Make place object from each item in location list then push to observable array.
        placeData.forEach(function(item) {
            this.placeList.push(new Place(item));
        }, this);

        // Initial current location to be the first one.
        this.currentPlace = ko.observable(this.placeList()[0]);

        // Functions invoked when user clicked an item in the list.
        this.setPlace = function(clickedPlace) {

            // Set current location to which user clicked.
            self.currentPlace(clickedPlace);

            // Find index of the clicked location and store for use in activation of marker.
            var index = self.filteredItems().indexOf(clickedPlace);

            // Prepare content for Google Maps infowindow
            self.updateContent(clickedPlace);

            // Activate the selected marker to change icon.
            // function(marker, context, infowindow, index)
            self.activateMarker(self.markers[index], self, self.infowindow)();

        };

        // Filter location name with value from search field.
        this.filteredItems = ko.computed(function() {
            var searchTerm = self.search().toLowerCase();
            if (!searchTerm) {
                return self.placeList();
            } else {
                return ko.utils.arrayFilter(self.placeList(), function(item) {
                    // return true if found the typed keyword, false if not found.
                    return item.name.toLowerCase().indexOf(searchTerm) !== -1;
                });
            }
        });

        // Initialize Google Maps
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 13.0827,
                lng: 80.2707
            },
            zoom: 13,
            mapTypeControl: true,
            streetViewControl: true
        });

        // Initialize markers
        this.markers = [];

        // Initialize infowindow
        this.infowindow = new google.maps.InfoWindow({
            maxWidth: 320
        });

        // Render all markers with data from the data model.
        this.renderMarkers(self.placeList());

        // Subscribe to changed in search field. If have change, render again with the filered locations.
        this.filteredItems.subscribe(function() {
            self.renderMarkers(self.filteredItems());
        });

        // Add event listener for map click event (when user click on other areas of the map beside of markers)
        google.maps.event.addListener(self.map, 'click', function(event) {

            // Every click change all markers icon back to defaults.
            self.deactivateAllMarkers();

            // Every click close all indowindows.
            self.infowindow.close();
        });
    };


    // Method for clear all markers.
    ViewModel.prototype.clearMarkers = function() {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.markers = [];
    };

    // Method for render all markers.
    ViewModel.prototype.renderMarkers = function(arrayInput) {

        // Clear old markers before render
        this.clearMarkers();
        var infowindow = this.infowindow;
        var context = this;
        var placeToShow = arrayInput;

        // Create new marker for each place in array and push to markers array
        for (var i = 0, len = placeToShow.length; i < len; i++) {
            var location = {
                lat: placeToShow[i].lat,
                lng: placeToShow[i].lng
            };
            var marker = new google.maps.Marker({
                position: location,
                map: this.map,
                icon: 'img/map-pin-01.png'
            });

            this.markers.push(marker);

            //render in the map
            this.markers[i].setMap(this.map);

            // add event listener for click event to the newly created marker
            marker.addListener('click', this.activateMarker(marker, context, infowindow, i));
        }
    };

    // Set all marker icons back to default icons.
    ViewModel.prototype.deactivateAllMarkers = function() {
        var markers = this.markers;
        for (var i = 0; i < markers.length; i++) {
            markers[i].setIcon('img/map-pin-01.png');
        }
    };

    // Set the target marker to change icon and open infowindow
    // Call from user click on the menu list or click on the marker
    ViewModel.prototype.activateMarker = function(marker, context, infowindow, index) {
        return function() {

            // check if have an index. If have an index mean request come from click on the marker event
            if (!isNaN(index)) {
                var place = context.filteredItems()[index];
                context.updateContent(place);
                         }
            // closed opened infowindow
            infowindow.close();

            // deactivate all markers
            context.deactivateAllMarkers();

            // Open targeted infowindow and change its icon.
            infowindow.open(context.map, marker);
            marker.setIcon('img/map-pin-02.png');
        };
    };

    // Change the content of infowindow
    ViewModel.prototype.updateContent = function(place) {
        var html = '<div class="info-content">' +
            '<h3>' + place.name + '</h3>' +
            '<img src="' + place.imgSrc + '">' +
            '<em>' + place.imgAttribute + '</em>' +
            '<p>' + place.description + '</p>' + '</div>';

        this.infowindow.setContent(html);
    };

    // Initialize Knockout View Model
    ko.applyBindings(new ViewModel());

})();

//Display weather using weather underground api
var weatherUrl = "http://api.wunderground.com/api/c3c997aa6975fe89/conditions/q/CA/Chennai.json";

$.getJSON(weatherUrl, function(data) {
    var list = $(".forecast ul");
    detail = data.current_observation;
    list.append('<li>Temp: ' + detail.temp_f + '° F</li>');
    list.append('<li><img style="width: 25px" src="' + detail.icon_url + '">  ' + detail.icon + '</li>');
}).error(function(e) {
    $(".forecast").append('<p style="text-align: center;">Sorry! Weather Underground</p><p style="text-align: center;">Could Not Be Loaded</p>');
});