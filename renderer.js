// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { ipcRenderer, shell } = require('electron')
window.$ = window.jQuery = require('jquery')

document.querySelectorAll('[data-choice]').forEach(item => {
    item.addEventListener('click', (e) => {
        const choice = e.target.getAttribute("data-choice");
        ipcRenderer.send('copy', choice)
    })
})

ipcRenderer.on('copy-response', (event, arg) => {
  console.log(arg) // prints "pong"
})

$('.barwrappers span').on('mouseover', function(e){
    const index = $(this).index()
    const label = $(this).parent().data('label')
    if (index > 0) {
        $('[data-selection]').text(`${index + 1} ${label}s`)
    } else {
        $('[data-selection]').text(`${index + 1} ${label}`)
    }
})

$('.barwrappers span').on('click', function(e){
    const index = $(this).index()
    const label = $(this).parent().data('label')
    ipcRenderer.send('lorem', {index: index + 1, label: label})
})

$('.options').on('click', 'li', function(e){
    const target = $(this).data('target')

    $('.options').find('li').removeClass('active')
    $('.tab').removeClass('tab--active')

    $(this).addClass('active')
    $(document).find(target).addClass('tab--active')
})

$('a').on('click', function(e){
    e.preventDefault();
    const url = $(this).attr('href');
    shell.openExternal(url)
})