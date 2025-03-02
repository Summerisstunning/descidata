"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { fetchAPI } from "@/lib/api"

export function ApiTester() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; data?: any } | null>(null)

  const testApiConnection = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // 尝试调用 API 的健康检查端点
      const data = await fetchAPI("/health")

      setResult({
        success: true,
        message: "成功连接到 API 后端!",
        data,
      })
    } catch (error) {
      console.error("API 连接测试失败:", error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "连接 API 失败",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API 连接测试</CardTitle>
        <CardDescription>测试与 API 后端的连接</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <AlertDescription>
                {result.message}
                {result.data && (
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={testApiConnection} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                测试中...
              </>
            ) : (
              "测试 API 连接"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

