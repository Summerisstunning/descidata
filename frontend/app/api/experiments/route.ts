import { NextResponse } from "next/server"
import { experimentContract } from "@/lib/blockchain"

// 模拟数据 - 作为后备和增强区块链数据
const mockExperiments = [
  {
    id: "qc-drug-discovery",
    title: "量子计算在药物发现中的应用",
    description: "使用量子算法加速药物发现过程",
    category: "量子计算",
    accessPrice: 100,
    details: {
      overview: "本研究项目旨在利用量子计算算法显著加速药物发现过程...",
      methodology: "我们的方法结合了量子电路设计、机器学习优化技术...",
      impact: "预期影响包括10倍加速药物发现流程、更准确的分子相互作用预测...",
    },
    fundingGoal: 50000,
    fundingRaised: 32500,
    backers: 78,
    daysLeft: 15,
    status: "funding",
  },
  // 可以添加更多模拟数据
]

export async function GET() {
  try {
    // 尝试从区块链获取数据
    let experiments = []

    try {
      // 尝试从区块链获取实验列表
      const blockchainExperiments = await experimentContract.getAllExperiments()

      // 合并区块链数据和模拟数据以获得完整信息
      experiments = blockchainExperiments.map((blockchainExp: any) => {
        // 查找匹配的模拟数据以获取更多详细信息
        const mockExp = mockExperiments.find((m) => m.id === blockchainExp.id)

        if (mockExp) {
          // 合并数据，保留区块链的资金状态
          return {
            ...mockExp,
            fundingGoal: blockchainExp.fundingGoal,
            fundingRaised: blockchainExp.fundingRaised,
            status: blockchainExp.status,
            contractAddress: blockchainExp.contractAddress,
          }
        }

        return blockchainExp
      })
    } catch (error) {
      console.error("从区块链获取实验失败:", error)
      // 如果区块链调用失败，使用模拟数据
      experiments = mockExperiments
    }

    return NextResponse.json(experiments)
  } catch (error) {
    console.error("API错误:", error)
    return NextResponse.json({ error: "获取实验列表失败" }, { status: 500 })
  }
}

