"use client"

import { useState, useEffect } from "react"
import { experimentsAPI } from "@/lib/api"

export function useExperimentDetails(id: string) {
  const [experiment, setExperiment] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadExperiment() {
      try {
        setIsLoading(true)
        const data = await experimentsAPI.getById(id)
        setExperiment(data)
      } catch (err) {
        console.error(`加载实验 ${id} 失败:`, err)
        setError(err instanceof Error ? err : new Error("加载实验详情失败"))
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadExperiment()
    }
  }, [id])

  const fundExperiment = async (amount: string) => {
    try {
      await experimentsAPI.fund(id, amount)
      // 重新加载实验数据以获取最新状态
      const updatedData = await experimentsAPI.getById(id)
      setExperiment(updatedData)
      return true
    } catch (err) {
      console.error(`为实验 ${id} 提供资金失败:`, err)
      throw err instanceof Error ? err : new Error("提供资金失败")
    }
  }

  return {
    experiment,
    isLoading,
    error,
    fundExperiment,
  }
}

