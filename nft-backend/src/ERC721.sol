// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2;

import {IERC721, IERC721Metadata} from "forge-std/interfaces/IERC721.sol";
import {IERC165, ERC165} from "./ERC165.sol";
import {IERC721Errors} from "./draft-IERC6093.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; // to use BigInt for conversion from uint256 to string

/// @notice This is a mock contract of the ERC721 standard for testing purposes only, it SHOULD NOT be used in production.
/// @dev Forked from: https://github.com/transmissions11/solmate/blob/0384dbaaa4fcb5715738a9254a7c0a4cb62cf458/src/tokens/ERC721.sol
contract ERC721 is IERC721Metadata, ERC165, IERC721Errors {
    /*//////////////////////////////////////////////////////////////
                         METADATA STORAGE/LOGIC
    //////////////////////////////////////////////////////////////*/
    error ERC721AlreadyMinted(uint256 tokenId, address owner);

    error ERC721NotTheCreator(address creator, address impostor);

    modifier onlyCreator() {
        if (msg.sender != _creator)
            revert ERC721NotTheCreator(_creator, msg.sender);
        _;
    }
    modifier validOwner(address owner) {
        if (owner == address(0)) revert ERC721InvalidOwner(owner);
        _;
    }

    modifier validContract(
        address to,
        uint256 id,
        bytes memory data
    ) {
        _;
        if (
            _isContract(to) &&
            IERC721TokenReceiver(to).onERC721Received(
                msg.sender,
                address(0),
                id,
                data
            ) !=
            IERC721TokenReceiver.onERC721Received.selector
        ) revert ERC721InvalidReceiver(to);
    }

    string internal _name;

    string internal _symbol;

    string internal _baseURI;

    address private _creator;

    /*//////////////////////////////////////////////////////////////
                         METADATA GETTERS
    //////////////////////////////////////////////////////////////*/

    function name() external view override returns (string memory) {
        return _name;
    }

    function symbol() external view override returns (string memory) {
        return _symbol;
    }

    function baseURI() external view returns (string memory) {
        return _baseURI;
    }

    /*//////////////////////////////////////////////////////////////
                         METADATA SETTERS
    //////////////////////////////////////////////////////////////*/

    function setName(string memory newName) external onlyCreator {
        _name = newName;
    }

    function setSymbol(string memory newSymbol) external onlyCreator {
        _symbol = newSymbol;
    }

    function setBaseURI(string memory newBaseURI) external onlyCreator {
        _baseURI = newBaseURI;
    }

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_
    ) {
        _name = name_;
        _symbol = symbol_;
        _baseURI = baseURI_;
        _creator = msg.sender;
    }

    /*//////////////////////////////////////////////////////////////
                         METADATA TOKENURI
    //////////////////////////////////////////////////////////////*/

    function tokenURI(uint256 _tokenId) external view returns (string memory) {
        return
            string(
                abi.encodePacked(_baseURI, Strings.toString(_tokenId), ".json")
            );
    }

    /*//////////////////////////////////////////////////////////////
                      ERC721 BALANCE/OWNER STORAGE
    //////////////////////////////////////////////////////////////*/

    mapping(uint256 => address) internal _ownerOf;

    mapping(address => uint256) internal _balanceOf;

    function ownerOf(
        uint256 id
    ) public view virtual override returns (address owner) {
        if ((owner = _ownerOf[id]) == address(0))
            revert ERC721NonexistentToken(id);

        return _ownerOf[id];
    }

    function balanceOf(
        address owner
    ) public view virtual override validOwner(owner) returns (uint256) {
        return _balanceOf[owner];
    }

    /*//////////////////////////////////////////////////////////////
                         ERC721 APPROVAL STORAGE
    //////////////////////////////////////////////////////////////*/

    mapping(uint256 => address) internal _getApproved;

    mapping(address => mapping(address => bool)) internal _isApprovedForAll;

    function getApproved(
        uint256 id
    ) public view virtual override returns (address) {
        return _getApproved[id];
    }

    function isApprovedForAll(
        address owner,
        address operator
    ) public view virtual override returns (bool) {
        return _isApprovedForAll[owner][operator];
    }

    /*//////////////////////////////////////////////////////////////
                              ERC721 LOGIC
    //////////////////////////////////////////////////////////////*/

    function approve(
        address spender,
        uint256 id
    ) public payable virtual override {
        address owner = _ownerOf[id];

        if (
            msg.sender != owner && _isApprovedForAll[owner][msg.sender] == false
        ) revert ERC721InvalidApprover(spender);

        _getApproved[id] = spender;

        emit Approval(owner, spender, id);
    }

    function setApprovalForAll(
        address operator,
        bool approved
    ) public virtual override {
        _isApprovedForAll[msg.sender][operator] = approved;

        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function transferFrom(
        address from,
        address to,
        uint256 id
    ) public payable virtual override {
        if (from != _ownerOf[id]) revert ERC721InvalidOwner(_ownerOf[id]);

        if (to == address(0)) revert ERC721InvalidReceiver(to);

        if (
            msg.sender != from &&
            _isApprovedForAll[from][msg.sender] == false &&
            msg.sender != _getApproved[id]
        ) revert ERC721InsufficientApproval(from, id);

        // Underflow of the sender's balance is impossible because we check for
        // ownership above and the recipient's balance can't realistically overflow.
        _balanceOf[from]--;

        _balanceOf[to]++;

        _ownerOf[id] = to;

        delete _getApproved[id];

        emit Transfer(from, to, id);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id
    ) external payable virtual override validContract(to, id, "") {
        transferFrom(from, to, id);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        bytes memory data
    ) external payable virtual override validContract(to, id, data) {
        transferFrom(from, to, id);
    }

    /*//////////////////////////////////////////////////////////////
                              ERC165 LOGIC
    //////////////////////////////////////////////////////////////*/

    function supportsInterface(
        bytes4 interfaceID
    ) public view virtual override(IERC165, ERC165) returns (bool) {
        return
            type(IERC721).interfaceId == interfaceID ||
            type(IERC721Metadata).interfaceId == interfaceID ||
            super.supportsInterface(interfaceID);
    }

    /*//////////////////////////////////////////////////////////////
                        INTERNAL MINT/BURN LOGIC
    //////////////////////////////////////////////////////////////*/

    function mint(address to, uint256 id) public virtual onlyCreator {
        if (to == address(0)) revert ERC721InvalidReceiver(to);

        if (_ownerOf[id] != address(0))
            revert ERC721AlreadyMinted(id, _ownerOf[id]);

        // Counter overflow is incredibly unrealistic.

        _balanceOf[to]++;

        _ownerOf[id] = to;

        emit Transfer(address(0), to, id);
    }

    function burn(uint256 id) public virtual onlyCreator {
        address owner = _ownerOf[id];

        if (owner == address(0)) revert ERC721NonexistentToken(id);

        _balanceOf[owner]--;

        delete _ownerOf[id];

        delete _getApproved[id];

        emit Transfer(owner, address(0), id);
    }

    /*//////////////////////////////////////////////////////////////
                        INTERNAL SAFE MINT LOGIC
    //////////////////////////////////////////////////////////////*/

    function safeMint(
        address to,
        uint256 id
    ) external virtual validContract(to, id, "") {
        mint(to, id);
    }

    function safeMint(
        address to,
        uint256 id,
        bytes memory data
    ) external virtual validContract(to, id, data) {
        mint(to, id);
    }

    /*//////////////////////////////////////////////////////////////
                                HELPERS
    //////////////////////////////////////////////////////////////*/

    function _isContract(address _addr) private view returns (bool) {
        uint256 codeLength;

        assembly {
            codeLength := extcodesize(_addr)
        }

        return codeLength > 0;
    }
}

interface IERC721TokenReceiver {
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external returns (bytes4);
}
