'use strict'
const path = require('path')
const model = require(path.join(__dirname,'../model', 'main-model.js'))

module.exports.getFormFieldValues = function (formId) {
    let keyValue = {columns: [], values: []}
    $('#' + formId).find('input:visible, textarea:visible').each(function (idx, obj) {
      keyValue.columns.push($(obj).attr('id'))
      keyValue.values.push($(obj).val())
    })
    return keyValue
  }