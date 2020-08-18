// Check if browser supports Do Not Track flag
// Also checks if in a production or dev environment.  Disabled analytics in dev.
if (
  (window.doNotTrack ||
    navigator.doNotTrack ||
    navigator.msDoNotTrack ||
    'msTrackingProtectionEnabled' in window.external) &&
  process.env.NODE_ENV === 'production'
) {
  // Check if browser Do Not Track flag is enabled
  if (
    window.doNotTrack !== '1' &&
    navigator.doNotTrack !== 'yes' &&
    navigator.doNotTrack !== '1' &&
    navigator.msDoNotTrack !== '1' &&
    !window.external.msTrackingProtectionEnabled()
  ) {
    // Enable Analytics if Do Not Track flag is not enabled
    enableAnalytics()
  }
} else if (process.env.NODE_ENV === 'production') {
  // Enable Analytics if browser does not support Do Not Track
  enableAnalytics()
}

function enableAnalytics() {
  // Enable Google Tag Manager
  ;(function (w, d, s, l, i) {
    w[l] = w[l] || []
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l !== 'dataLayer' ? '&l=' + l : ''
    j.async = true
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
    f.parentNode.insertBefore(j, f)
  })(window, document, 'script', 'dataLayer', 'GTM-T3VFM4Q')
}
