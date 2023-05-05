/**
 * NOTE
 * This script is just for use blog behavior for delete, add or other design blog element
 * Do not forget submit data to backend after each change
 */

/* ----------------- Create State and Add Styles and Scripts ---------------- */
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

/* ----------------------------- Sort Components ---------------------------- */
$(function () {
  $('#sortable').sortable({
    placeholder: 'ui-state-highlight',
    axis: 'y',
    cursor: 'move',
    opacity: 0.5,
    stop: (event, ui) => {
      const sortedIDs = $('#sortable').sortable('toArray')
      const { valid, result } = sortByAnotherArray(state.elements, sortedIDs, 'dynamic_id')
      if (!valid) console.error('Error on sorting sections')
      else state.elements = result
    },
  })
  $('#sortable').disableSelection()
})

/* -------------------------------------------------------------------------- */
/*                              Useful Functions                              */
/* -------------------------------------------------------------------------- */
/**
 * @param {string} dynamic_id
 * @return {number}
 */
function getPositionById(dynamic_id) {
  if (dynamic_id) return state.elements[_.findIndex(state.elements, { dynamic_id })].position
  return -1
}

/**
 * @param {string} dynamic_id
 * @returns {Record<string, any>[]}
 */
function omitElementsById(dynamic_id) {
  return state.elements.filter((element) => element.dynamic_id !== dynamic_id)
}

/**
 * @param {Record<string, any>[]} unsortedArray array of data should be sorted
 * @param {string[]} arrayUseForSort array of strings to use for sorting
 * @param {string} sensitiveKey sensetive key to use for sorting
 * @returns { {valid: boolean, result: Record<string, any>[]} }
 */
function sortByAnotherArray(unsortedArray, arrayUseForSort, sensitiveKey) {
  const sortedArray = []
  if (unsortedArray.length !== arrayUseForSort.length) return { valid: false, result: [] }
  for (let i = 0; i < unsortedArray.length; i++) {
    const fondedValue = unsortedArray.find(
      (element) => element[sensitiveKey] === arrayUseForSort[i]
    )

    sortedArray.push(fondedValue)
  }
  return { valid: true, result: sortedArray }
}

/**
 * @param {Record<string, any>} sortedObject object of data should be sorted
 * @param {string[]} arrayUseForSort array of strings to use for sorting
 */
function sortObjectByArray(unsortedObject, arrayUseForSort) {
  const sortedObject = {}
  for (let key of arrayUseForSort) sortedObject[key] = unsortedObject[key]
  return sortedObject
}
