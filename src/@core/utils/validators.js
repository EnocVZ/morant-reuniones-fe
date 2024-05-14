import { isEmpty, isEmptyArray, isNullOrUndefined } from './helpers'

// 👉 Required Validator
export const requiredValidator = value => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return 'El valor del campo es requerido'

  return !!String(value).trim().length || 'El valor del campo es requerido'
}

// 👉 Email Validator
export const emailValidator = value => {
  if (isEmpty(value))
    return true
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (Array.isArray(value))
    return value.every(val => re.test(String(val))) || 'El valor del correo electrónico debe ser un correo electrónico válido'

  return re.test(String(value)) || 'El valor del correo electrónico debe ser un correo electrónico válido'
}

// 👉 Password Validator
export const passwordValidator = password => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/
  const validPassword = regExp.test(password)

  return validPassword || 'El valor del campo debe contener al menos una mayúcula, una minúscula, un carácter especial y un dígito con un mínimo de 8 caracteres'
}

export const telefonoValidator = telefono => {
  const regExp = /^09[0-9]{7}$/gm
  const validtelefono = regExp.test(telefono)

  return validtelefono || 'El telefono no tiene el formato correcto'
}

// 👉 Confirm Password Validator
export const confirmedValidator = (value, target) => value === target || 'La confirmación del campo confirmar contraseña no coincide'

// 👉 Between Validator
export const betweenValidator = (value, min, max) => {
  const valueAsNumber = Number(value)

  return (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) || `Introduzca el número entre ${min} y ${max}`
}

// 👉 Integer Validator
export const integerValidator = value => {
  if (isEmpty(value))
    return true
  if (Array.isArray(value))
    return value.every(val => /^-?[0-9]+$/.test(String(val))) || 'El valor del campo debe de ser número entero'

  return /^-?[0-9]+$/.test(String(value)) || 'El valor del campo debe de ser número entero'
}

// 👉 Regex Validator
export const regexValidator = (value, regex) => {
  if (isEmpty(value))
    return true
  let regeX = regex
  if (typeof regeX === 'string')
    regeX = new RegExp(regeX)
  if (Array.isArray(value))
    return value.every(val => regexValidator(val, regeX))

  return regeX.test(String(value)) || 'El formato del valor del campo no es válido'
}

// 👉 Alpha Validator
export const alphaValidator = value => {
  if (isEmpty(value))
    return true

  return /^[A-Z]*$/i.test(String(value)) || 'El valor del campo solo puede contener caracteres alfabéticos'
}

// 👉 URL Validator
export const urlValidator = value => {
  if (isEmpty(value))
    return true
  const re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/

  return re.test(String(value)) || 'La URL no es válida'
}

// 👉 Length Validator
export const lengthValidator = (value, length) => {
  if (isEmpty(value))
    return true

  return String(value).length >= length || `El valor mínimo del campo debe de tener al menos ${length} carácteres`
}

//
export const maxLengthValidator = (value, length) => {
  if (isEmpty(value))
    return true

  return String(value).length <= length || `El valor máximo del campo es de ${length} carácteres`
}

// 👉 Alpha-dash Validator
export const alphaDashValidator = value => {
  if (isEmpty(value))
    return true
  const valueAsString = String(value)

  return /^[0-9A-Z_-]*$/i.test(valueAsString) || 'All Character are not valid'
}

