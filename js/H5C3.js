/*
  CHECKS BROWSER SUPPORT FOR CSS GRIDS
*/
function browserSupportsCSS3Vars() {
  // For more info, see: https://stackoverflow.com/a/22242528/2174825
  if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
    return false;
  }

  return window.CSS.supports('display', 'grid');
}

(function () {
  if (browserSupportsCSS3Vars() != true) {
    document.body.innerHTML = '<div id="msg"><h1>Error</h1><p>Your browser does not support CSS grids!</p></div>';
  }
})();
