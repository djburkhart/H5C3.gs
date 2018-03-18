/*
  CHECKS BROWSER SUPPORT FOR CSS GRIDS
*/
function browserSupportsCSS3Vars() {
  return window.CSS.supports('display', 'grid');
}

(function () {
  document.getElementById('msg').style.visibility = 'hidden';

  if (browserSupportsCSS3Vars() !== true) {
    document.getElementById('msg').style.visibility = 'visible';
    document.getElementsByTagName('section')[0].style.visibility = 'hidden';
  }
})();
