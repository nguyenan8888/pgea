import { Switch } from '@mui/material'

const Checkbox = props => {
  const onSwitchChange = e => {
    if (props.onChange) {
      props.onChange(e.target.checked)
    }
  }

  return (
    <div>
      <Switch checked={props.value} disabled={props?.disabled || false} onChange={onSwitchChange} />
    </div>
  )
}

export default Checkbox
