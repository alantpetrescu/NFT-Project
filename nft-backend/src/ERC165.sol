pragma solidity >=0.8.2;

import "forge-std/interfaces/IERC165.sol";

contract ERC165 is IERC165 {
    function supportsInterface(
        bytes4 interfaceID
    ) public view virtual override returns (bool) {
        return interfaceID == type(IERC165).interfaceId;
    }
}
