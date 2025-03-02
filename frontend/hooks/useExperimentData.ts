"use client"

import { useState, useEffect } from "react"
import { experimentsAPI } from "@/lib/api"
import { experimentContract } from "@/lib/blockchain"

// 混合数据获取 - 同时从 API 和区块链获取数据
export function useExperimentData(experimentId: string) {
  const [experiment, setExperiment] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchExperimentData() {
      try {
        setIsLoading(true)

        // 并行获取数据
        const [apiData, blockchainData] = await Promise.all([
          // 尝试从 API 获取详细数据
          experimentsAPI
            .getById(experimentId)
            .catch(() => null),
          // 尝试从区块链获取数据
          experimentContract
            .getExperiment(experimentId)
            .catch(() => null),
        ])

        // 如果两个数据源都失败，则使用模拟数据
        if (!apiData && !blockchainData) {
          // 使用模拟数据作为后备
          const mockData = getMockExperimentData(experimentId)
          if (!mockData) {
            throw new Error("实验数据不存在")
          }
          setExperiment(mockData)
          return
        }

        // 合并数据，优先使用区块链数据作为真实来源
        const mergedData = {
          ...(apiData || {}),
          ...(blockchainData || {}),
          // 确保区块链数据优先（例如资金状态）
          ...(blockchainData
            ? {
                fundingGoal: blockchainData.fundingGoal,
                fundingRaised: blockchainData.fundingRaised,
                status: blockchainData.status,
              }
            : {}),
        }

        setExperiment(mergedData)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("获取实验数据失败"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchExperimentData()
  }, [experimentId])

  return { experiment, isLoading, error }
}

// 模拟数据作为后备
function getMockExperimentData(id: string) {
  // 这里可以放置之前的模拟数据
  const experimentData = {
    "qc-drug-discovery": {
      id: "qc-drug-discovery",
      title: "量子计算在药物发现中的应用",
      description: "使用量子算法加速药物发现过程",
      category: "量子计算",
      accessPrice: 100, // 价格（$EDU/月）
      details: {
        overview: `本研究项目旨在利用量子计算算法显著加速药物发现过程。我们正在开发新型量子算法，能够以前所未有的精度模拟分子相互作用。

主要特点：
• 量子加速的分子对接
• 新型药物候选筛选算法
• 与现有制药数据库集成
• 实时分子模拟能力`,
        methodology: `我们的方法结合了：
1. 分子模拟的量子电路设计
2. 机器学习优化技术
3. 经典-量子混合算法
4. 基于云的量子计算资源`,
        impact: `预期影响包括：
• 10倍加速药物发现流程
• 更准确的分子相互作用预测
• 降低制药研究成本
• 治疗复杂疾病的潜在突破`,
      },
      requirements: {
        computation: "访问量子计算资源",
        data: "分子结构数据库",
        timeline: "12个月",
      },
      benefits: ["提前获取研究发现", "在衍生研究中使用数据的权利", "在出版物中获得致谢", "参与研究会议"],
      contractAddress: "0x1234567890abcdef",
      researchers: [
        {
          name: "陈博士",
          role: "首席研究员",
          institution: "量子研究所",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          name: "张博士",
          role: "高级研究员",
          institution: "量子研究所",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ],
      updates: [
        {
          date: "2023-11-15",
          title: "第一个里程碑达成",
          content: "我们已成功实现了第一个用于分子对接模拟的量子算法。初步结果显示，与经典方法相比，速度提高了10倍。",
        },
        {
          date: "2023-10-01",
          title: "项目启动",
          content: "我们很高兴宣布量子计算药物发现项目的启动。感谢所有早期支持者！",
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
        {
          name: "量子算法文档",
          description: "我们方法的技术文档",
          size: "4.5 MB",
          date: "2023-10-15",
          hash: "QmY8c6jzm7Wd...",
        },
      ],
      supportTiers: [
        {
          amount: 100,
          title: "早期支持者",
          description: "获取月度研究更新和在出版物中的致谢",
          backers: 45,
        },
        {
          amount: 500,
          title: "研究贡献者",
          description: "所有之前的奖励，加上提前获取研究数据和与研究团队的季度虚拟会议",
          backers: 22,
        },
        {
          amount: 2500,
          title: "主要贡献者",
          description: "所有之前的奖励，加上您贡献的NFT认证和为发现的分子命名的权利",
          backers: 11,
        },
      ],
      fundingGoal: 50000,
      fundingRaised: 32500,
      backers: 78,
      daysLeft: 15,
      author: {
        name: "李博士",
        institution: "斯坦福大学",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      tags: ["量子计算", "药物发现", "人工智能"],
    },
  }

  return experimentData[id as keyof typeof experimentData]
}

