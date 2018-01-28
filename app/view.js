'use strict'
const path = require('path')
const model = require(path.join(__dirname, 'model.js'))

module.exports.showUsers = function (rowsObject) {
  let markup = ''
  for (let rowId in rowsObject) {
    let row = rowsObject[rowId]
    markup += '<div class="row justify-content-start">' +
    '<div class="col-xs-2 edit-icons"><a href="#"><img id="edit-pid_' +
    row.ID + '" class="icon edit" src="' +
    path.join(__dirname, 'img', 'edit-icon.png') + '"></a>' +
    '<a href="#"><img id="del-pid_' + row.id +
    '" class="icon delete" src="' + path.join(__dirname, 'img', 'x-icon.png') +
    '"></a></div>' +
    '<div class="col-xs-5 name">' + row.lastname + ',&nbsp;</div>' +
    '<div class="col-xs-5 name">' + row.firstname + '</div>' +
    '</div>'
  }
  $('#add-user, #edit-user').hide()
  $('#user-list').html(markup)
  $('a.nav-link').removeClass('active')
  $('a.nav-link.user').addClass('active')
  $('#user').show()
  $('#user-list img.edit').each(function (idx, obj) {
    $(obj).on('click', function () {
      window.view.editUser(this.id)
    })
  })
  $('#user-list img.delete').each(function (idx, obj) {
    $(obj).on('click', function () {
      window.view.deleteUser(this.id)
    })
  })
}

module.exports.listUser = function (e) {
  $('a.nav-link').removeClass('active')
  $(e).addClass('active')
  $('#edit-user').hide()
  window.model.getUsers()
  $('#user').show()
}

module.exports.addUser = function (e) {
  $('a.nav-link').removeClass('active')
  $(e).addClass('active')
  $('#user').hide()
  $('#edit-user h2').html('Add User')
  $('#edit-user-submit').html('Save')
  $('#edit-user-form input').val('')
  $('#edit-user-form').removeClass('was-validated')
  $('#first_name, #last_name')
    .removeClass('is-valid is-invalid')
  $('#user_id').parent().hide()
  $('#edit-user').show()
}

module.exports.editUser = function (uid) {
  $('#edit-user h2').html('Edit User')
  $('#edit-user-submit').html('Update')
  $('#edit-user-form').removeClass('was-validated')
  $('#first_name, #last_name')
    .removeClass('is-valid is-invalid')
  $('#user_id').parent().show()
  uid = uid.split('_')[1]
  let row = model.getUser(uid)[0]
  $('#user_id').val(row.ID)
  $('#first_name').val(row.FirstName)
  $('#last_name').val(row.LastName)
  $('#user, #add-user').hide()
  $('#edit-user').show()
}

module.exports.deletePerson = function (uid) {
  model.deleteUser(uid.split('_')[1], $('#' + uid).closest('div.row').remove())
}

module.exports.getFormFieldValues = function (formId) {
  let keyValue = {columns: [], values: []}
  $('#' + formId).find('input:visible, textarea:visible').each(function (idx, obj) {
    keyValue.columns.push($(obj).attr('id'))
    keyValue.values.push($(obj).val())
  })
  return keyValue
}