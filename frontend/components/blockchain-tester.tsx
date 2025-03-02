"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { getProvider } from "@/lib/blockchain"

export function BlockchainTester() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const testConnection = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const provider = getProvider()
      const network = await provider.getNetwork()
      const blockNumber = await provider.getBlockNumber()

      setResult({
        success: true,
        message: `成功连接到区块链网络! 网络ID: ${network.chainId}, 最新区块: ${blockNumber}`,
      })
    } catch (error) {
      console.error("区块链连接测试失败:", error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "连接区块链失败",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>区块链连接测试</CardTitle>
        <CardDescription>测试与区块链网络的连接</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <Button onClick={testConnection} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                测试中...
              </>
            ) : (
              "测试区块链连接"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

