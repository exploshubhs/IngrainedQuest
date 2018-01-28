'use strict'
const fs = require('fs')
const path = require('path')
const app = require('electron').remote.app
const cheerio = require('cheerio')

window.$ = window.jQuery = require('jquery')
window.Tether = require('tether')
window.Bootstrap = require('bootstrap')

let webRoot = path.dirname(__dirname)
window.view = require(path.join(webRoot, 'view.js'))
window.model = require(path.join(webRoot, 'model.js'))
window.model.db = path.join(app.getPath('userData'), 'IngrainedQuest.db')

//Global Connection
var remote = require('electron').remote;     
    console.log(remote.getGlobal('postGresConnection').connection);     
     

window.model.connection=remote.getGlobal('postGresConnection').connection;

// Compose the DOM from separate HTML concerns; each from its own file.
let htmlPath = path.join(app.getAppPath(), 'app', 'html')
let body = fs.readFileSync(path.join(htmlPath, 'body.html'), 'utf8')
let navBar = fs.readFileSync(path.join(htmlPath, 'nav-bar.html'), 'utf8')
let menu = fs.readFileSync(path.join(htmlPath, 'menu.html'), 'utf8')
let user = fs.readFileSync(path.join(htmlPath, 'user.html'), 'utf8')
let editUser = fs.readFileSync(path.join(htmlPath, 'edit-user.html'), 'utf8')

let O = cheerio.load(body)
O('#nav-bar').append(navBar)
O('#menu').append(menu)
O('#user').append(user)
O('#edit-user').append(editUser)

// Pass the DOM from Cheerio to jQuery.
let dom = O.html()
$('body').html(dom)

$('document').ready(function () {
  window.model.getUsers(window.model.connection)
  $('#edit-user-submit').click(function (e) {
    e.preventDefault()
    let ok = true
    $('#first_name, #last_name').each(function (idx, obj) {
      if ($(obj).val() === '') {
        $(obj).removeClass('is-valid').addClass('is-invalid')
        ok = false
      } else {
        $(obj).addClass('is-valid').removeClass('is-invalid')
      }
    })
    if (ok) {
      $('#edit-user-form').addClass('was-validated')
      let formId = $(e.target).parents('form').attr('id')
      let keyValue = window.view.getFormFieldValues(formId)
      window.model.saveFormData('Users', keyValue, function () {
        window.model.getUsers()
      })
    }
  })
})
