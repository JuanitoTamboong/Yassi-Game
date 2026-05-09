# TODO

## Settings modal readability redesign
- [ ] Update `css/yassi-dashboard.css` for better contrast & typography in Settings modal
- [ ] Add distinct ON vs OFF visual styles (classes) for music/sfx toggles
- [ ] Add `:focus-visible` outlines for keyboard accessibility
- [ ] Update `js/settings.js` to set toggle state classes based on stored preferences
- [ ] (If needed) Add initial toggle classes in `index.html`
- [ ] Manual check: open `index.html`, open Settings, verify readability and ON/OFF differentiation

## Dashboard preload fix (index loads assets before dashboard)
- [ ] Update `index.html` to preload dashboard critical images/audio and then redirect to `pages/yassi-dashboard.html`
- [ ] Manual test: open `index.html`, verify smooth dashboard load (hard refresh)

