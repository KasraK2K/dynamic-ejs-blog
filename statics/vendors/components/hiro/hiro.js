// @ts-nocheck
/* NOTE that all css and js are global so be careful on choosing name for functions and variables */

/* -------------------------------------------------------------------------- */
/*                                Hiro Behavior                               */
/* -------------------------------------------------------------------------- */
$(document).ready(() => {
  const SERVER_DATA_SENT = $('#behavior_script').data('object')
  const state = {}

  for (const element of SERVER_DATA_SENT.elements) {
    if (element.component === 'hiro') {
      state[element.dynamic_id] = +$(`#${element.dynamic_id} .hiro_btn`).text()
      $(`#${element.dynamic_id} .hiro_btn`).on('click', () => {
        $(`#${element.dynamic_id} .hiro_btn`).text(++state[element.dynamic_id])
      })
    }
  }
})
