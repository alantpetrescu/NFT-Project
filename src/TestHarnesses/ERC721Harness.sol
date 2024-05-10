pragma solidity >=0.8.2;

import "../ERC721.sol";

contract ERC721Harness is ERC721 {
    constructor(
        string memory name_,
        string memory symbol_
    ) ERC721(name_, symbol_) {}

    function exposed_mint(address to, uint256 id) external {
        _mint(to, id);
    }

    function exposed_burn(uint256 id) external {
        _burn(id);
    }
}
