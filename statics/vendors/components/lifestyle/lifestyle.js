// $(document).ready(() => {
//   for (const element of SERVER_DATA_SENT.elements) {
//     $(`section#${element.dynamic_id} .lifestyle_btn`).on('click', () => {
//       $emit('change-element', element.dynamic_id, 1, 2, ['a', 'b', 'c'])
//     })
//   }
// })

function lifeStyleButton(dynamic_id) {
  if (SERVER_DATA_SENT.editable) return
  const element = _.find(SERVER_DATA_SENT.elements, { dynamic_id })
  $emit('change-element', dynamic_id, element)
}

function closeModifyDialog(dynamic_id) {
  $(`#dialog_${dynamic_id}`).dialog('close')
}

function publishModifyDialog(dynamic_id) {
  const title = $(`#title_${dynamic_id}`)
  console.log(title.val())
  closeModifyDialog(dynamic_id)
}

function changeExternalLink(event, dynamic_id, index) {
  // change state on change (this function)
  // replace SERVER_DATA_SENT to state on cancel (cancel btn function)
  // change SERVER_DATA_SENT by using state and save on publish (publish btn  function)

  const element = _.find(SERVER_DATA_SENT.elements, { dynamic_id })
  const type = event.target.dataset.type
  if (type === 'label') {
    element.configuration.external_links[index].label = event.target.value
    $emit('change-element', dynamic_id, element)
  } else if (type === 'link') {
    element.configuration.external_links[index].link = event.target.value
    $emit('change-element', dynamic_id, element)
  } else {
    // show error toast
  }
}
