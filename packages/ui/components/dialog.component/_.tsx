import { CloseIcon } from "../../icons"
import ActionButton from "../action-button.component"

export type DialogComponentProps = {
  title: string
  content?: string
  show?: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

export default function DialogComponent(props: DialogComponentProps) {
  return !props.show ? null : (
    <div
      id="modelConfirm"
      className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 backdrop-blur"
    >
      <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
        <div className="flex justify-end p-2">
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 pt-0 text-center">
          <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">{props.title}</h3>
          <p className="text-gray-500 mb-6">{props.content}</p>
          <div className="flex gap-2 justify-end">
            <ActionButton className="btn-secondary" onClick={props.onCancel}>
              No
            </ActionButton>
            <ActionButton className="btn-warning" onClick={props.onConfirm}>
              Yes
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  )
}
