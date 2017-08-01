//------------------------------------------------------------------------------
// app.js -- implementation of a Neighbourhood Map for a Sydney Tourism website.
//------------------------------------------------------------------------------
//
// Filtering and location data
//
var filterData = [
    {
        category: 'All',
        id: 0
    },
    {
        category: 'Historic',
        id: 1
    },
    {
        category: 'Family',
        id: 2
    },
    {
        category: 'Cultural',
        id: 3
    },
    {
        category: 'Sights',
        id: 4
    }
];

var locationData = [
    {
        name: 'SEA LIFE Sydney Aquarium',
        location: {lat: -33.870014, lng: 151.202211},
        categories: [0,2],
        id: 0
    },
    {
        name: 'Sydney Opera House',
        location: {lat: -33.856784, lng: 151.215297},
        categories: [0,3,4],
        id: 1
    },
    {
        name: 'Sydney Botanic Gardens',
        location: {lat: -33.864186, lng: 151.216571},
        categories: [0,4],
        id: 2
    },
    {
        name: 'Australian National Maritime Museum',
        location: {lat: -33.869357, lng: 151.198633},
        categories: [0,1,3],
        id: 3
    },
    {
        name: 'Darling Harbour',
        location: {lat: -33.874880, lng: 151.2009},
        categories: [0,4],
        id: 4
    },
    {
        name: 'Luna Park Sydney',
        location: {lat: -33.847699, lng: 151.209838},
        categories: [0,2],
        id: 5
    },
    {
        name: 'Circular Quay',
        location: {lat: -33.861756, lng: 151.210884},
        categories: [0,4],
        id: 6
    },
    {
        name: 'Powerhouse Museum',
        location: {lat: -33.878518, lng: 151.199542},
        categories: [0,2,3],
        id: 7
    },
    {
        name: 'Art Gallery of New South Wales',
        location: {lat: -33.868804, lng: 151.217414},
        categories: [0,1,3],
        id: 8
    },
    {
        name: 'Queen Victoria Building',
        location: {lat: -33.871722, lng: 151.206708},
        categories: [0,1],
        id: 9
    }
];


var Location = function(data) {
    //
    // This function initialises a Location object from the locationData.
    //
    this.name = ko.observable(data.name);
    this.location = ko.observable(data.location);
    this.categories = data.categories;
    this.id = data.id;
};

var ViewModel = function () {
    // 
    // KnockoutJS ViewModel
    //
    // Observable members of the ViewModel
    this.wikipediaItem = ko.observable("");
    this.wikipediaLink = ko.observable("");
    this.locationList = ko.observableArray([]);
    this.filterList = ko.observableArray([]);
    this.filterValue = ko.observable(0);

    // Variable declarations
    var self = this;
    var markers = [];
    var map;
    var largeInfowindow;
    var defaultIcon;
    var highlightedIcon;


    this.ajaxSuccess = function(data) {
        //
        // This function is called when the Wikipedia ajax call is successful.
        //
        items = data[1];
        links = data[3];

        viewModel.wikipediaItem(items[0]);
        viewModel.wikipediaLink(links[0]);
    };

    this.changeLocation = function(loc) {
        //
        // This function is called from the View and changes the selected marker.
        //
        for (var j = 0; j < markers.length; j++) {    
            resetBounce(markers[j]);
        }

        toggleBounce(markers[loc.id]);

        // Populate the InfoWindow
        populateInfoWindow(loc.id, largeInfowindow);      
    };
 
    this.filterLocations = function() {
        //
        // This function filters the markers and the list elements based on the
        // value of the filter input.
        //
        var filter = this.filterValue();

        self.locationList.removeAll();
        for (var i = 0; i < locationData.length; i++) {    
          if (locationData[i].categories.indexOf(filter) >= 0) {
              self.locationList.push(new Location(locationData[i]));
              markers[i].setMap(map);
          } else {
              markers[i].setMap(null);
          }
        }
    };

    function makeMarkerIcon(markerColor) {
        //
        // This function takes in a COLOR, and then creates a new marker
        // icon of that color.
        //
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ 
          markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
    }

    function getWikipediaLink(place_name) {
        //
        // This function gets the relevant Wikipedia article.
        //
        var wikiUrl = "https://en.wikipedia.org/w/api.php";
        wikiUrl += '?' + $.param({
                            'action': 'opensearch',
                            'search': place_name,
                            'format': 'json'
                        });

        $.ajax( {
            url : wikiUrl,
            dataType : 'jsonp',
            success : viewModel.ajaxSuccess
        }).fail(function(xhr, textStatus, errorThrown) {
          window.alert("Wikipedia request failed. " + "xhr.responseText" +
                        "Status: " + xhr.status);
          console.log("Text Status: " + textStatus);
          console.log("Error Thrown: " + errorThrown);
        });
    }

    function toggleBounce(marker) {
        //
        // This function toggles the BOUNCE animation of the selected marker.
        //
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    function resetBounce(marker) {
        //
        // This function resets the animation of the passed marker.
        //
        marker.setAnimation(null);
    }

    function populateInfoWindow(index, infowindow) {
        //
        // This function populates the infowindow when the marker is clicked. 
        // We'll only allow one infowindow which will open at the marker that 
        // is clicked, and populate based on that markers position.
        //
        var marker = markers[index];

        // Animate the selected marker
        marker.animation = google.maps.Animation.BOUNCE;

        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {

            getWikipediaLink(marker.title);

            // Get the info about the location indicated by the marker.
            var service = new google.maps.places.PlacesService(map);

            service.getDetails({
              placeId: marker.id
            }, function(place, status) {

                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    // Set the marker property on this infowindow so it isn't created again.
                    infowindow.marker = marker;
                    var innerHTML = '<div>';
                    if (place.name) {
                        innerHTML += '<strong>' + place.name + '</strong>';
                    }
                    if (place.formatted_address) {
                        innerHTML += '<br>' + place.formatted_address;
                    }
                    if (place.international_phone_number) {
                        innerHTML += '<br>' + place.international_phone_number;
                    }
                    else {
                        if (place.formatted_phone_number) {
                            innerHTML += '<br>' + place.formatted_phone_number;
                        }
                    }
                    if (place.website) {
                        innerHTML += '<br><a href=' + place.website + '>Website</a>';
                    }
                    if (place.opening_hours) {
                        innerHTML += '<br><br><strong>Hours:</strong><br>' +
                            place.opening_hours.weekday_text[0] + '<br>' +
                            place.opening_hours.weekday_text[1] + '<br>' +
                            place.opening_hours.weekday_text[2] + '<br>' +
                            place.opening_hours.weekday_text[3] + '<br>' +
                            place.opening_hours.weekday_text[4] + '<br>' +
                            place.opening_hours.weekday_text[5] + '<br>' +
                            place.opening_hours.weekday_text[6];
                    }
                    if (place.photos) {
                        innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
                            {maxHeight: 100, maxWidth: 200}) + '">';
                    }
                    innerHTML += '</div>';
                    infowindow.setContent(innerHTML);
                }
            });

            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
                wikipediaLink = "";
            });

            // Open the infowindow on the correct marker.
            infowindow.open(map, marker);
        }
    }

    function processTextSearch(index) {
        //
        // This function receives a copy of the for loop index via a closure
        // and then returns a function to PlacesService.textSearch() that will
        // process the textSearch result.
        //
        return function(results, status) {
            var place = results[0];
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                // Create a marker per location, and put into markers array.
                var marker = new google.maps.Marker({
                  map:map,
                  position: place.geometry.location,
                  title: place.name,
                  animation: google.maps.Animation.DROP,
                  icon: defaultIcon,
                  id: place.place_id
                });

                // Push the marker to our array of markers.
                markers[index] = marker;

                // Create an onclick event to open the large infowindow at each 
                // marker.
                markers[index].addListener('click', function() {
                    for (var j = 0; j < markers.length; j++) {
                        resetBounce(markers[j]);
                    }
                    toggleBounce(this);
                    populateInfoWindow(index, largeInfowindow);
                });

                // Two event listeners - one for mouseover, one for mouseout,
                // to change the colors back and forth.
                marker.addListener('mouseover', function() {
                    this.setIcon(highlightedIcon);
                });
                marker.addListener('mouseout', function() {
                    this.setIcon(defaultIcon);
                });
            }
        };
    }

    //
    // Initialisation code.
    //
    for (var k = 0; k < filterData.length; k++) {
        self.filterList.push(filterData[k]);
    }

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.863668, lng: 151.21149},
        zoom: 14,
        mapTypeControl: false
    });

    // Create an InfoWindow
    largeInfowindow = new google.maps.InfoWindow();

    // Style the markers a bit. This will be our location marker icon.
    defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    highlightedIcon = makeMarkerIcon('FFFF24');

    // The following uses the location array to create an array of markers on 
    // initialize.
    var bounds = map.getBounds();
    var placesService = new google.maps.places.PlacesService(map);

    for (var i = 0; i < locationData.length; i++) {    
        // Initialise another element of the markers array
        markers.push(null);

        this.locationList.push(new Location(locationData[i]));

        var position = locationData[i].location;
        var title = locationData[i].name;

        placesService.textSearch({
          query: title,
          bounds: bounds
        }, ( processTextSearch )(i));
    }
};

var viewModel = new ViewModel();
ko.applyBindings(viewModel);
