  /*
   * Open the drawer when the menu ison is clicked.
   */
  var menu = document.querySelector('.header-menu');
  var main = document.querySelector('main');
  var drawer = document.querySelector('.list-box');

  menu.addEventListener('click', function(e) {
    drawer.classList.toggle('open');
    e.stopPropagation();
  });
