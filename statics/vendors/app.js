/**
 * NOTE
 * This script is just for use blog behavior for delete, add or other design blog element
 * Do not forget submit data to backend after each change
 */

/* ----------------- Create State and Add Styles and Scripts ---------------- */
$(document).ready(() => {
  const database = { elements: _.sortBy(SERVER_DATA_SENT.elements, ['position']) }
  window.state = new Proxy(database, handler)

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
      handler.arrangeBy = { array: sortedIDs, sensitiveKey: 'dynamic_id', target: 'elements' }
      const result = state.RearrangeByArrayOfIDs
      console.log(result)
      state.elements = result
    },
  })
  $('#sortable').disableSelection()
})

/* -------------------------------------------------------------------------- */
/*                           Create Default handler                           */
/* -------------------------------------------------------------------------- */
/**
 * @param {Record<string, any>} object
 * @param {string} prop
 * @param {Record<string, any>} arrangeBy
 * @return {Record<string, any>[]}
 */
function RearrangeByArrayOfIDs(object, prop, arrangeBy) {
  // If arrangeBy not filled
  if (!arrangeBy) {
    throw new Error(
      'Please fill arrangeBy first, eq: {array: ["1", "2", "3"], sensitiveKey: "id", target: "elements"}'
    )
  }
  // If arrangeBy target was not exist
  else if (!Reflect.has(object, arrangeBy.target)) {
    throw new Error(`target '${arrangeBy.target}' in arrangeBy object not exist`)
  }

  // Sort target by using arrangeBy array and sensitiveKey
  const { valid, result } = sortByAnotherArray(
    object[arrangeBy.target],
    arrangeBy.array,
    arrangeBy.sensitiveKey
  )
  if (!valid) throw new Error('Error on sorting sections')
  return result
}

const handler = {
  set(object, prop, value) {
    if (prop === 'arrangeBy') {
      this.arrangeBy = value
      return true
    } else {
      return Reflect.set(object, prop, value)
    }
  },
  get(object, prop) {
    if (prop === 'RearrangeByArrayOfIDs') return RearrangeByArrayOfIDs(object, prop, this.arrangeBy)
    else return object[prop]
  },
}

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
 * @param {string} sensitiveKey sensitive key to use for sorting
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
