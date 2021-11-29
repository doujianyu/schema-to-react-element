import { isObject } from './utils'
import React from 'react'

export interface ISchemaObj {
  baseType: string
  props?: (React.HTMLAttributes<any> & React.ClassAttributes<any>) | null
  children?: React.ReactNode[] | ISchemaObj
  key?: React.Key
}

export interface ISchemaArr {
  [index: number]: ISchemaObj
}

export interface IUiLibObj {
  [propName: string]: React.Component | React.FunctionComponent
}

export interface ISchemaToReactElementOptions {
  createElement?: Function
  uiLib?: IUiLibObj
}

let customNumber: number = 0

/**
 * 架构对象转 react element
 * @param UiLib 架构对象中使用到的 自定义组件集合
 * @param createElement React.createElement 函数为了这个文件可以单独使用，和减少包的体积这个参数改为传入
 * @param schema 架构对象
 * @returns React.createElement
 */
export function s2r(
  UiLib: IUiLibObj = {},
  createElement: Function,
  schema?: ISchemaObj | string | number
): React.DetailedReactHTMLElement<any, HTMLElement> | number | string | null {
  // 如果 转换的 JSON 不存在直接返回 null
  if (!schema) return null

  // 如果为 string || number 直接返回
  if (typeof schema === 'number' || typeof schema === 'string') return schema

  // 如果结构不是 string | number | object(ISchemaObj)
  if (!isObject(schema)) {
    throw new Error('The schema must be a string or number or a normal object')
  }

  // 判断 schema 的 baseType是否存在
  const curtSchemaBaseType =
    schema.baseType &&
    typeof schema.baseType === 'string' &&
    schema.baseType.trim() !== ''

  if (!curtSchemaBaseType) {
    throw new Error('schema.baseType Must be a non empty string')
  }

  // 如果 props 存在但不是一个标准对象
  const curtSchemaProps =
    schema.props === undefined ||
    (schema.props !== undefined && isObject(schema))

  if (!curtSchemaProps) {
    throw new Error('schema.props Must be a normal object')
  }

  // baseType 去除多余空格
  schema.baseType = schema.baseType.trim()

  let baseType = UiLib[schema.baseType] ?? schema.baseType
  let props = schema.props || null
  let children = null
  if (schema.children) {
    children = []
      .concat(schema.children)
      .map(s2r.bind(null, UiLib, createElement))
  }

  // 没有这只key时自动生成
  if (props) props.key = props.key || `s2r-${++customNumber}`

  return createElement(baseType, props, children)
}

class SchemaToReactElement {
  createElement: Function
  uiLib: IUiLibObj

  constructor({
    createElement,
    uiLib
  }: ISchemaToReactElementOptions = {}) {
    this.createElement = createElement ?? React.createElement
    this.uiLib = uiLib ?? {}

    this.schemaToReactElement = this.schemaToReactElement.bind(this)
  }

  schemaToReactElement(
    schema: ISchemaArr | ISchemaObj,
    toArray = false
  ) {
    if (!schema || !(Array.isArray(schema) || isObject(schema))) {
      throw new Error('You must pass in an element object or an element array')
    }

    if (isObject(schema)) {
      const children = s2r(this.uiLib, this.createElement, schema as ISchemaObj)
      return !toArray ? children : [children]
    }

    if (Array.isArray(schema)) {
      const children = schema.map((schemaItem, index) => {
        const schema = {
          ...schemaItem,
          props: Object.assign(
            { key: schemaItem.key || `.${index}` },
            schemaItem.props || {}
          )
        }
        return s2r(this.uiLib, this.createElement, schema)
      })
      if (!toArray) {
        return this.createElement('div', null, children)
      }

      return children
    }

    return null
  }
}

export default SchemaToReactElement
