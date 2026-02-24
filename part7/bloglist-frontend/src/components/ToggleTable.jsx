import { useSelector, useDispatch } from 'react-redux'
import { toggleVisible } from '../reducers/visibleReducer'

const ToggleTable = (props) => {
  const visible = useSelector((state) => state.visible)
  const dispatch = useDispatch()
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => dispatch(toggleVisible())}>{props.buttonlabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={() => dispatch(toggleVisible())}>cancel</button>
      </div>
    </div>
  )
}

export default ToggleTable
