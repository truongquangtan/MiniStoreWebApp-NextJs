import { Switch } from '@headlessui/react'

export default function SwitchButton({enabled, setEnabled, extra, hint, ...props}) {
    return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      } relative inline-flex ${extra} w-11 h-6 items-center rounded-full`}
    >
      <span className="sr-only">Enable {hint}</span>
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
    )
}