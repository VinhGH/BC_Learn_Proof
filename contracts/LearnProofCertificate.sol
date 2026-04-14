// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract LearnProofCertificate is ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    // Internal counter for token IDs
    uint256 private _nextTokenId;
    
    // Mapping to track if a certificate hash has already been minted
    mapping(string => bool) public isHashMinted;

    event CertificateMinted(address indexed to, uint256 indexed tokenId, string ipfsHash);
    event CertificateBurned(uint256 indexed tokenId);

    constructor(address defaultAdmin) ERC721("LearnProof Certificate", "LPC") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin);
    }

    /**
     * @dev Mints a new Soulbound Certificate.
     * @param to The address of the learner.
     * @param uri The IPFS URI containing the metadata.
     * @param certHash The unique hash of the certificate data to prevent duplicates.
     */
    function mint(address to, string memory uri, string memory certHash) public onlyRole(MINTER_ROLE) {
        require(!isHashMinted[certHash], "SBT: Certificate hash already minted");
        isHashMinted[certHash] = true;
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit CertificateMinted(to, tokenId, certHash);
    }

    /**
     * @dev Burns a certificate (only minter can burn in case of errors).
     * @param tokenId The unique ID of the certificate.
     */
    function burn(uint256 tokenId) public onlyRole(MINTER_ROLE) {
        _burn(tokenId);
        emit CertificateBurned(tokenId);
    }

    /**
     * @dev Override _update to prevent transferring, making this a Soulbound Token (SBT).
     * Only allows minting (from zero address) and burning (to zero address).
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        // Only allow if it's a Mint (from == address(0)) or Burn (to == address(0))
        if (from != address(0) && to != address(0)) {
            revert("SBT: Transfer is prohibited, this is a Soulbound Token");
        }
        return super._update(to, tokenId, auth);
    }

    // The following functions are overrides required by Solidity for multiple inheritance.
    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Override tokenURI to resolve the conflict (ERC721 vs ERC721URIStorage)
    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
