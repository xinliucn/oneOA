/**
 * Generic async action wrapper for store operations.
 * Eliminates the repeated fetch → loading → error → finally boilerplate
 * found across todos, workfow forms, attachments, weaver URLs, and operators.
 */
import type { Ref } from 'vue'

type AsyncActionOptions<T> = {
  /** Request body / query params */
  payload?: unknown
  /** Called after a successful response to transform it */
  transform?: (response: T) => void
}

type AsyncActionResult<T, R> = {
  data: Ref<R | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  execute: (options?: AsyncActionOptions<T>) => Promise<R | null>
  reset: () => void
}

const getErrorMessage = (error: unknown, fallback = 'Request failed') => {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return fallback
}

/**
 * Generic composable for any async stateful operation.
 *
 * Example:
 *   const { data, loading, error, execute } = useAsyncAction<WorkflowFormApiResponse, WorkflowFormDetail>(
 *     () => $fetch('/api/todos/workflowForm', { method: 'POST' }),
 *     response => response.data,
 *   )
 */
export const useAsyncAction = <TApiResponse, TResult>(
  fetcher: (payload?: unknown) => Promise<TApiResponse>,
  extractor: (response: TApiResponse) => TResult | null | undefined,
  fallbackError = 'Request failed',
): AsyncActionResult<TApiResponse, TResult> => {
  const data = ref<TResult | null>(null) as Ref<TResult | null>
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (options?: AsyncActionOptions<TApiResponse>) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetcher(options?.payload)
      const extracted = extractor(response)

      if (extracted !== undefined && extracted !== null) {
        data.value = extracted
      }

      options?.transform?.(response)

      return extracted ?? null
    }
    catch (err: unknown) {
      const message = getErrorMessage(err, fallbackError)
      error.value = message
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const reset = () => {
    data.value = null
    error.value = null
    loading.value = false
  }

  return {
    data,
    loading,
    error,
    execute,
    reset,
  }
}

export type { AsyncActionOptions, AsyncActionResult, getErrorMessage }
