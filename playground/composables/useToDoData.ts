export type TodoView = 'approvals' | 'requests' | 'tasks'

interface TodoQuery {
    pageNum?: number
    pageSize?: number
}

interface TodoResponse<T = any> {
    data?: T[]
}


const requestMap: Record<TodoView, string> = {
    approvals: '/api/todo/approvals',
    requests: '/api/todo/requests',
    tasks: '/api/todo/todos',
}

const fetchTodoList = async (view: TodoView, query: TodoQuery = {}) => {
    try {
        const response = await $fetch<TodoResponse>(requestMap[view], {
            method: 'POST',
            body: {
                ...query,
            },
        })

        return response?.data || []
    } catch (error) {
        console.error(`Failed to fetch ${view}:`, error)
        throw error
    }
}

export const useToDoData = () => {
    const activeView = useState<TodoView>('todo:active-view', () => 'approvals')
    const approvals = useState<any[]>('todo:approvals', () => [])
    const requests = useState<any[]>('todo:requests', () => [])
    const tasks = useState<any[]>('todo:tasks', () => [])
    const loading = useState<boolean>('todo:loading', () => false)

    const list = computed(() => {
        if (activeView.value === 'requests') {
            return requests.value
        }

        if (activeView.value === 'tasks') {
            return tasks.value
        }

        return approvals.value
    })

    const getApprovals = async (query: TodoQuery = {}) => {
        const data = await fetchTodoList('approvals', query)
        approvals.value = data
        return data
    }

    const getRequests = async (query: TodoQuery = {}) => {
        const data = await fetchTodoList('requests', query)
        requests.value = data
        return data
    }

    const getTodos = async (query: TodoQuery = {}) => {
        const data = await fetchTodoList('tasks', query)
        tasks.value = data
        return data
    }

    const fetchByView = async (view: TodoView, query: TodoQuery = {}) => {
        activeView.value = view
        loading.value = true

        try {
            if (view === 'requests') {
                return await getRequests(query)
            }

            if (view === 'tasks') {
                return await getTodos(query)
            }

            return await getApprovals(query)
        } finally {
            loading.value = false
        }
    }

    return {
        activeView,
        approvals,
        requests,
        tasks,
        list,
        loading,
        getApprovals,
        getRequests,
        getTodos,
        fetchByView,
    }
}
