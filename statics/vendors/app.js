// @ts-nocheck
/**
 * NOTE
 * This script is just for use blog behavior for delete, add or other design blog element
 * Do not forget submit data to backend after each change
 */

/* -------------------------------------------------------------------------- */
/*                                Main Behavior                               */
/* -------------------------------------------------------------------------- */
$(document).ready(() => {
  const SERVER_DATA_SENT = $('#behavior_script').data('object')
  window.state = { elements: _.sortBy(SERVER_DATA_SENT.elements, ['position']) }

  for (const element of state.elements) {
    // Add Component Script
    if (element.script) {
      const isScriptExist = $(`script[src="${element.script}"]`).length > 0
      if (!isScriptExist)
        $(`<script type="text/javascript" src="${element.script}"></script>`).insertBefore(
          '#behavior_script'
        )
    }

    // Add Component CSS
    if (element.style) {
      const isStyleExist = $(`link[href="${element.style}"]`).length > 0
      if (!isStyleExist)
        $(`<link rel="stylesheet" href="${element.style}">`).insertBefore('#behavior_style')
    }
  }
})
/* -------------------------------------------------------------------------- */

/* ----------------------------- Sort Components ---------------------------- */
$(function () {
  $('#sortable').sortable({
    placeholder: 'ui-state-highlight',
    axis: 'y',
    cursor: 'move',
    opacity: 0.5,
    stop: (event, ui) => {
      const elementDynamicId = $(ui.item).attr('id')
      const lasPosition = getPositionById(elementDynamicId)

      const moveAfterElementId = $(ui.item).prev().attr('id')
      const moveAfterPosition = getPositionById(moveAfterElementId)

      const moveBeforeElementId = $(ui.item).next().attr('id')
      const moveBeforePosition = getPositionById(moveBeforeElementId)

      const isFirst = moveAfterPosition === -1
      const isLast = moveBeforePosition === -1

      const element = state.elements[lasPosition]

      // Put element on top
      if (isFirst) {
        element.position = 0
        const elements = omitElementsById(elementDynamicId)
        for (let i = 0; i < elements.length; i++) elements[i].position = i + 1
        state.elements = [element, ...elements]
      }
      // Put element at the end
      else if (isLast) {
        element.position = state.elements.length - 1
        const elements = omitElementsById(elementDynamicId)
        for (let i = 0; i < elements.length; i++) elements[i].position = i
        elements.push(element)
        state.elements = [...elements]
      }
      // Put element between another element
      else {
        element.position =
          (moveAfterPosition + moveBeforePosition) / 2 > moveAfterPosition
            ? moveBeforePosition
            : moveAfterPosition
        let elements = omitElementsById(elementDynamicId)
        const group_before = elements.slice(0, element.position)
        const group_after = elements.slice(element.position)
        state.elements = [...group_before, element, ...group_after]
        for (let i = 0; i < state.elements.length; i++) state.elements[i].position = i
      }
    },
  })
  $('#sortable').disableSelection()
  /* -------------------------------------------------------------------------- */
})

function getPositionById(dynamic_id) {
  if (dynamic_id) return state.elements[_.findIndex(state.elements, { dynamic_id })].position
  return -1
}

function omitElementsById(dynamic_id) {
  return state.elements.filter((element) => element.dynamic_id !== dynamic_id)
}
