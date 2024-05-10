// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {IERC721Errors} from "../src/draft-IERC6093.sol";
import {ERC721} from "../src/ERC721.sol";
import {ERC721Harness} from "../src/TestHarnesses/ERC721Harness.sol";

contract ERC721Test is Test {
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 indexed _tokenId
    );

    ERC721Harness public nft;

    function setUp() public {
        nft = new ERC721Harness("test", "TST");
    }

    function test_ExpectNameTest() public view {
        assertEq(nft.name(), "test");
    }

    function test_ExpectSymbolTST() public view {
        assertEq(nft.symbol(), "TST");
    }

    // ERC721 -- function _mint(address to, uint256 id) -- Tests

    function test_ExposedMint_ExpectError_ERC721InvalidReceiver() public {
        address receiver = address(0);
        uint256 tokenId = 0;

        bytes4 selector = IERC721Errors.ERC721InvalidReceiver.selector;
        vm.expectRevert(abi.encodeWithSelector(selector, receiver));
        nft.exposed_mint(receiver, tokenId);
    }

    function test_ExposedMint_ExpectEvent_Transfer() public {
        address receiver = address(1);
        uint256 tokenId = 0;

        vm.expectEmit(true, true, true, false);
        emit Transfer(address(0), receiver, tokenId);
        nft.exposed_mint(receiver, tokenId);
    }

    function test_ExposedMint_ExpectError_ERC721AlreadyMinted() public {
        address receiver = address(1);
        uint256 tokenId = 0;

        nft.exposed_mint(receiver, tokenId);

        bytes4 selector = ERC721.ERC721AlreadyMinted.selector;
        vm.expectRevert(abi.encodeWithSelector(selector, tokenId, receiver));
        nft.exposed_mint(receiver, tokenId);
    }

    // ERC721 -- function _burn(address to, uint256 id) -- Tests

    function test_ExposedBurn_ExpectError_ERC721NonexistentToken() public {
        uint256 tokenId = 0;

        bytes4 selector = IERC721Errors.ERC721NonexistentToken.selector;
        vm.expectRevert(abi.encodeWithSelector(selector, tokenId));
        nft.exposed_burn(tokenId);
    }

    function test_ExposedBurn_ExpectEvent_Transfer() public {
        address receiver = address(1);
        uint256 tokenId = 0;

        nft.exposed_mint(receiver, tokenId);

        vm.expectEmit(true, true, true, false);
        emit Transfer(receiver, address(0), tokenId);
        nft.exposed_burn(tokenId);
    }
    // function test_ExpectTransferFrom_Address1_To_Address2() public view {
    //     nft.transferFrom(address(1), address(2), 0);
    //     return 0;
    // }
}
