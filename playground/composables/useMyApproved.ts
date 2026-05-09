interface MyApprovedWorkflowItem {
  createTime?: string
  creatorDepartmentName?: string
  creatorName?: string
  currentNodeName?: string
  lastOperateTime?: string
  requestId?: string
  requestName?: string
  requestmark?: string
  status?: string
  workflowBaseInfo?: {
    workflowName?: string
    workflowTypeName?: string
  }
}

export const useMyApproved = () => {
  const approvals = useState<MyApprovedWorkflowItem[]>('my-approved:list', () => [])
  const loading = useState<boolean>('my-approved:loading', () => false)

  const getApprovalById = (id: string) => {
    return approvals.value.find(item => item.requestId === id || item.requestmark === id) || null
  }

  const refreshFromServer = async () => {
    loading.value = true

    try {
      const response = await $fetch<MyApprovedWorkflowItem[]>('/api/myApproved/workflowList', {
        method: 'POST',
      })

      approvals.value = response
    }
    catch (error) {
      console.error('Fetch my approved workflow list failed:', error)
      approvals.value = []
    }
    finally {
      loading.value = false
    }
  }

  //   const bootstrap = async () => {
  //     if (bootstrapped.value) {
  //       return
  //     }

  //     await refreshFromServer()
  //     bootstrapped.value = true
  //   }

  //   const ensureApproval = async (id: string) => {
  //     if (!getApprovalById(id)) {
  //       await bootstrap()
  //     }

  //     return getApprovalById(id)
  //   }

  //   const submitApprovalAction = async (id: string, action: ApprovalAction, comment = '') => {
  //     const approval = getApprovalById(id)

  //     if (!approval) {
  //       return null
  //     }

  //     approval.status = actionStatusMap[action]
  //     approval.processStatus = actionLabelMap[action]
  //     approval.latestComment = comment.trim()
  //     approval.approvers.push({
  //       name: 'You',
  //       action: actionLabelMap[action],
  //       date: new Date().toLocaleString('zh-CN', { hour12: false }),
  //       role: 'Mobile action',
  //     })

  //     approvals.value = [...approvals.value]
  //     return approval
  //   }

  return {
    approvals,
    loading,
    // bootstrap,
    refreshFromServer,
    getApprovalById,
    // ensureApproval,
    // submitApprovalAction,
  }
}
