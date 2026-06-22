import type { WorkflowTodoItem } from '~/types/todo'

export type TodoFilterOption = {
  label: string
  value: string
  count: number | null
}

type TodoFilterCountOption = TodoFilterOption & {
  count: number
}

export const normalizeTodoFilterValue = (value?: string | null) => {
  return String(value || '').trim().toLowerCase()
}

export const getTodoCategoryLabel = (task: WorkflowTodoItem) => {
  return String(task.workflowBaseInfo?.workflowTypeName || '').trim()
}

export const getTodoStatusLabel = (task: WorkflowTodoItem) => {
  return String(task.status || task.currentNodeName || '').trim()
}

export const createTodoFilterOptions = (
  tasks: WorkflowTodoItem[],
  getLabel: (task: WorkflowTodoItem) => string,
): TodoFilterOption[] => {
  const optionMap = new Map<string, TodoFilterCountOption>()

  tasks.forEach((task) => {
    const label = getLabel(task)
    const value = normalizeTodoFilterValue(label)

    if (!label || !value) {
      return
    }

    const current = optionMap.get(value)
    if (current) {
      current.count += 1
      return
    }

    optionMap.set(value, {
      label,
      value,
      count: 1,
    })
  })

  return Array.from(optionMap.values())
}
