const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeSciData", function () {
  let desciData;
  let owner;
  let researcher1;
  let researcher2;
  let funder1;
  let funder2;

  const experimentData = {
    title: "Quantum Computing Research",
    description: "Exploring quantum algorithms for drug discovery",
    fundingGoal: ethers.parseEther("10"), // 10 ETH
    durationInDays: 30
  };

  const datasetData = {
    title: "Quantum Computing Results Dataset",
    description: "Raw data from quantum computing simulations",
    dataURI: "ipfs://QmXyz...", // Example IPFS URI
    accessPrice: ethers.parseEther("0.1"), // 0.1 ETH
    isOpenAccess: false
  };

  beforeEach(async function () {
    // Get signers
    [owner, researcher1, researcher2, funder1, funder2] = await ethers.getSigners();

    // Deploy contract
    const DeSciData = await ethers.getContractFactory("DeSciData");
    desciData = await DeSciData.deploy();
  });

  describe("Experiment Management", function () {
    it("Should create a new experiment", async function () {
      await desciData.connect(researcher1).createExperiment(
        experimentData.title,
        experimentData.description,
        experimentData.fundingGoal,
        experimentData.durationInDays
      );

      // Check experiment count
      expect(await desciData.getTotalExperiments()).to.equal(1);

      // Check researcher's experiments
      const researcherExperiments = await desciData.getResearcherExperiments(researcher1.address);
      expect(researcherExperiments.length).to.equal(1);
      expect(researcherExperiments[0]).to.equal(1);

      // Check experiment details
      const experiment = await desciData.getExperiment(1);
      expect(experiment.title).to.equal(experimentData.title);
      expect(experiment.description).to.equal(experimentData.description);
      expect(experiment.researcher).to.equal(researcher1.address);
      expect(experiment.fundingGoal).to.equal(experimentData.fundingGoal);
      expect(experiment.isActive).to.equal(true);
    });

    it("Should allow funding an experiment", async function () {
      // Create experiment
      await desciData.connect(researcher1).createExperiment(
        experimentData.title,
        experimentData.description,
        experimentData.fundingGoal,
        experimentData.durationInDays
      );

      // Fund experiment
      const fundingAmount = ethers.parseEther("5");
      await desciData.connect(funder1).fundExperiment(1, { value: fundingAmount });

      // Check funding status
      const experiment = await desciData.getExperiment(1);
      expect(experiment.fundingRaised).to.equal(fundingAmount);
      
      // Check contributors
      expect(experiment.contributors.length).to.equal(1);
      expect(experiment.contributors[0]).to.equal(funder1.address);
    });

    it("Should mark funding as complete when goal is reached", async function () {
      // Create experiment
      await desciData.connect(researcher1).createExperiment(
        experimentData.title,
        experimentData.description,
        experimentData.fundingGoal,
        experimentData.durationInDays
      );

      // Fund experiment to goal
      await desciData.connect(funder1).fundExperiment(1, { value: experimentData.fundingGoal });

      // Check funding status
      const experiment = await desciData.getExperiment(1);
      expect(experiment.fundingRaised).to.equal(experimentData.fundingGoal);
      expect(experiment.fundingComplete).to.equal(true);
    });
  });

  describe("Dataset Management", function () {
    beforeEach(async function () {
      // Create experiment
      await desciData.connect(researcher1).createExperiment(
        experimentData.title,
        experimentData.description,
        experimentData.fundingGoal,
        experimentData.durationInDays
      );
    });

    it("Should upload a dataset to an experiment", async function () {
      await desciData.connect(researcher1).uploadDataset(
        1, // experimentId
        datasetData.title,
        datasetData.description,
        datasetData.dataURI,
        datasetData.accessPrice,
        datasetData.isOpenAccess
      );

      // Check dataset count
      expect(await desciData.getTotalDatasets()).to.equal(1);

      // Check researcher's datasets
      const researcherDatasets = await desciData.getResearcherDatasets(researcher1.address);
      expect(researcherDatasets.length).to.equal(1);
      expect(researcherDatasets[0]).to.equal(1);

      // Check dataset details
      const dataset = await desciData.getDataset(1);
      expect(dataset.title).to.equal(datasetData.title);
      expect(dataset.description).to.equal(datasetData.description);
      expect(dataset.owner).to.equal(researcher1.address);
      expect(dataset.accessPrice).to.equal(datasetData.accessPrice);
      expect(dataset.isOpenAccess).to.equal(datasetData.isOpenAccess);
    });

    it("Should NFTize a dataset", async function () {
      // Upload dataset
      await desciData.connect(researcher1).uploadDataset(
        1,
        datasetData.title,
        datasetData.description,
        datasetData.dataURI,
        datasetData.accessPrice,
        datasetData.isOpenAccess
      );

      // NFTize dataset
      const tokenURI = "ipfs://QmAbc..."; // Example NFT metadata URI
      await desciData.connect(researcher1).nftizeDataset(1, tokenURI);

      // Check NFT status
      const dataset = await desciData.getDataset(1);
      expect(dataset.isNFTized).to.equal(true);

      // Check NFT ownership
      expect(await desciData.ownerOf(1)).to.equal(researcher1.address);
    });

    it("Should allow purchasing access to a dataset", async function () {
      // Upload dataset
      await desciData.connect(researcher1).uploadDataset(
        1,
        datasetData.title,
        datasetData.description,
        datasetData.dataURI,
        datasetData.accessPrice,
        datasetData.isOpenAccess
      );

      // Purchase access
      await desciData.connect(funder1).purchaseDataAccess(1, { value: datasetData.accessPrice });

      // Check access
      expect(await desciData.hasAccess(1, funder1.address)).to.equal(true);
    });

    it("Should track citations between datasets", async function () {
      // Upload first dataset
      await desciData.connect(researcher1).uploadDataset(
        1,
        "Dataset 1",
        "First dataset",
        "ipfs://dataset1",
        0,
        true // open access
      );

      // Upload second dataset
      await desciData.connect(researcher1).uploadDataset(
        1,
        "Dataset 2",
        "Second dataset that cites the first",
        "ipfs://dataset2",
        0,
        true // open access
      );

      // Cite first dataset from second
      await desciData.connect(researcher1).citeDataset(2, 1);

      // Check citation count
      const dataset = await desciData.getDataset(1);
      expect(dataset.citationCount).to.equal(1);

      // Check citations
      const citations = await desciData.getDatasetCitations(1);
      expect(citations.length).to.equal(1);
      expect(citations[0]).to.equal(2);
    });
  });
});
