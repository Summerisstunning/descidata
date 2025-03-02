// 基础 API 请求函数
export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // 使用环境变量中的 API URL 或默认为相对路径
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
  const url = `${apiUrl}/api${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  const response = await fetch(url, { ...defaultOptions, ...options })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `API 请求失败: ${response.status}`)
  }

  return response.json()
}

// 实验相关 API
export const experimentsAPI = {
  // 获取所有实验
  getAll: () => fetchAPI<any[]>("/experiments"),

  // 获取单个实验详情
  getById: (id: string) => fetchAPI<any>(`/experiments/${id}`),

  // 创建新实验 - 这将调用区块链
  create: async (data: any) => {
    // 这里我们可以直接调用区块链，或者通过 API 路由
    const response = await fetchAPI<any>("/experiments/create", {
      method: "POST",
      body: JSON.stringify(data),
    })

    return response
  },

  // 为实验提供资金 - 这将调用区块链
  fund: async (id: string, amount: string) => {
    const response = await fetchAPI<any>(`/experiments/${id}/fund`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    })

    return response
  },
}

// 健康检查 API
export const healthAPI = {
  check: () => fetchAPI<any>("/health"),
}

