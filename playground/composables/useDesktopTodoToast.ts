export type DesktopTodoToastType = 'approved' | 'rejected'

type DesktopTodoToastState = {
  visible: boolean
  reference: string
  type: DesktopTodoToastType
}

let desktopTodoToastTimer: ReturnType<typeof setTimeout> | undefined

export const useDesktopTodoToast = () => {
  const toast = useState<DesktopTodoToastState>('desktop:todo-toast', () => ({
    visible: false,
    reference: '',
    type: 'approved',
  }))

  const showTodoToast = (reference: string, type: DesktopTodoToastType, duration = 5000) => {
    if (desktopTodoToastTimer) {
      clearTimeout(desktopTodoToastTimer)
    }

    toast.value = {
      visible: true,
      reference,
      type,
    }

    desktopTodoToastTimer = setTimeout(() => {
      toast.value.visible = false
      desktopTodoToastTimer = undefined
    }, duration)
  }

  const hideTodoToast = () => {
    if (desktopTodoToastTimer) {
      clearTimeout(desktopTodoToastTimer)
      desktopTodoToastTimer = undefined
    }

    toast.value.visible = false
  }

  return {
    toast,
    showTodoToast,
    hideTodoToast,
  }
}
