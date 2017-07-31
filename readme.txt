###############################################################################
                       Neighbourhood Map Website
###############################################################################

1. What Is It?
   -----------
   The Neighbourhood Map Website is a single-page website that provides a map
   of tourist attractions of inner Sydney. The user can select an attraction 
   from the list view or via the corresponding marker on the map view. Once a
   marker is selected it opens an infoWindow with information about the 
   attraction. Information includes street address, phone number, opening hours
   and website. A link to the corresponding Wikipedia article is provided in 
   the list view. A drop-down list provides a list of categories for filtering
   the list of attractions. Location and filtering data is hard coded into the
   JavaScript but could easily be obtained from a JSON endpoint, enabling this
   website to be truly generic and able to be used for any neighbourhood.

   This website utilizes the Google Maps JavaScript API to render the map and
   place the markers, as well as the Google Places API Web Service to obtain
   information and photos of the attraction at that location. The Wikipedia Web
   Service API is accessed asynchronously via a jQuery ajax call to obtain the
   link to the relevant Wikipedia article.

   The Knockout JavaScript framework is used to provide a clear separation 
   between the view components and data to be displayed. Knockout is an
   implementation of the Model-View-ViewModel pattern. Knockout documentation
   can be found at the following address:
      http://knockoutjs.com/documentation/introduction.html

   The website is designed to be responsive and will render correctly on any
   sized screen.

   This application was created as partial fulfillment of the Udacity Full
   Stack Web Developer Nanodegree. Specifically, it is 
   Project 6: Neighbourhood Map.

2. Installation
   ------------
   The source code for this application can be obtained from the following
   GitHub repository:
      https://github.com/MickElliott/fsnd-neighbourhood-map.git

   The Neighbourhood Map Website consists of the following files:
      index.html
      readme.txt
      js\app.js
      js\menu.js
      js\lib\knockout-3.2.0.js
      js\lib\jquery.min.js
      img\sydney.jpg
      css\style.css

3. Usage
   -----
   1. The repository can be obtained from GitHub by cloning in Git, or 
      downloading the code ZIP from the GitHub page.
   2. Once the repository is downloaded from GitHub, the website can be opened 
      directly in a web browser via the index.html file.
