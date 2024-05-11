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

    string internal _name;

    string internal _symbol;

    string internal _tokenUri;

    function name() external view override returns (string memory) {
        return _name;
    }

    function symbol() external view override returns (string memory) {
        return _symbol;
    }

    function tokenURI(uint256 _tokenId) external view returns (string memory) {
        return
            string(
                abi.encodePacked(_tokenUri, "/", Strings.toString(_tokenId))
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
    }

    function balanceOf(
        address owner
    ) public view virtual override returns (uint256) {
        if (owner == address(0)) revert ERC721InvalidOwner(owner);

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
                               INITIALIZE
    //////////////////////////////////////////////////////////////*/

    /// @dev To hide constructor warnings across solc versions due to different constructor visibility requirements and
    /// syntaxes, we add an initialization function that can be called only once.
    constructor(
        string memory name_,
        string memory symbol_,
        string memory tokenUri_
    ) {
        _name = name_;
        _symbol = symbol_;
        _tokenUri = tokenUri_; // "bafybeia6hkf3vi4mpb34jpo34rfssz7icqbjserzqrwaw5miyge7jjet2q"

        _mint(msg.sender, 0);
        _mint(msg.sender, 1);
        _mint(msg.sender, 2);
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
    ) public payable virtual override {
        transferFrom(from, to, id);

        if (
            _isContract(to) &&
            IERC721TokenReceiver(to).onERC721Received(
                msg.sender,
                from,
                id,
                ""
            ) !=
            IERC721TokenReceiver.onERC721Received.selector
        ) revert ERC721InvalidReceiver(to);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        bytes memory data
    ) public payable virtual override {
        transferFrom(from, to, id);

        if (
            _isContract(to) &&
            IERC721TokenReceiver(to).onERC721Received(
                msg.sender,
                from,
                id,
                data
            ) !=
            IERC721TokenReceiver.onERC721Received.selector
        ) revert ERC721InvalidReceiver(to);
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

    function _mint(address to, uint256 id) internal virtual {
        if (to == address(0)) revert ERC721InvalidReceiver(to);

        if (_ownerOf[id] != address(0))
            revert ERC721AlreadyMinted(id, _ownerOf[id]);

        // Counter overflow is incredibly unrealistic.

        _balanceOf[to]++;

        _ownerOf[id] = to;

        emit Transfer(address(0), to, id);
    }

    function _burn(uint256 id) internal virtual {
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

    function _safeMint(address to, uint256 id) internal virtual {
        _mint(to, id);

        if (
            _isContract(to) &&
            IERC721TokenReceiver(to).onERC721Received(
                msg.sender,
                address(0),
                id,
                ""
            ) !=
            IERC721TokenReceiver.onERC721Received.selector
        ) revert ERC721InvalidReceiver(to);
    }

    function _safeMint(
        address to,
        uint256 id,
        bytes memory data
    ) internal virtual {
        _mint(to, id);

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
