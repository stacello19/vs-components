# PIE

---

## Props

- [width: number](#width)
- [height: number](#height)
- [dataKey: string](#datakey)
- [value: string](#value)
- [colorPalette: array](#colorpalette)
- [colorType: string](#colortype)
- [margin: number](#margin)
- [style: object](#style)
- [text: object](#text)
- [arc: object](#arc)
- [tooltip: object](#tooltip)
- [hoverStyle: object](#hoverstyle)

---

### Width

- **Required**

### Height

- **Required**

## DataKey

- **Required**
- Object key name from data to display in Pie graph
- For ex: `data=[{type: 'b', amount: 300 }]`  
  We define the key as **_type_** as you can see in the image.  
  ![](https://user-images.githubusercontent.com/45322680/150199504-84730b22-0df4-4ccb-b99e-b73cf83bb2e0.png)

## Value

- **Required**
- Object key name from data to display in Pie graph
- For ex: `data=[{type: 'b', amount: 300 }]`  
  We define the value as **_amount_** as you can see in the image.  
  ![](https://user-images.githubusercontent.com/45322680/150199504-84730b22-0df4-4ccb-b99e-b73cf83bb2e0.png)

## ColorPalette

- _Optional_
- Array of color to fill the pie graph. You can personally pick the colors to show in the graph
- For ex: `['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6']`

## ColorType

- _Optional_
- Array of color to fill the pie graph
- It has default value as **_Color-1_**
- List of ColorType  
  | ColorType | ColorSet |
  | ------------- |:-------------:|
  | Color-1 | ![](https://user-images.githubusercontent.com/45322680/150201979-8bd47bd5-59bf-4c6e-b5a0-cedca53c41c5.png) |
  | Color-2 | ![](https://user-images.githubusercontent.com/45322680/150202142-b5182651-e592-4714-986b-21df45ae975d.png) |
  | Color-3 | ![](https://user-images.githubusercontent.com/45322680/150202596-8ff79f8b-82a8-4032-a070-9f728ad90453.png) |
  | Color-4 | ![](https://user-images.githubusercontent.com/45322680/150203647-0d02b132-58dc-4092-8ca6-ea76276aafda.png) |
  | Color-5 | ![](https://user-images.githubusercontent.com/45322680/150203726-0c591877-0b2c-442f-b751-2949ee70caa5.png) |
  | Color-6 | ![](https://user-images.githubusercontent.com/45322680/150203829-d082dd37-a256-4ff0-a798-14361b0c50e7.png) |
  | Color-7 | ![](https://user-images.githubusercontent.com/45322680/150203884-35ff24f4-5378-4ee0-b498-0cb871ba0ab6.png) |
  | Color-8 | ![](https://user-images.githubusercontent.com/45322680/150204009-ce79040d-2894-4da3-bce9-be2faeda1b79.png) |
  | Color-9 | ![](https://user-images.githubusercontent.com/45322680/150204067-63986a76-d034-4838-a5d1-91659d83b396.png) |
  | Color-10 | ![](https://user-images.githubusercontent.com/45322680/150204117-31a221e5-afc2-4e63-87a7-7e587b91b462.png) |

### Margin

- _Optional_

### Style

- _Optional_
- _Styling for the Pie graph_
- style is object and it contains following: _stroke_, _strokeWidth_, _strokeColor_, _opacity_
- style.stroke: boolean (Default value is `false`. This enables the style to be on and off)
- style.strokeWidth: string (Default value is `'none'`. For ex: `'1px'`)
- style.strokeColor: string (Default value is `'none'`. For ex: `'black'`)
- style.opacity: number (Default value is `null`. For ex: `0.8`)

### Text

- _Optional_
- _Text and Text Styling_
- text is object and it contains following: _label_, _textSize_, _textAnchor_, _textFamily_, _textWeight_
- text.show: boolean (Default value is `false`. This enables the text to be on and off)
- text.textSize: number (Default value is `12`)
- text.textAnchor: string (Default value is `'middle'`. Options: `'start', 'middle', 'end'`)
- text.textFamily: string (Default value is `'serif'`)
- text.textWeight: number (Default value is `400`)  
  ![](https://user-images.githubusercontent.com/45322680/150211897-6aef75bf-bc14-408f-9838-9cf590488ebd.png)

### Arc

- _Optional_
- arc is object and it contains following: _padAngle_, _cornerRadius_
- arc.padAngle: number (Default value is `0`. Range is between `0.02 <= padAngle <= 0.1`.)  
  ![](https://user-images.githubusercontent.com/45322680/150208756-8480f26d-2076-4760-b22e-bda70721588d.png)
- arc.cornerRadius: number (Default value is `0`)  
  ![](https://user-images.githubusercontent.com/45322680/150209072-16de16bd-a78f-44e5-96c2-2e8ad89dbc06.png)

### Tooltip

- _Optional_
- _Tooltip and Tooltip Styling_
- tooltip is object and it contains following: _show_, _background_, _border_, _borderRadius_, _padding_, _color_, _fontFamily_, _fontWeight_, _text_
- tooltip.show: boolean (Default value is `false`. This enables the tooltip to be on and off)
- tooltip.background: string (Default value is `'#FFF'`)
- tooltip.border: string (Default value is `'none'`)
- tooltip.borderRadius: string (Default value is `'0px'`)
- tooltip.padding: string (Default value is `'0px'`)
- tooltip.color: string (Default value is `'black'`)
- tooltip.fontFamily: string (Default value is `'serif'`)
- tooltip.fontWeight: number (Default value is `400`)
- tooltip.text: string (For ex: `'<div>Hello.</div><div>(%key%): (%value%)</div>'`)  
  You can show data by wrapping the data key with this syntax **(% %)** around it.  
  ![](https://user-images.githubusercontent.com/45322680/150210232-074a2454-d91c-4945-82f3-1c3e9a449d4f.png)

### HoverStyle

- _Optional_
- _Styling when the mouse hovers_
- hoverStyle is object and it contains following: _style_, _opacity_, _strokeWidth_, _strokeColor_, _cursorPointer_
- hoverStyle.style: boolean (Default value is `false`. This enables the hoverStyle to be on and off)
- hoverStyle.opacity: number or string (Default value is `'none'`. For ex: `opacity: 0.8`)
- hoverStyle.strokeWidth: string (Default value is `'none'`. For ex: `'1px'`)
- hoverStyle.strokeColor: string (Default value is `'none'`. For ex: `'black'`)
- hoverStyle.cursorPointer: string or null (Default value is `null`. For ex: `'pointer'`)
