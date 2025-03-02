import { NextResponse } from "next/server"
import { experimentContract } from "@/lib/blockchain"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // 验证必要的字段
    if (!data.title || !data.description || !data.fundingGoal) {
      return NextResponse.json({ error: "缺少必要字段" }, { status: 400 })
    }

    try {
      // 调用区块链合约创建实验
      const tx = await experimentContract.createExperiment(data)

      return NextResponse.json({
        success: true,
        transaction: {
          hash: tx.hash,
          blockNumber: tx.blockNumber,
        },
        message: "实验创建请求已提交到区块链",
      })
    } catch (error: any) {
      console.error("创建实验失败:", error)

      // 如果是开发环境，返回模拟成功响应
      if (process.env.NODE_ENV === "development") {
        console.log("开发环境: 返回模拟成功响应")
        return NextResponse.json({
          success: true,
          transaction: {
            hash: "0x" + Math.random().toString(16).substring(2, 42),
            blockNumber: Math.floor(Math.random() * 1000000),
          },
          message: "开发环境: 模拟实验创建成功",
        })
      }

      return NextResponse.json({ error: error.message || "创建实验失败" }, { status: 500 })
    }
  } catch (error) {
    console.error("API错误:", error)
    return NextResponse.json({ error: "处理请求失败" }, { status: 500 })
  }
}

