import { useState, useLayoutEffect, useRef } from 'react'
import './App.css'

function App() {
  const [{ text, width }, setState] = useState({
    text: localStorage.getItem('text') || '',
    width: localStorage.getItem('width') || '100',
  })
  const [minFontSize, setMinFontSize] = useState(10)
  const maxFontSize = 40

  const ref = useRef<HTMLDivElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  const [{ refWidth, spanRefWidth }, setWidths] = useState({
    refWidth: 0,
    spanRefWidth: 0,
  })

  useLayoutEffect(() => {
    if (ref?.current && spanRef?.current) {
      setWidths({
        refWidth: ref?.current?.clientWidth,
        spanRefWidth: spanRef?.current?.getBoundingClientRect().width,
      })
    }
  }, [setWidths, ref, spanRef, text, width, minFontSize])

  const span = document.getElementById('span') as HTMLElement
  const fontSize = span
    ? window.getComputedStyle(span, null).getPropertyValue('font-size')
    : '0'
  const currentFontSize = parseFloat(fontSize)
  const ratio = (refWidth / spanRefWidth) * currentFontSize

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    localStorage.setItem(name, value)
    setState((prevState) => {
      return { ...prevState, [name]: value }
    })
  }

  return (
    <>
      <div className="app">
        <h1>The perfect text fit</h1>
        <div className="inputs-wrapper">
          <input
            className="input-text"
            placeholder="Enter text"
            name="text"
            type="text"
            onChange={onChange}
          />
        </div>

        <div className="inputs-wrapper">
          <label className="label" htmlFor="input-size">
            Min. font size:
          </label>
          <input
            className="input-size"
            id="input-size"
            placeholder="Minimum font size"
            type="number"
            min="1"
            max={maxFontSize}
            step="1"
            value={minFontSize}
            onChange={({ target: { value } }) =>
              setMinFontSize(parseInt(value))
            }
          />
          <label className="label" htmlFor="input-range">
            Output width:
          </label>
          <input
            className="input-range"
            id="input-range"
            name="width"
            type="range"
            min="100"
            max={window.innerWidth}
            step="10"
            value={parseInt(width)}
            onChange={onChange}
          />
        </div>
        <h4>Output:</h4>
        <div
          className="output"
          style={{
            width: `${width}px`,
            fontSize: `clamp(${minFontSize}px, ${ratio}px, ${maxFontSize}px)`,
            textOverflow: `${currentFontSize <= minFontSize ? 'ellipsis' : ''}`,
          }}
          ref={ref}
        >
          <span id="span" ref={spanRef}>
            {text}
          </span>
        </div>
      </div>
    </>
  )
}

export default App
