import { EnvChecker } from "@/components/env-checker"
import { BlockchainTester } from "@/components/blockchain-tester"
import { ApiTester } from "@/components/api-tester"

export default function AdminPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">管理面板</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <EnvChecker />
        <BlockchainTester />
        <ApiTester />
      </div>
    </div>
  )
}

