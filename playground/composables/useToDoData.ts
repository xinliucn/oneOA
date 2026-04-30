export type TodoView = 'approvals' | 'requests' | 'tasks'

export interface WorkflowFormAttachment {
    id: string
    name: string
    url?: string
    raw: Record<string, unknown>
}

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

const stripHtml = (value?: string | number | null) => {
    if (value === null || value === undefined) {
        return ''
    }

    return String(value)
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim()
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return !!value && typeof value === 'object' && !Array.isArray(value)
}

const getStringValue = (record: Record<string, unknown>, key: string) => {
    const value = record[key]

    if (typeof value === 'string' || typeof value === 'number') {
        return value
    }

    return ''
}

const unwrapWorkflowAttachmentPayload = (payload: unknown): unknown => {
    if (!payload) {
        return []
    }

    if (Array.isArray(payload)) {
        return payload
    }

    if (!isRecord(payload)) {
        return []
    }

    return payload.data
        ?? payload.result
        ?? payload.attachments
        ?? payload.attachmentList
        ?? payload.filedatas
        ?? payload.files
        ?? payload.list
        ?? []
}

const normalizeWorkflowFormAttachments = (payload: unknown): WorkflowFormAttachment[] => {
    const data = unwrapWorkflowAttachmentPayload(payload)

    if (!Array.isArray(data)) {
        return normalizeWorkflowFormAttachments(data)
    }

    return data.map((item, index) => {
        const file = isRecord(item) ? item : {}
        const url = getStringValue(file, 'downloadUrl')
            || getStringValue(file, 'downloadurl')
            || getStringValue(file, 'url')
            || getStringValue(file, 'fileUrl')

        return {
            id: String(
                getStringValue(file, 'id')
                || getStringValue(file, 'fileid')
                || getStringValue(file, 'fileId')
                || getStringValue(file, 'docid')
                || getStringValue(file, 'docId')
                || index,
            ),
            name: stripHtml(
                getStringValue(file, 'name')
                || getStringValue(file, 'filename')
                || getStringValue(file, 'fileName')
                || getStringValue(file, 'docname')
                || getStringValue(file, 'docName')
                || `File ${index + 1}`,
            ),
            ...(url ? { url: String(url) } : {}),
            raw: file,
        }
    })
}

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
    const formAttachments = useState<WorkflowFormAttachment[]>('todo:form-attachments', () => [])
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

    const getFormAttachments = async (requestid: string) => {
        try {
            const response = await $fetch<unknown>('/api/todo/formAttachments', {
                method: 'POST',
                body: {
                    requestid,
                },
            })
            const responseData = isRecord(response) ? response.data ?? response : response

            formAttachments.value = normalizeWorkflowFormAttachments(responseData)
            return formAttachments.value
        } catch (error) {
            console.error('Fetch workflow form attachments failed:', error)
            formAttachments.value = []
            return []
        }
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
        formAttachments,
        list,
        loading,
        getApprovals,
        getRequests,
        getTodos,
        getFormAttachments,
        fetchByView,
    }
}
