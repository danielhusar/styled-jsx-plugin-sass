const sass = require('node-sass')

module.exports = (css, settings) => {
  // resolve tag can have rules without selector
  if (css.trim().startsWith('{')) {
    return css
  }

  const cssWithPlaceholders = css
    .replace(
      /%%styled-jsx-placeholder-(\d+)%%%(\w*\s*[),;!{])/g,
      (_, id, p1) => `styled-jsx-percent-placeholder-${id}-${p1}`,
    )
    .replace(
      /%%styled-jsx-placeholder-(\d+)%%(\w*\s*[),;!{])/g,
      (_, id, p1) => `styled-jsx-placeholder-${id}-${p1}`,
    )
    .replace(
      /%%styled-jsx-placeholder-(\d+)%%%/g,
      (_, id) => `/*%%styled-jsx-percent-placeholder-${id}%%*/`,
    )
    .replace(/%%styled-jsx-placeholder-(\d+)%%/g, (_, id) => `/*%%styled-jsx-placeholder-${id}%%*/`)

  // Prepend option data to cssWithPlaceholders
  const optionData = (settings.sassOptions && settings.sassOptions.data) || ''
  const data = optionData + '\n' + cssWithPlaceholders

  const preprocessed = sass
    .renderSync(Object.assign({}, settings.sassOptions, { data }))
    .css.toString()

  return preprocessed
    .replace(
      /styled-jsx-percent-placeholder-(\d+)-(\w*\s*[),;!{])/g,
      (_, id, p1) => `%%styled-jsx-placeholder-${id}%%%${p1}`,
    )
    .replace(
      /styled-jsx-placeholder-(\d+)-(\w*\s*[),;!{])/g,
      (_, id, p1) => `%%styled-jsx-placeholder-${id}%%${p1}`,
    )
    .replace(
      /\/\*%%styled-jsx-percent-placeholder-(\d+)%%\*\//g,
      (_, id) => `%%styled-jsx-placeholder-${id}%%%`,
    )
    .replace(
      /\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g,
      (_, id) => `%%styled-jsx-placeholder-${id}%%`,
    )
}
