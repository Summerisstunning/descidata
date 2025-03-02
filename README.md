# DeSciData

A platform for decentralized science data storage, funding, and provenance tracking built on Ethereum.

## Overview

DeSciData is a smart contract system that allows researchers to:

- Create and manage scientific experiments
- Raise funds for research projects
- Upload and store scientific datasets on decentralized storage
- Track data provenance and citations
- Convert datasets into NFTs for ownership verification
- Control access to sensitive or proprietary data
- Share revenue from data access

## Features

### For Researchers

- **Experiment Creation**: Researchers can create experiments with descriptions, funding goals, and time frames.
- **Dataset Management**: Upload research data with configurable access controls.
- **Data NFTization**: Convert valuable datasets into NFTs with provable ownership.
- **Citation Tracking**: Monitor how your data is being cited and used in the scientific community.
- **Revenue Generation**: Earn income from dataset access purchases.

### For Contributors/Funders

- **Research Funding**: Fund experiments that align with your interests.
- **Access Control**: Purchase access to datasets for your own research.
- **Transparent Provenance**: Verify the origin and citation history of datasets.

## Technical Architecture

The DeSciData platform consists of:

1. **Smart Contracts**: Ethereum-based contracts handling ownership, access control, and fund management.
2. **Decentralized Storage**: Integration with IPFS or similar services for storing dataset files.
3. **NFT Implementation**: ERC721 standard for dataset NFT creation and ownership.

## Getting Started

### Prerequisites

- Node.js and npm
- Truffle or Hardhat for development and deployment
- MetaMask or similar Ethereum wallet

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/descidata.git
cd descidata
```

2. Install dependencies
```
npm install
```

3. Compile contracts
```
npx hardhat compile
```

4. Deploy to test network
```
npx hardhat run scripts/deploy.js --network <network_name>
```

## Usage

### For Researchers

1. Connect your wallet to the DeSciData dApp
2. Create a new experiment with funding goals
3. Upload datasets associated with your experiments
4. Optionally NFTize valuable datasets
5. Grant or sell access to your data

### For Contributors

1. Browse active experiments seeking funding
2. Contribute funds to experiments you want to support
3. Purchase access to datasets for your research

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or feedback, please open an issue in this repository or contact the project maintainers.
