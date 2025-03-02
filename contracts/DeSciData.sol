// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title DeSciData
 * @dev A platform for decentralized science data storage, funding, and provenance tracking
 */
contract DeSciData is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    
    Counters.Counter private _experimentIds;
    Counters.Counter private _datasetIds;
    
    // Experiments
    struct Experiment {
        uint256 id;
        string title;
        string description;
        address researcher;
        uint256 fundingGoal;
        uint256 fundingRaised;
        uint256 deadline;
        bool fundingComplete;
        bool isActive;
        uint256[] datasets;
        address[] contributors;
        mapping(address => uint256) contributions;
    }
    
    // Datasets
    struct DatasetInfo {
        uint256 id;
        uint256 experimentId;
        string title;
        string description;
        string dataURI;       // IPFS or other decentralized storage URI
        address owner;
        bool isNFTized;
        uint256 accessPrice;  // Price to access the data if not open
        bool isOpenAccess;
        uint256 citationCount;
        address[] authorized; // Addresses authorized to access the data
    }
    
    // Citations
    struct Citation {
        uint256 citingDataset;
        uint256 citedDataset;
        address citer;
        uint256 timestamp;
    }
    
    // Storage
    mapping(uint256 => Experiment) private experiments;
    mapping(uint256 => DatasetInfo) private datasets;
    mapping(uint256 => Citation[]) private citations;
    mapping(address => uint256[]) private researcherExperiments;
    mapping(address => uint256[]) private researcherDatasets;
    
    // Events
    event ExperimentCreated(uint256 indexed experimentId, address indexed researcher, string title);
    event FundingContributed(uint256 indexed experimentId, address indexed contributor, uint256 amount);
    event FundingGoalReached(uint256 indexed experimentId, uint256 totalRaised);
    event DatasetUploaded(uint256 indexed datasetId, uint256 indexed experimentId, address indexed researcher);
    event DatasetNFTized(uint256 indexed datasetId, address indexed owner);
    event DatasetCited(uint256 indexed citingDataset, uint256 indexed citedDataset, address indexed citer);
    event AccessGranted(uint256 indexed datasetId, address indexed user);
    
    constructor() ERC721("DeSciData Dataset", "DSD") {}
    
    /**
     * @dev Create a new experiment
     * @param _title Experiment title
     * @param _description Experiment description
     * @param _fundingGoal Funding goal in wei
     * @param _durationInDays Duration of funding period in days
     */
    function createExperiment(
        string memory _title,
        string memory _description,
        uint256 _fundingGoal,
        uint256 _durationInDays
    ) public {
        _experimentIds.increment();
        uint256 newExperimentId = _experimentIds.current();
        
        Experiment storage newExperiment = experiments[newExperimentId];
        newExperiment.id = newExperimentId;
        newExperiment.title = _title;
        newExperiment.description = _description;
        newExperiment.researcher = msg.sender;
        newExperiment.fundingGoal = _fundingGoal;
        newExperiment.fundingRaised = 0;
        newExperiment.deadline = block.timestamp + (_durationInDays * 1 days);
        newExperiment.fundingComplete = false;
        newExperiment.isActive = true;
        
        researcherExperiments[msg.sender].push(newExperimentId);
        
        emit ExperimentCreated(newExperimentId, msg.sender, _title);
    }
    
    /**
     * @dev Contribute funding to an experiment
     * @param _experimentId ID of the experiment to fund
     */
    function fundExperiment(uint256 _experimentId) public payable nonReentrant {
        require(msg.value > 0, "Contribution must be greater than 0");
        require(experiments[_experimentId].isActive, "Experiment is not active");
        require(block.timestamp < experiments[_experimentId].deadline, "Funding deadline has passed");
        require(!experiments[_experimentId].fundingComplete, "Funding goal already reached");
        
        Experiment storage experiment = experiments[_experimentId];
        
        // Add contribution
        experiment.fundingRaised = experiment.fundingRaised.add(msg.value);
        
        // Add contributor if not already added
        bool isNewContributor = true;
        for (uint i = 0; i < experiment.contributors.length; i++) {
            if (experiment.contributors[i] == msg.sender) {
                isNewContributor = false;
                break;
            }
        }
        
        if (isNewContributor) {
            experiment.contributors.push(msg.sender);
        }
        
        // Update contributions mapping
        experiment.contributions[msg.sender] = experiment.contributions[msg.sender].add(msg.value);
        
        // Check if funding goal is reached
        if (experiment.fundingRaised >= experiment.fundingGoal) {
            experiment.fundingComplete = true;
            emit FundingGoalReached(_experimentId, experiment.fundingRaised);
        }
        
        emit FundingContributed(_experimentId, msg.sender, msg.value);
    }
    
    /**
     * @dev Upload a dataset for an experiment
     * @param _experimentId ID of the experiment
     * @param _title Dataset title
     * @param _description Dataset description
     * @param _dataURI URI to the dataset on decentralized storage
     * @param _accessPrice Price to access the dataset (0 for open access)
     * @param _isOpenAccess Whether the dataset is open access
     */
    function uploadDataset(
        uint256 _experimentId,
        string memory _title,
        string memory _description,
        string memory _dataURI,
        uint256 _accessPrice,
        bool _isOpenAccess
    ) public {
        require(experiments[_experimentId].isActive, "Experiment is not active");
        require(experiments[_experimentId].researcher == msg.sender, "Only the researcher can upload datasets");
        
        _datasetIds.increment();
        uint256 newDatasetId = _datasetIds.current();
        
        DatasetInfo storage newDataset = datasets[newDatasetId];
        newDataset.id = newDatasetId;
        newDataset.experimentId = _experimentId;
        newDataset.title = _title;
        newDataset.description = _description;
        newDataset.dataURI = _dataURI;
        newDataset.owner = msg.sender;
        newDataset.isNFTized = false;
        newDataset.accessPrice = _accessPrice;
        newDataset.isOpenAccess = _isOpenAccess;
        newDataset.citationCount = 0;
        
        // Add researcher to authorized list
        newDataset.authorized.push(msg.sender);
        
        // Update experiment datasets
        experiments[_experimentId].datasets.push(newDatasetId);
        
        // Update researcher datasets
        researcherDatasets[msg.sender].push(newDatasetId);
        
        emit DatasetUploaded(newDatasetId, _experimentId, msg.sender);
    }
    
    /**
     * @dev Convert a dataset to an NFT
     * @param _datasetId ID of the dataset to NFTize
     * @param _tokenURI Metadata URI for the NFT
     */
    function nftizeDataset(uint256 _datasetId, string memory _tokenURI) public {
        require(datasets[_datasetId].owner == msg.sender, "Only the dataset owner can NFTize it");
        require(!datasets[_datasetId].isNFTized, "Dataset is already NFTized");
        
        // Mint NFT to dataset owner
        _safeMint(msg.sender, _datasetId);
        _setTokenURI(_datasetId, _tokenURI);
        
        // Update dataset status
        datasets[_datasetId].isNFTized = true;
        
        emit DatasetNFTized(_datasetId, msg.sender);
    }
    
    /**
     * @dev Cite a dataset within another dataset
     * @param _citingDatasetId ID of the dataset that is citing
     * @param _citedDatasetId ID of the dataset being cited
     */
    function citeDataset(uint256 _citingDatasetId, uint256 _citedDatasetId) public {
        require(datasets[_citingDatasetId].owner == msg.sender, "Only the dataset owner can create citations");
        require(_citingDatasetId != _citedDatasetId, "Cannot cite itself");
        
        // Create new citation
        Citation memory newCitation = Citation({
            citingDataset: _citingDatasetId,
            citedDataset: _citedDatasetId,
            citer: msg.sender,
            timestamp: block.timestamp
        });
        
        // Add citation to cited dataset
        citations[_citedDatasetId].push(newCitation);
        
        // Increment citation count for cited dataset
        datasets[_citedDatasetId].citationCount++;
        
        emit DatasetCited(_citingDatasetId, _citedDatasetId, msg.sender);
    }
    
    /**
     * @dev Purchase access to a dataset
     * @param _datasetId ID of the dataset to access
     */
    function purchaseDataAccess(uint256 _datasetId) public payable nonReentrant {
        require(!datasets[_datasetId].isOpenAccess, "Dataset is open access, no purchase needed");
        require(msg.value >= datasets[_datasetId].accessPrice, "Insufficient payment");
        
        // Check if user already has access
        bool userHasAccess = false;
        for (uint i = 0; i < datasets[_datasetId].authorized.length; i++) {
            if (datasets[_datasetId].authorized[i] == msg.sender) {
                userHasAccess = true;
                break;
            }
        }
        
        require(!userHasAccess, "User already has access");
        
        // Add user to authorized list
        datasets[_datasetId].authorized.push(msg.sender);
        
        // Transfer payment to dataset owner
        payable(datasets[_datasetId].owner).transfer(msg.value);
        
        emit AccessGranted(_datasetId, msg.sender);
    }
    
    /**
     * @dev Grant access to a dataset
     * @param _datasetId ID of the dataset
     * @param _user Address of the user to grant access
     */
    function grantAccess(uint256 _datasetId, address _user) public {
        require(datasets[_datasetId].owner == msg.sender, "Only the dataset owner can grant access");
        
        // Check if user already has access
        bool userHasAccess = false;
        for (uint i = 0; i < datasets[_datasetId].authorized.length; i++) {
            if (datasets[_datasetId].authorized[i] == _user) {
                userHasAccess = true;
                break;
            }
        }
        
        require(!userHasAccess, "User already has access");
        
        // Add user to authorized list
        datasets[_datasetId].authorized.push(_user);
        
        emit AccessGranted(_datasetId, _user);
    }
    
    /**
     * @dev Check if user has access to a dataset
     * @param _datasetId ID of the dataset
     * @param _user Address of the user
     * @return Whether the user has access
     */
    function hasAccess(uint256 _datasetId, address _user) public view returns (bool) {
        if (datasets[_datasetId].isOpenAccess) {
            return true;
        }
        
        for (uint i = 0; i < datasets[_datasetId].authorized.length; i++) {
            if (datasets[_datasetId].authorized[i] == _user) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * @dev Get experiment details
     * @param _experimentId ID of the experiment
     * @return title The experiment title
     * @return description The experiment description
     * @return researcher The researcher address
     * @return fundingGoal The funding goal amount
     * @return fundingRaised The current funding raised
     * @return deadline The funding deadline timestamp
     * @return fundingComplete Whether funding is complete
     * @return isActive Whether the experiment is active
     * @return datasetIds Array of dataset IDs
     * @return contributors Array of contributor addresses
     */
    function getExperiment(uint256 _experimentId) public view returns (
        string memory title,
        string memory description,
        address researcher,
        uint256 fundingGoal,
        uint256 fundingRaised,
        uint256 deadline,
        bool fundingComplete,
        bool isActive,
        uint256[] memory datasetIds,
        address[] memory contributors
    ) {
        Experiment storage experiment = experiments[_experimentId];
        return (
            experiment.title,
            experiment.description,
            experiment.researcher,
            experiment.fundingGoal,
            experiment.fundingRaised,
            experiment.deadline,
            experiment.fundingComplete,
            experiment.isActive,
            experiment.datasets,
            experiment.contributors
        );
    }
    
    /**
     * @dev Get dataset details
     * @param _datasetId ID of the dataset
     * @return id The dataset ID
     * @return experimentId The associated experiment ID
     * @return title The dataset title
     * @return description The dataset description
     * @return owner The dataset owner address
     * @return isNFTized Whether the dataset is NFTized
     * @return accessPrice The price to access the dataset
     * @return isOpenAccess Whether the dataset is open access
     * @return citationCount The number of citations
     */
    function getDataset(uint256 _datasetId) public view returns (
        uint256 id,
        uint256 experimentId,
        string memory title,
        string memory description,
        address owner,
        bool isNFTized,
        uint256 accessPrice,
        bool isOpenAccess,
        uint256 citationCount
    ) {
        DatasetInfo storage dataset = datasets[_datasetId];
        return (
            dataset.id,
            dataset.experimentId,
            dataset.title,
            dataset.description,
            dataset.owner,
            dataset.isNFTized,
            dataset.accessPrice,
            dataset.isOpenAccess,
            dataset.citationCount
        );
    }
    
    /**
     * @dev Get the data URI for a dataset (only if authorized)
     * @param _datasetId ID of the dataset
     * @return Data URI
     */
    function getDataURI(uint256 _datasetId) public view returns (string memory) {
        require(hasAccess(_datasetId, msg.sender), "User does not have access to this dataset");
        return datasets[_datasetId].dataURI;
    }
    
    /**
     * @dev Get all experiments by a researcher
     * @param _researcher Address of the researcher
     * @return Array of experiment IDs
     */
    function getResearcherExperiments(address _researcher) public view returns (uint256[] memory) {
        return researcherExperiments[_researcher];
    }
    
    /**
     * @dev Get all datasets by a researcher
     * @param _researcher Address of the researcher
     * @return Array of dataset IDs
     */
    function getResearcherDatasets(address _researcher) public view returns (uint256[] memory) {
        return researcherDatasets[_researcher];
    }
    
    /**
     * @dev Get the total number of experiments
     * @return Total number of experiments
     */
    function getTotalExperiments() public view returns (uint256) {
        return _experimentIds.current();
    }
    
    /**
     * @dev Get the total number of datasets
     * @return Total number of datasets
     */
    function getTotalDatasets() public view returns (uint256) {
        return _datasetIds.current();
    }
    
    /**
     * @dev Get citations for a dataset
     * @param _datasetId ID of the dataset
     * @return Array of citing dataset IDs
     */
    function getDatasetCitations(uint256 _datasetId) public view returns (uint256[] memory) {
        Citation[] memory datasetCitations = citations[_datasetId];
        uint256[] memory citingDatasets = new uint256[](datasetCitations.length);
        
        for (uint i = 0; i < datasetCitations.length; i++) {
            citingDatasets[i] = datasetCitations[i].citingDataset;
        }
        
        return citingDatasets;
    }
}
