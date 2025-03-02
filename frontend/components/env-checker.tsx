"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

export function EnvChecker() {
  const [checked, setChecked] = useState(false)

  const envVars = [
    { name: "NEXT_PUBLIC_API_URL", value: process.env.NEXT_PUBLIC_API_URL },
    { name: "NEXT_PUBLIC_EXPERIMENT_CONTRACT_ADDRESS", value: process.env.NEXT_PUBLIC_EXPERIMENT_CONTRACT_ADDRESS },
    { name: "NEXT_PUBLIC_DATA_NFT_CONTRACT_ADDRESS", value: process.env.NEXT_PUBLIC_DATA_NFT_CONTRACT_ADDRESS },
    { name: "NEXT_PUBLIC_RPC_URL", value: process.env.NEXT_PUBLIC_RPC_URL },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>环境变量检查</CardTitle>
        <CardDescription>验证必要的环境变量是否已正确配置</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            {envVars.map((env) => (
              <div key={env.name} className="flex items-center justify-between py-1">
                <div className="font-medium">{env.name}</div>
                {checked ? (
                  <div className="flex items-center">
                    {env.value ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    {env.value ? "已配置" : "未配置"}
                  </div>
                ) : (
                  <div className="text-muted-foreground">点击检查按钮验证</div>
                )}
              </div>
            ))}
          </div>

          <Button onClick={() => setChecked(true)} className="w-full">
            检查环境变量
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

