// $(document).ready(() => {
//   for (const element of SERVER_DATA_SENT.elements) {
//     $(`section#${element.dynamic_id} .lifestyle_btn`).on('click', () => {
//       $emit('change-element', element.dynamic_id, 1, 2, ['a', 'b', 'c'])
//     })
//   }
// })

function lifeStyleEmitter(dynamic_id) {
  const element = _.find(SERVER_DATA_SENT.elements, { dynamic_id })
  $emit('change-element', dynamic_id, element)
}
