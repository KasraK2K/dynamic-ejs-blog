/* NOTE that all css and js are global so be careful on choosing name for functions and variables */

/* -------------------------------------------------------------------------- */
/*                                Hero Behavior                               */
/* -------------------------------------------------------------------------- */
$(document).ready(() => {
  const SERVER_DATA_SENT = $('#behavior_script').data('object')
  const state = {}

  for (const element of SERVER_DATA_SENT.elements) {
    if (element.component === 'hero') {
      state[element.dynamic_id] = +$(`#${element.dynamic_id} .hero_btn`).text()
      $(`#${element.dynamic_id} .hero_btn`).on('click', () => {
        $(`#${element.dynamic_id} .hero_btn`).text(++state[element.dynamic_id])
      })
    }
  }
})
