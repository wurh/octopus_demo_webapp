export const backTop = (durations, dom, callback = undefined) => {
  const scrollTop = dom.scrollTop
  for (var i = 60; i >= 0; i--) {
    setTimeout((i => {
      return () => {
        dom.scrollTop = scrollTop * i / 60
        if (i === 0 && typeof callback === 'function') {
          callback()
        }
      }
    })(i), durations * (1 - i / 60))
  }
}
