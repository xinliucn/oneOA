export type TodoView = 'approvals' | 'requests' | 'tasks'

interface TodoQuery {
    pageNo?: number
    pageNum?: number
    pageSize?: number
    conditions?: Record<string, unknown>
    otherParams?: Record<string, unknown>
}

interface TodoResponse<T = any> {
    data?: T[] | TodoResponse<T>
}

type TodoListResponse<T = any> = T[] | TodoResponse<T>

const requestMap: Record<TodoView, string> = {
    approvals: '/api/todo/approvals',
    requests: '/api/todo/requests',
    tasks: '/api/todo/todos',
}

const normalizeTodoListResponse = <T = any>(response?: TodoListResponse<T> | null): T[] => {
    if (Array.isArray(response)) {
        return response
    }

    if (Array.isArray(response?.data)) {
        return response.data
    }

    return normalizeTodoListResponse(response?.data)
}

const getPageNo = (query: TodoQuery) => query.pageNo ?? query.pageNum ?? 1

const buildTodoListPayload = (view: TodoView, query: TodoQuery) => {
    if (view === 'approvals') {
        return {
            pageNo: getPageNo(query),
            pageSize: 10,
            otherParams: { is_handled: false },
        }
    }

    if (view === 'requests') {
        return {
            pageNo: getPageNo(query),
            pageSize: 10,
            otherParams: { countOnly: false },
        }
    }

    if (view === 'tasks') {
        return {
            pageNo: getPageNo(query),
            pageSize: 100,
            conditions: {},
            otherParams: { ismonitor: '1' },
        }
    }
}

const fetchTodoList = async <T = any>(view: TodoView, query: TodoQuery = {}): Promise<T[]> => {
    try {
        const response = await $fetch<TodoListResponse<T>>(requestMap[view], {
            method: 'POST',
            body: buildTodoListPayload(view, query),
        })
        const data = normalizeTodoListResponse(response)
        return data
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
