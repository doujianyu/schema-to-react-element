# schema-to-react-element

将结构数据转换为 `react element` 的库

### 快速开始

```js
import SchemaToElement from 'schema-to-react-element'

const schemaToElement = new SchemaToElement()
const schema = [
  {
    baseType: "div",
    props: {
      className: 'div'
    },
    children: [
      {
        baseType: 'span',
        props: {
          className: 'span'
        },
        children: 'span'
      }
    ]
  }
]

ReactDOM.render(schemaToElement.schemaToReactElement(schema), document.querySelector('#app'))
```

### 使用UI库
```js
import SchemaToElement from 'schema-to-react-element'
import * as Antd from 'antd'

const schemaToElement = new SchemaToElement({
  uiLib: Antd
})
const schema = [
  {
    baseType: 'Input',
    props: {
      placeholder: '请输入'
    }
  }
]

ReactDOM.render(schemaToElement.schemaToReactElement(schema), document.querySelector('#app'))
```

### 参数说明
* new SchemaToElement({
  uiLib,
  createElement
})
> * uiLib UI 组件的集合, `baseType` 优先命中这个集合，如果没有则创建为普通的 `DOM` 元素

> * createElement 创建元素的方法, 默认为 `React.createElement`

* schemaToElement.schemaToReactElement([ISchemaArr | ISchemaObj])
```js
interface ISchemaObj {
  baseType: string
  props?: (React.HTMLAttributes<any> & React.ClassAttributes<any>) | null
  children?: React.ReactNode[] | ISchemaObj
  key?: React.Key
}

interface ISchemaArr {
  [index: number]: ISchemaObj
}
```