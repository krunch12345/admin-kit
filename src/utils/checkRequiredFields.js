import { has, isPlainObject, isEmpty } from 'lodash-es'

export const checkRequiredFields = (data, requiredFields) => {
  if (!data || typeof data !== 'object') {
    console.error('Ошибка: Входной объект \'data\' некорректен.')
    return false
  }
  if (!Array.isArray(requiredFields) || requiredFields.length === 0) {
    console.error('Ошибка: Массив \'requiredFields\' некорректен.')
    return false
  }

  for (const field of requiredFields) {
    if (!has(data, field)) {
      console.warn(`Ошибка: Поле '${field}' отсутствует в объекте данных.`)
      return false
    }

    const value = data[field]

    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0) ||
      (isPlainObject(value) && isEmpty(value))) {
      console.warn(`Ошибка: Поле '${field}' имеет пустое или некорректное значение.`)
      return false
    }
  }

  return true
}
