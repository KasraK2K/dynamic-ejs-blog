/* NOTE that all css and js are global so be careful on choosing name for functions and variables */

const hiro_number = document.getElementById('hiro_number')
if (hiro_number)
  hiro_number.addEventListener('click', () => {
    let number = Number(hiro_number.textContent)
    hiro_number.textContent = String(number + 1)
  })