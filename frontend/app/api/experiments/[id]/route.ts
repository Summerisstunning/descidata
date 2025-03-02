import { NextResponse } from "next/server"
import { experimentContract } from "@/lib/blockchain"

// 模拟数据 - 与前面相同的数据
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
    researchers: [
      {
        name: "陈博士",
        role: "首席研究员",
        institution: "量子研究所",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    updates: [
      {
        date: "2023-11-15",
        title: "第一个里程碑达成",
        content: "我们已成功实现了第一个用于分子对接模拟的量子算法。",
      },
    ],
    dataFiles: [
      {
        name: "初始分子结构",
        description: "目标蛋白质结构的3D模型",
        size: "1.2 GB",
        date: "2023-10-05",
        hash: "QmX7b5jxn6Vd...",
      },
    ],
    supportTiers: [
      {
        amount: 100,
        title: "早期支持者",
        description: "获取月度研究更新和在出版物中的致谢",
        backers: 45,
      },
    ],
    fundingGoal: 50000,
    fundingRaised: 32500,
    backers: 78,
    daysLeft: 15,
    status: "funding",
    author: {
      name: "李博士",
      institution: "斯坦福大学",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    tags: ["量子计算", "药物发现", "人工智能"],
    contractAddress: "0x1234567890abcdef",
  },
  // 可以添加更多模拟数据
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 尝试从区块链获取数据
    let experiment

    try {
      // 尝试从区块链获取实验详情
      const blockchainExp = await experimentContract.getExperiment(id)

      // 查找匹配的模拟数据以获取更多详细信息
      const mockExp = mockExperiments.find((m) => m.id === id)

      if (mockExp) {
        // 合并数据，保留区块链的资金状态
        experiment = {
          ...mockExp,
          fundingGoal: blockchainExp.fundingGoal,
          fundingRaised: blockchainExp.fundingRaised,
          status: blockchainExp.status,
          contractAddress: blockchainExp.contractAddress,
        }
      } else {
        experiment = blockchainExp
      }
    } catch (error) {
      console.error(`从区块链获取实验 ${id} 失败:`, error)
      // 如果区块链调用失败，使用模拟数据
      experiment = mockExperiments.find((m) => m.id === id)
    }

    if (!experiment) {
      return NextResponse.json({ error: "实验未找到" }, { status: 404 })
    }

    return NextResponse.json(experiment)
  } catch (error) {
    console.error("API错误:", error)
    return NextResponse.json({ error: "获取实验详情失败" }, { status: 500 })
  }
}

