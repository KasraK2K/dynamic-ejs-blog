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
  if (!SERVER_DATA_SENT.editable) return

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

/**
 * This is default dialog without content
 * Do not forget to erase content each time and add your specific content by using jQuery
 * @param {Record<string, any>} event
 */
function defaultDialog(event) {
  $('#default_dialog').dialog({
    autoOpen: false,
    resizable: true,
    height: 'auto',
    width: 400,
    modal: false,
    position: { my: 'bottom', at: 'top', of: event.currentTarget },
  })
}

function escapeSpecialChars(str) {
  return str
    .replace(/</g, '')
    .replace(/>/g, '')
    .replace(/"/g, '')
    .replace(/'/g, '’')
    .replace(/\\/g, '')
}

/**
 * @return {string}
 */
function dynamicIdGenerator() {
  return (+new Date() + Math.floor(Math.random() * (999 - 100) + 100)).toString(16)
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
  if (!SERVER_DATA_SENT.editable) return

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
  if (!SERVER_DATA_SENT.editable) return

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
  if (!SERVER_DATA_SENT.editable) return

  $('[contenteditable]')
    .click(function (event) {
      event.preventDefault()
    })
    .focus(function (event) {
      $(this).data('oldText', $(this).text())
    })
    .blur(function () {
      const elementKey = escapeSpecialChars($(this).data('key'))
      if (!elementKey) {
        console.error('data-key not found!')
        return
      } else if ($(this).data('oldText') !== $(this).text()) {
        const newText = escapeSpecialChars($(this).text().trim())
        const dynamic_id = $(this).closest('[data-parent]').attr('id')
        const elementIndex = _.findIndex(state.elements, { dynamic_id })
        const element = state.elements[elementIndex]
        $(this).text(newText)

        const command = `element.${elementKey} = newText`
        const func = new Function('element', 'elementKey', 'newText', command)
        func(element, elementKey, newText)

        $emit('save-state-elements') // FIXME : save just when save button is clicked
      }
    })
})

/* -------------------------------------------------------------------------- */
/*                             Register Link Edit                             */
/* -------------------------------------------------------------------------- */
$(document).ready(function () {
  if (!SERVER_DATA_SENT.editable) return

  $('a').each(function () {
    $(this).on('click', function (event) {
      if (!(event.ctrlKey || event.metaKey)) return
      const key = $(this).data('key')
      const dynamic_id = $(this).closest('[data-parent]').attr('id')
      const link = $(this).attr('href')

      const dialogHtmlContent = /* HTML */ `
        <div class="dialog min-w-[200px]">
          <div class="relative w-full h-10 mb-2">
            <input
              id="input_${dynamic_id}"
              value="${link}"
              class="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              placeholder="http://example.com"
              required
            />
            <label
              class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
            >
              Link
            </label>
          </div>

          <!-- Call To Actions -->
          <div class="flex">
            <button
              data-key="${key}"
              data-id="${dynamic_id}"
              data-link-change
              type="button"
              class="btn-primary"
            >
              Publish
            </button>

            <button
              onclick="$('#default_dialog').dialog('close')"
              type="button"
              class="ml-2 btn-default"
            >
              Cancel
            </button>
          </div>
        </div>
      `

      $('#default_dialog').html('')
      $('#default_dialog').html(dialogHtmlContent)
      defaultDialog(event)
      // do something
      $('#default_dialog').dialog('open')
    })
  })
})

// This event raise on click publish button at default_dialog
// You can see default_dialog by command+click on any link
$(document).on('click', '[data-link-change]', function () {
  if (!SERVER_DATA_SENT.editable) return
  const elementKey = $(this).data('key')
  const linkKey = escapeSpecialChars(elementKey.slice(0, elementKey.lastIndexOf('.') + 1) + 'link')
  const dynamic_id = $(this).data('id')
  const newLink = escapeSpecialChars($(`#default_dialog input#input_${dynamic_id}`).val())
  const elementIndex = _.findIndex(state.elements, { dynamic_id })
  const element = state.elements[elementIndex]
  $(`section#${dynamic_id} a[data-key='${elementKey}']`).attr('href', newLink)

  const command = `element.${linkKey} = newLink`
  const func = new Function('element', 'linkKey', 'newLink', command)
  func(element, linkKey, newLink)

  $('#default_dialog').dialog('close')
  $emit('save-state-elements') // FIXME : save just when save button is clicked
})

/* -------------------------------------------------------------------------- */
/*                       Register Header & Paragraph Tag                      */
/* -------------------------------------------------------------------------- */
$(document).ready(function () {
  if (!SERVER_DATA_SENT.editable) return
  const validTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'blockquote']

  $(validTags.join()).each(function () {
    $(this).on('click', function (event) {
      if (!(event.ctrlKey || event.metaKey)) return
      const tagKey = $(this).data('tag')
      const dynamic_id = $(this).closest('[data-parent]').attr('id')
      const tagName = $(this).prop('tagName').toLowerCase()

      const dialogHtmlContent = /* HTML */ `
        <div class="dialog min-w-[200px]">
          <div class="relative h-10 w-full mb-2 mt-4">
            <select
              id="select_${dynamic_id}"
              class="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            >
              ${validTags
                .map((tag) => {
                  return `<option value="${tag}" ${tag === tagName && 'selected'}>${tagToName(
                    tag
                  )}</option>`
                })
                .join('')}
            </select>
            <label
              class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
            >
              Select a City
            </label>
          </div>

          <!-- Call To Actions -->
          <div class="flex">
            <button
              data-key="${tagKey}"
              data-id="${dynamic_id}"
              data-old-tag="${tagName}"
              data-tag-change
              type="button"
              class="btn-primary mb-0"
            >
              Publish
            </button>

            <button
              onclick="$('#default_dialog').dialog('close')"
              type="button"
              class="ml-2 btn-default mb-0"
            >
              Cancel
            </button>
          </div>
        </div>
      `

      $('#default_dialog').html('')
      $('#default_dialog').html(dialogHtmlContent)
      defaultDialog(event)
      // do something
      $('#default_dialog').dialog('open')
    })
  })
})

// This event raise on click publish button at default_dialog
// You can see default_dialog by command+click on any text
$(document).on('click', '[data-tag-change]', function () {
  if (!SERVER_DATA_SENT.editable) return
  const tagKey = escapeSpecialChars($(this).data('key'))
  const oldTag = $(this).data('old-tag')
  const dynamic_id = $(this).data('id')
  const newTag = escapeSpecialChars($(`#default_dialog select#select_${dynamic_id}`).val())
  const elementIndex = _.findIndex(state.elements, { dynamic_id })
  const element = state.elements[elementIndex]

  const oldHeading = $(`section#${dynamic_id} ${oldTag}[data-tag='${tagKey}']`)
  const newHeading = $(`<${newTag}>`)
  newHeading.html(oldHeading.html())
  const attrs = oldHeading.prop('attributes')
  $.each(attrs, function () {
    newHeading.attr(this.name, this.value)
  })
  oldHeading.replaceWith(newHeading)

  const command = `element.${tagKey} = newTag`
  const func = new Function('element', 'tagKey', 'newTag', command)
  func(element, tagKey, newTag)

  $('#default_dialog').dialog('close')
  $emit('save-state-elements') // FIXME : save just when save button is clicked
})

/**
 * @param {string} tag
 * @return {'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'pre' | 'blockquote'}
 */
function tagToName(tagName) {
  switch (tagName.toLowerCase()) {
    case 'p':
      return 'Paragraph'
    case 'h1':
      return 'Heading 1'
    case 'h2':
      return 'Heading 2'
    case 'h3':
      return 'Heading 3'
    case 'h4':
      return 'Heading 4'
    case 'h5':
      return 'Heading 5'
    case 'h6':
      return 'Heading 6'
    case 'pre':
      return 'Pre'
    case 'blockquote':
      return 'Blockquote'

    default:
      return 'Undefined Tag Name'
  }
}

/* -------------------------------------------------------------------------- */
/*                           Register Panel Behavior                          */
/* -------------------------------------------------------------------------- */
$('#panel .panel_toolbar ul li').on('click', function (e) {
  const dataset = $(this).data('tab')

  const panel = $('#panel')
  const close = panel.find('.panel_close')
  const panelTabContents = panel.find('.panel_body').children()

  panelTabContents.each(function (i, el) {
    if (el.dataset.tab !== dataset) el.style.display = 'none'
    else el.style.display = ''
  })

  panel.css('width', '652px')
  close.css('display', 'flex')

  close.on('click', function (e) {
    e.stopPropagation()
    panel.css('width', '64px')
    close.css('display', 'none')
  })
})
