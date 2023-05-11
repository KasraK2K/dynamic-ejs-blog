/**
 * NOTE
 * This script is just for use blog behavior for delete, add or other design blog element
 * Do not forget submit data to backend after each change
 */

/* ----------------- Create State and Add Styles and Scripts ---------------- */
$(document).ready(() => {
  const database = { elements: SERVER_DATA_SENT.elements }
  window['state'] = new Proxy(database, handler)

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
        $(`<link rel="stylesheet" href="${element.style}">`).insertAfter('#behavior_style')
    }
  }
})

/* ----------------------------- Sort Components ---------------------------- */
$(function () {
  $('#sortable').sortable({
    handle: $('#sortable > section > .handle_top, #sortable > section > .handle_bottom'),
    placeholder: 'ui-state-highlight',
    axis: 'y',
    opacity: 0.5,
    stop: (event, ui) => {
      const sortedIDs = $('#sortable').sortable('toArray')
      handler.arrangeBy = { array: sortedIDs, target: 'elements', sensitiveKey: 'dynamic_id' }
      const newSortedElements = state.RearrangeByArrayOfIDs
      state.elements = newSortedElements
      SERVER_DATA_SENT.elements = newSortedElements
      updateSort()
    },
  })
})

// TODO DevExtreme File Manager
$('#file-manager').dxFileManager({
  fileSystemProvider: [
    {
      name: 'MyFolder',
      size: 1024,
      dateModified: '2019/05/08',
      // thumbnail: '/thumbnails/images/jpeg.ico',
      isDirectory: true,
      items: [
        // Nested data objects with the same structure
      ],
    },
  ],
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
 * NOTE: Do not change this function
 * This function trigger each time any section moved
 */
function updateSort() {
  const pageUrl = document.location.href
  const urlStringParams = pageUrl.substring(SERVER_DATA_SENT.server_address.length + 4)
  const [id] = urlStringParams.split('/')

  $.ajax({
    method: 'POST',
    url: `${SERVER_DATA_SENT.server_address}/v1/${SERVER_DATA_SENT.company}`,
    data: JSON.stringify(SERVER_DATA_SENT),
    contentType: 'application/json',
    dataType: 'json',
  }) // FIXME : save just when save button is clicked
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

/* -------------------------------------------------------------------------- */
/*                           Register Emit Listener                           */
/* -------------------------------------------------------------------------- */
$(window).on('emit', function (e, name, ...args) {
  console.log(`Emit ${name} happened. Sent arguments:`, args)

  switch (name) {
    case 'save-state-elements':
      saveStateElements()
      break

    default:
      console.log({ e, name, args })
      break
  }
})

/* -------------------------------------------------------------------------- */
/*                              Register Emitter                              */
/* -------------------------------------------------------------------------- */
window['$emit'] = (name, ...args) => $(window).trigger('emit', [name, ...args])

function saveStateElements() {
  SERVER_DATA_SENT.elements = state.elements

  // Save
  $.ajax({
    method: 'POST',
    url: `${SERVER_DATA_SENT.server_address}/v1/${SERVER_DATA_SENT.company}`,
    data: JSON.stringify(SERVER_DATA_SENT),
    contentType: 'application/json',
    dataType: 'json',
  })
  // Show Toast
  // alert('updated')
}

/* -------------------------------------------------------------------------- */
/*                               Register Dialog                              */
/* -------------------------------------------------------------------------- */
$(function () {
  for (const element of state.elements) {
    const title = `${element.component} Modifier`

    $(`#dialog_${element.dynamic_id}`).dialog({
      autoOpen: false,
      show: {
        effect: 'blind',
        duration: 500,
      },
      hide: {
        effect: 'explode',
        duration: 500,
      },
      resizable: true,
      height: 'auto',
      width: 400,
      modal: false,
      // buttons: {
      //   Save: function () {
      //     $(this).dialog('close')
      //   },
      //   Cancel: function () {
      //     $(this).dialog('close')
      //   },
      // },
      title: title.charAt(0).toUpperCase() + title.slice(1),
      position: { my: 'center', at: 'center', of: `section#${element.dynamic_id}` },
      open: function () {
        $(`section#${element.dynamic_id}`).addClass('modal_style')
      },
      close: function () {
        $(`section#${element.dynamic_id}`).removeClass('modal_style')
      },
    })

    $(`#opener_${element.dynamic_id}`).on('click', function () {
      $(`#dialog_${element.dynamic_id}`).dialog('open')
    })
  }
})

/* -------------------------------------------------------------------------- */
/*                             Register Text Edit                             */
/* -------------------------------------------------------------------------- */
$(document).ready(function () {
  $('[contenteditable]')
    .click(function (e) {
      e.preventDefault()
    })
    .focus(function (e) {
      $(this).data('oldText', $(this).text())
    })
    .blur(function () {
      const elementKey = $(this).data('key')
      if (!elementKey) {
        console.error('data-key not found!')
        return
      } else if ($(this).data('oldText') !== $(this).text()) {
        const newText = $(this).text().trim()
        const dynamic_id = $(this).closest('[data-parent]').attr('id')
        const elementIndex = _.findIndex(state.elements, { dynamic_id })
        const element = state.elements[elementIndex]
        const path = `element.${elementKey}`
        eval(`element.${elementKey} = newText`)
        $emit('save-state-elements') // FIXME : save just when save button is clicked
      }
    })
})
