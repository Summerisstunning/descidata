# DeSciData - 去中心化科学数据平台

[![GitHub license](https://img.shields.io/github/license/KarlLeen/descidata)](https://github.com/KarlLeen/descidata/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/KarlLeen/descidata)](https://github.com/KarlLeen/descidata/stargazers)

DeSciData是一个创新的区块链驱动的研究数据管理和融资生态系统，旨在解决科学研究中的数据完整性、获取和资金问题。平台将去中心化存储、智能合约和NFT技术结合，为研究人员创建一个透明、安全且高效的环境。

## 项目概述

DeSciData通过区块链技术和去中心化存储解决方案，实现：

- 研究数据的不可变和可验证存储 
- 数据集的NFT铸造，实现所有权和版权保护
- 基于智能合约的研究项目众筹
- 引文追踪和学术贡献认可
- 研究成果的透明度和可验证性

## 技术架构

本项目由三个主要部分组成：

### 前端 (Next.js + React)
- 现代化、响应式用户界面
- 区块链钱包集成 (MetaMask)
- 实验和数据集浏览与管理

### 后端 (Node.js + Express + TypeScript)
- RESTful API服务
- 区块链交互服务
- IPFS文件管理集成

### 智能合约 (Solidity)
- 实验管理合约
- 数据NFT合约
- 引文跟踪
- 众筹功能

## 主要功能

- **实验管理**: 创建、更新和管理科学实验
- **数据集管理**: 上传、存储和管理研究数据集
- **NFT铸造**: 将数据集转换为NFT以保护知识产权
- **引用追踪**: 追踪研究数据的引用和使用情况
- **众筹机制**: 为有前景的科学项目筹集资金
- **数据验证**: 确保研究数据的完整性和真实性

## 开始使用

### 前提条件

- Node.js v16+
- MetaMask浏览器扩展
- Sepolia测试网络账户和ETH

### 安装

1. 克隆仓库
```bash
git clone https://github.com/KarlLeen/descidata.git
cd descidata
```

2. 安装依赖
```bash
# 后端依赖
cd backend
npm install

# 前端依赖
cd ../frontend
npm install
```

3. 配置环境变量
   
创建必要的环境变量文件：

**后端 (.env)**
```
PORT=5001
NODE_ENV=development
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=YOUR_PRIVATE_KEY
EXPERIMENT_CONTRACT_ADDRESS=0xBd4d685D6DD1e88310bBa33041292050535E60ec
PINATA_API_KEY=YOUR_PINATA_KEY
PINATA_API_SECRET=YOUR_PINATA_SECRET
PINATA_JWT=YOUR_PINATA_JWT
FRONTEND_URL=http://localhost:3000
```

**前端 (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_EXPERIMENT_CONTRACT_ADDRESS=0xBd4d685D6DD1e88310bBa33041292050535E60ec
NEXT_PUBLIC_DATA_NFT_CONTRACT_ADDRESS=YOUR_NFT_CONTRACT_ADDRESS
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

4. 启动应用
```bash
# 在一个终端窗口启动后端
cd backend
npm run dev

# 在另一个终端窗口启动前端
cd frontend
npm run dev
```

访问 http://localhost:3000 开始使用应用程序。

## 区块链集成

DeSciData目前部署在Sepolia测试网络上，您需要在MetaMask中配置Sepolia网络并获取测试ETH。

当前合约地址:
- 实验合约: `0xBd4d685D6DD1e88310bBa33041292050535E60ec`

## IPFS集成

DeSciData使用Pinata作为IPFS服务提供商，实现：
- 文件上传
- 元数据存储
- 内容检索
- 网关URL生成

## 开发计划

- 全面的测试套件
- 用户认证实现
- 高级数据访问控制
- 更细致的引文机制
- 优化区块链交互方法
- 更强大的错误处理

## 贡献

欢迎提交问题和拉取请求。大型更改请先开issue讨论。

## 许可证

本项目基于MIT许可证 - 详情请见LICENSE文件。

## 联系方式

- 项目维护者: [Karl Leen](https://github.com/KarlLeen)
- 邮箱: example@example.com

---

*DeSciData - 为去中心化科学创新提供动力*
