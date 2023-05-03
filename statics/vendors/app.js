// @ts-nocheck
/**
 * NOTE
 * This script is just for use blog behavior for delete, add or other design blog element
 * Do not forget submit data to backend after each change
 */

const SERVER_DATA_SENT = $('#behavior_script').data('object')
/* -------------------------------------------------------------------------- */

/* ------------------------- Add Components Scripts ------------------------- */
$(document).ready(() => {
  for (const element of SERVER_DATA_SENT.elements) {
    if (element.script) {
      const isScriptExist = $('#component_scripts script').find(`script[src="${element.script}"]`).prevObject.length > 0
      if (!isScriptExist) {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `${element.script}`
        $('#component_scripts').append(script)
      } else return
    }
  }
})
/* -------------------------------------------------------------------------- */

/* -------------------------------- jQueryUI -------------------------------- */
$(function () {
  $('#sortable').sortable()
  $('#sortable').disableSelection()
})
