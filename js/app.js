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
var map;
var clientID;
var clientSecret;




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
    var self = this;

    this.name = data.name;
    this.lat = data.lat;
    this.lng = data.lng;
    this.imgSrc = data.imgSrc;
    this.imgAttribute = data.imgAttribute;
    this.description = data.description;
    this.street = "";
    this.city = "";

    self.marker = new google.maps.Marker({}); // create it with the right props

    // Foursquare API 
    clientID = "BTUYIFI211R4IOVU4LRIZPLTNKHP0ITHWB0HBAGR4NT4KAYL";
    clientSecret = "5VOHB1J5W1XAL5HSW0AXDMBTDJ42SCFHBY0S0HCDWDTZ0ANX";
    //creating link for four square Using api
    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.lat + ',' + this.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.name;
    //getting foursquare data otherwise display error
    $.getJSON(foursquareURL).done(function(data) {
        var results = data.response.venues[0];
        self.street = results.location.formattedAddress[0];
        if (typeof self.street === 'undefined') {
            self.street = "sorry error";
        }
        self.city = results.location.formattedAddress[1];
        if (typeof self.city === 'undefined') {
            self.city = "sorry error";
        }
    }).fail(function() {
        alert("There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.");
    });
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
        if (!searchTerm) { // on initial page load sel.markers does not exist
            if (self.markers) {
                self.markers.forEach(function(marker) {
                    marker.setVisible(true);
                });
            }
            return self.placeList();
        } else {
            return ko.utils.arrayFilter(self.placeList(), function(place, i) { // place object, index
                // return true if found the typed keyword, false if not found.
                var match = place.name.toLowerCase().indexOf(searchTerm) !== -1; // true or false
                self.markers[i].setVisible(match); // markers array + index + true or false
                return match; // true or false
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

    // Add event listener for map click event (when user click on other areas of the map beside of markers)
    google.maps.event.addListener(self.map, 'click', function(event) {

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

        // add event listener for click event to the newly created marker
        marker.addListener('click', this.activateMarker(marker, context, infowindow, i));
    }
};

// Set all marker icons back to default icons.
ViewModel.prototype.deactivateAllMarkers = function() {
    var markers = this.markers;
    for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(true);
    }
};

// Set the target marker to change icon and open infowindow
// Call from user click on the menu list or click on the marker
ViewModel.prototype.activateMarker = function(marker, context, infowindow, index) {
    return function() {


        // Open targeted infowindow and change its icon.
        infowindow.open(context.map, marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 2100);
    };


};

// Change the content of infowindow
ViewModel.prototype.updateContent = function(place) {
    var html = '<div class="info-content">' +
        '<h3>' + place.name + '</h3>' +
        '<img src="' + place.imgSrc + '">' +
        '<em>' + place.imgAttribute + '</em>' +
        '<p>' + place.description + '</p>' +
        '<em>' + place.street + ',' + place.city + '</em>' + '</div>';

    this.infowindow.setContent(html);
};


function initMap() {
    // Initialize Knockout View Model
    ko.applyBindings(new ViewModel());

}

//error function displayed connection failed
function mapError() {
    alert("Google Maps has failed to load. Please check your internet connection and try again.");
}