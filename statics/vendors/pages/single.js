/**
 * NOTE
 * This script is just for use blog behavior for delete, add or other design blog element
 * Do not forget submit data to backend after each change
 */

/* ----------------- Create State and Add Styles and Scripts ---------------- */
$(document).ready(function () {
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
  if (!SERVER_DATA_SENT.editable) return
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

/**
 * Remove dangerous special characters
 * @param {string} str
 * @return {string | undefined}
 */
function escapeSpecialChars(str) {
  if (!str) return
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

function closeComponentPanel() {
  const panel = $('#panel')
  const close = panel.find('.panel_close')
  panel.css('width', '64px')
  close.css('display', 'none')
}

function openComponentPanel() {
  const panel = $('#panel')
  const close = panel.find('.panel_close')
  panel.css('width', '652px')
  close.css('display', 'flex')
}

/**
 * Add container component
 * Container component is empty component just for handle add another text elements
 */
function addContainer() {
  if (!SERVER_DATA_SENT.editable) return
  state.selected_section_id = dynamicIdGenerator()
  const html = /* HTML */ `
    <section id="${state.selected_section_id}" data-parent class="selected">
      <div class="handle_top"></div>
      <div class="container mx-auto px-64 my-10"></div>
      <div class="handle_delete" data-id="${state.selected_section_id}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </div>
      <div class="handle_bottom"></div>
    </section>
  `
  state.selected_element = {
    component: 'container',
    configuration: {
      rows: [],
    },
    dynamic_id: state.selected_section_id,
  }

  const parent = $('#sortable')
  parent.children().each(function (i, el) {
    el.classList.remove('selected')
  })

  parent.append($(html))

  scrollToElement(`section#${state.selected_section_id}`)

  addDeleteEvent()

  // $('#sortable').sortable({
  //   handle: $('#sortable > section > .handle_top, #sortable > section > .handle_bottom'),
  //   placeholder: 'ui-state-highlight',
  //   axis: 'y',
  //   opacity: 0.5,
  //   stop: (event, ui) => {
  //     const sortedIDs = $('#sortable').sortable('toArray')
  //     handler.arrangeBy = { array: sortedIDs, target: 'elements', sensitiveKey: 'dynamic_id' }
  //     const newSortedElements = state.RearrangeByArrayOfIDs
  //     state.elements = newSortedElements
  //     SERVER_DATA_SENT.elements = newSortedElements
  //     updateSort()
  //     toast('success', 'Component Sort', 'Your component positions changed successfully.')
  //   },
  // })
  state.elements.push(state.selected_element)
}

/**
 * Add text element to selected container component
 * @param {string} tag
 */
function addContainerRow(tag) {
  if (!state.selected_element || state.selected_element.component !== 'container') addContainer()

  const row = {
    tag,
    text: 'Sample Text - Change it please...',
  }

  const html = /* HTML */ `
    <!-- tag -->
    <${tag} ${
    SERVER_DATA_SENT.editable && 'contenteditable'
  } data-key="configuration.text" class="${tag}">${row.text}</${tag}>
  `

  state.selected_element.configuration.rows.push(row)
  $(`#sortable section#${state.selected_section_id} .container`).append($(html))
  scrollToElement(`section#${state.selected_section_id} .container`)
  toast('success', 'Container Added', 'New Container Added successfully.')
  $emit('save-state-elements')
}

/**
 * Scroll to top of element with 1 sec animation
 * @param {string} selector
 */
function scrollToElement(selector) {
  $('html, body').animate({ scrollTop: $(selector).offset().top }, 1000)
}

/**
 * Simple Toast Notify. eq: toast('success', 'Title', 'Some text')
 * @param {'success'|'warning'|'error'} status
 * @param {string} title
 * @param {string} text
 * @param {Record<string, any>} [options={}]
 * @return {*} notify instance, useful to close instance by _**instance.close()**_
 */
function toast(status, title, text, options = {}) {
  const notifyObject = {
    title,
    text,
    status, //  success, error, or warning
    autoclose: options.autoclose ?? true,
    autotimeout: options.autotimeout ?? 3000,
    effect: options.effect ?? 'fade', // slide, fade
    speed: options.speed ?? 500, // animation speed
    showCloseButton: options.showCloseButton ?? false,
    showIcon: options.showIcon ?? true,
    gap: options.gap ?? 10,
    distance: options.distance ?? 10, // space between popup & screen edge
    position: options.position ?? 'right top', // top, right, bottom, left, x-center, y-center, center
    type: options.type ?? 1, // 1: Default, 2: Filled Background + Dark Text ,3: Filled Background + Light Text
    customIcon: options.customIcon ?? '',
    customClass: options.customClass ?? '',
  }

  return new Notify(notifyObject)
}

/* -------------------------------------------------------------------------- */
/*                          Register Sort Components                          */
/* -------------------------------------------------------------------------- */
$(document).ready(function () {
  if (!SERVER_DATA_SENT.editable) return
  $('#sortable').on('click', function (e) {
    $('#sortable')
      .children()
      .each(function (i, el) {
        el.classList.remove('selected')
      })

    $(e.target).closest('section').addClass('selected')

    const dynamic_id = $(e.target).closest('section').attr('id')
    const elementIndex = _.findIndex(state.elements, { dynamic_id })
    const element = state.elements[elementIndex]

    state['selected_section_id'] = dynamic_id
    state['selected_element'] = element
  })

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
      toast('success', 'Component Sort', 'Your component positions changed successfully.')
    },
  })
})

/* -------------------------------------------------------------------------- */
/*                      Register DevExtreme File Manager                      */
/* -------------------------------------------------------------------------- */
$(async function () {
  /* Context Configs */
  // const selectContext = {
  //   name: 'Select',
  //   text: 'Select',
  //   icon: 'check',
  //   onClick: selectFile,
  // }
  // const deleteContext = {
  //   name: 'Delete',
  //   text: 'Delete',
  //   icon: 'trash',
  //   onClick: deleteFile,
  // }

  /* Toolbar Configs */
  const uploadToolbar = {
    widget: 'dxButton',
    options: {
      text: 'Upload',
      icon: 'upload',
    },
    location: 'before',
    onClick: uploadFile,
  }
  const downloadToolbar = {
    widget: 'dxButton',
    options: {
      text: 'Download',
      icon: 'download',
    },
    location: 'before',
    onClick: downloadFile,
  }
  const selectToolbar = {
    widget: 'dxButton',
    options: {
      text: 'Select',
      icon: 'check',
    },
    location: 'after',
    onClick: selectFile,
  }
  const deleteToolbar = {
    widget: 'dxButton',
    options: {
      text: 'Delete',
      icon: 'trash',
    },
    location: 'after',
    onClick: deleteFile,
  }
  const closeToolbar = {
    widget: 'dxButton',
    options: {
      text: '',
      icon: 'close',
    },
    location: 'after',
    onClick: close,
  }

  /* Functions */
  function selectFile() {
    const newFileUrl = `${SERVER_DATA_SENT.server_address}/${SERVER_DATA_SENT.company}/${state.selected_file.name}`
    const element = state.selected_element
    const elementKey = state.selected_file_key

    // Change Selected Element SRC
    const command = `element.${elementKey} = newFileUrl`
    const func = new Function('element', 'elementKey', 'newFileUrl', command)
    func(element, elementKey, newFileUrl)

    // Change Dom SRC
    const parent = $(`section#${state.selected_section_id}[data-parent]`)
    const fileDomElement = parent.find(`img[data-key="${elementKey}"]`)
    fileDomElement.attr('src', newFileUrl)

    toast('success', 'Image Changed', 'Your image has been changed successfully.')
    $emit('save-state-elements')

    close()
  }

  function refreshFileManager() {
    $('#file-manager').dxFileManager('instance').refresh()
  }

  function close() {
    delete state.selected_file
    delete state.selected_file_key
    $('#file-manager').addClass('hidden')
    refreshFileManager()
  }

  async function deleteFile(e) {
    const settings = {
      url: `${SERVER_DATA_SENT.server_address}/v1/delete-image`,
      method: 'POST',
      timeout: 0,
      processData: false,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ file_name: state.selected_file.name }),
    }
    const result = await $.ajax(settings)
    toast('success', 'File deleted', 'File deleted successfully')
    refreshFileManager()
  }

  function onSelectionChanged(e) {
    if (e.selectedItems.length) {
      state.selected_file = e.selectedItems[0]
    } else delete state.selected_file
  }

  function customizeDetailColumns(columns) {
    columns[2].caption = 'Upload Date'
    return columns
  }

  async function uploadFile(e) {
    const input = $('<input>')
    input.attr('type', 'file')
    input.on('change', async function (event) {
      const file = event.target.files[0]
      const uploadKey = file.name.slice(0, file.name.lastIndexOf('.'))
      const form = new FormData()
      form.append(uploadKey, file, file.name)
      const settings = {
        url: `${SERVER_DATA_SENT.server_address}/v1/upload`,
        method: 'POST',
        timeout: 0,
        processData: false,
        mimeType: 'multipart/form-data',
        dataType: 'json',
        contentType: false,
        data: form,
      }
      $.ajax(settings)
        .then(function (data, status, jqXHR) {
          toast('success', 'Upload successful', 'File uploaded successfully')
          refreshFileManager()
        })
        .catch(function (jqXHR, textStatus, errorThrown) {
          const response = jqXHR.responseJSON
          toast('error', response.message, response.errors.join('.<br />'))
        })
    })
    input.click()
  }

  async function downloadFile(e) {
    const filePath = `${SERVER_DATA_SENT.server_address}/${SERVER_DATA_SENT.company}/${state.selected_file.name}`
    $.ajax({
      url: filePath,
      method: 'GET',
      xhrFields: {
        responseType: 'blob',
      },
      success: function (data) {
        var a = document.createElement('a')
        var url = window.URL.createObjectURL(data)
        a.href = url
        a.download = state.selected_file.name
        a.click()
        window.URL.revokeObjectURL(url)
      },
    })
  }

  const provider = new DevExpress.fileManagement.RemoteFileSystemProvider({
    endpointUrl: `${SERVER_DATA_SENT.server_address}/v1/upload/${SERVER_DATA_SENT.company}`,
  })

  // Main Config
  const fileManagerOptions = {
    rootFolderName: 'images',
    selectionMode: 'single',
    allowedFileExtensions: ['.jpeg', '.jpg', '.png'],
    contextMenu: { items: [] },
    toolbar: {
      items: [uploadToolbar, 'showNavPane', 'switchView', closeToolbar],
      fileSelectionItems: [
        uploadToolbar,
        'separator',
        downloadToolbar,
        deleteToolbar,
        selectToolbar,
        'clearSelection',
        'showNavPane',
        'switchView',
        closeToolbar,
      ],
    },
    fileSystemProvider: provider,
    itemView: { mode: 'thumbnails' },
    upload: { chunkSize: 500000, maxFileSize: 1000000 },
    onSelectionChanged,
    customizeDetailColumns,
    visible: true,
    onErrorOccurred: function (e) {
      console.error('An error occurred', e)
    },
  }
  $('#file-manager').dxFileManager(fileManagerOptions)
})

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
}

/* -------------------------------------------------------------------------- */
/*                               Register Dialog                              */
/* -------------------------------------------------------------------------- */
function sanitizeDialogs() {
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
}

$(function () {
  if (!SERVER_DATA_SENT.editable) return
  sanitizeDialogs()
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

        toast('success', 'Text saved', 'You text changes are saved successfully.')
        $emit('save-state-elements') // FIXME : save just when save button is clicked
      }
    })
})

/* -------------------------------------------------------------------------- */
/*                             Register Link Edit                             */
/* -------------------------------------------------------------------------- */
function addLinkChangeEvent() {
  if (!SERVER_DATA_SENT.editable) return
  $('a').off()
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
}

$(document).ready(function () {
  if (!SERVER_DATA_SENT.editable) return
  addLinkChangeEvent()
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
  toast('success', 'Component Save', 'Your component changes are saved successfully')
  $emit('save-state-elements') // FIXME : save just when save button is clicked
})

/* -------------------------------------------------------------------------- */
/*                       Register Header & Paragraph Tag                      */
/* -------------------------------------------------------------------------- */
function addTagChangerEvent() {
  if (!SERVER_DATA_SENT.editable) return
  const validTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'blockquote']
  $(validTags.join()).each(function (e) {
    $(e.target).off()
    $(this).on('click', function (event) {
      event.preventDefault()
      event.stopPropagation()
      const tagKey = $(this).data('tag')
      const dynamic_id = $(this).closest('[data-parent]').attr('id')
      const tagName = $(this).prop('tagName').toLowerCase()

      if (!(event.ctrlKey || event.metaKey)) return
      if (!tagKey) return

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
}

$(document).ready(function () {
  if (!SERVER_DATA_SENT.editable) return
  addTagChangerEvent()
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
  toast('success', 'Tag Changed', 'Your text tag changed successfully.')
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
  if (!SERVER_DATA_SENT.editable) return

  const dataset = $(this).data('tab')

  const panel = $('#panel')
  const close = panel.find('.panel_close')
  const panelTabContents = panel.find('.panel_body').children()

  panelTabContents.each(function (i, el) {
    if (el.dataset.tab !== dataset) el.style.display = 'none'
    else el.style.display = ''
  })

  openComponentPanel()

  close.on('click', function (e) {
    e.stopPropagation()
    closeComponentPanel()
  })

  $('body').on('click', function (e) {
    var target = $(e.target)
    if (!target.is('#panel') && !target.closest('#panel').length) closeComponentPanel()
  })
})

/* -------------------------------------------------------------------------- */
/*                          Register Delete Component                         */
/* -------------------------------------------------------------------------- */
function addDeleteEvent() {
  if (!SERVER_DATA_SENT.editable) return
  $('.handle_delete').off()
  $('.handle_delete').on('click', function (e) {
    const dynamic_id = $(this).data('id')
    $(`#sortable section#${dynamic_id}`).remove()
    const elements = state.elements.filter(function (el) {
      return el.dynamic_id !== dynamic_id
    })
    state.elements = elements
    toast('success', 'Component Deleted', 'Your component has been deleted successfully.')
    $emit('save-state-elements')
  })
}

$(function () {
  if (!SERVER_DATA_SENT.editable) return
  addDeleteEvent()
})

/* -------------------------------------------------------------------------- */
/*                          Register Change Image Key                         */
/* -------------------------------------------------------------------------- */
function addImageChangeEvent() {
  if (!SERVER_DATA_SENT.editable) return
  $('section').on('click', function (e) {
    const section = $(this)
    const isImage = $(e.target).prop('tagName') === 'IMG'
    if (!section.hasClass('selected')) return
    else if (!isImage) return
    $('#file-manager').removeClass('hidden')
    const dynamic_id = state.selected_section_id
    state.selected_file_key = e.target.dataset.key
  })
}
$(function () {
  if (!SERVER_DATA_SENT.editable) return
  addImageChangeEvent()
})

/* -------------------------------------------------------------------------- */
/*                              Compile Component                             */
/* -------------------------------------------------------------------------- */
function addCompiledComponent(component) {
  $.get(`${SERVER_DATA_SENT.server_address}/components/${component}.ejs`, function (template) {
    const element = _.find(SERVER_DATA_SENT.components, { component })
    const dynamic_id = dynamicIdGenerator()
    element.dynamic_id = dynamic_id
    const htmlCompiler = ejs.compile(template)
    const html = htmlCompiler({ element, data: SERVER_DATA_SENT })
    const finalTemplate = $(/* HTML */ `
      <section id="${element.dynamic_id}" data-parent>
        <div class="handle_top"></div>
        ${html}
        <div class="component_modifier" id="opener_${element.dynamic_id}">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </div>
        <div class="handle_delete" data-id="${element.dynamic_id}">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </div>
      </section>
      <div class="handle_bottom"></div>
    `)
    state.elements.push(element)
    $('#sortable').append(finalTemplate)

    scrollToElement(`section#${dynamic_id}`)

    sanitizeDialogs()
    addTagChangerEvent()
    addLinkChangeEvent()
    addDeleteEvent()
    addImageChangeEvent()
    toast('success', 'Component Added', 'Your component has been added successfully.')
    $emit('save-state-elements')
  })
}
