// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {IERC721Errors} from "../src/draft-IERC6093.sol";
import {ERC721} from "../src/ERC721.sol";

contract ERC721Test is Test {
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 indexed _tokenId
    );

    event Approval(
        address indexed _owner,
        address indexed _approved,
        uint256 indexed _tokenId
    );

    event ApprovalForAll(
        address indexed _owner,
        address indexed _operator,
        bool _approved
    );

    ERC721 public nft;

    function setUp() public {
        nft = new ERC721(
            "test",
            "TST",
            "ipfs://bafybeigelcb33rltlwswd4g5mulbbvuj4rfwofbzstm522hbx4l3wiqnfm"
        );
    }

    // ERC721 -- function name() -- Tests

    function test_Name_ExpectText_test() public view {
        assertEq(nft.name(), "test");
    }

    // ERC721 -- function symbol() -- Tests

    function test_Symbol_ExpectText_TST() public view {
        assertEq(nft.symbol(), "TST");
    }

    // ERC721 -- function baseURI() -- Tests

    function test_BaseURI_ExpectText() public view {
        assertEq(
            nft.baseURI(),
            "ipfs://bafybeigelcb33rltlwswd4g5mulbbvuj4rfwofbzstm522hbx4l3wiqnfm"
        );
    }

    // ERC721 -- function setName(string memory newName) -- Tests

    function test_SetName_ExpectsNoError() public {
        nft.setName("idk");
        assertEq(nft.name(), "idk");
    }

    function test_SetName_ExpectsError_ERC721NotTheCreator() public {
        string memory newName = "idk";

        bytes4 selector = ERC721.ERC721NotTheCreator.selector;
        vm.expectRevert(
            abi.encodeWithSelector(selector, address(this), address(1))
        );
        vm.prank(address(1));
        nft.setName(newName);
    }

    // ERC721 -- function setSymbol(string memory newSymbol) -- Tests

    function test_SetSymbol_ExpectNoError() public {
        nft.setSymbol("idk");
        assertEq(nft.symbol(), "idk");
    }

    function test_SetSymbol_ExpectsError_ERC721NotTheCreator() public {
        string memory newSymbol = "idk";

        bytes4 selector = ERC721.ERC721NotTheCreator.selector;
        vm.expectRevert(
            abi.encodeWithSelector(selector, address(this), address(1))
        );
        vm.prank(address(1));
        nft.setSymbol(newSymbol);
    }

    // ERC721 -- function setBaseURI(string newBaseURI) -- Tests

    function test_SetBaseURI_ExpectsNoError() public {
        nft.setBaseURI("idk");
        assertEq(nft.baseURI(), "idk");
    }

    function test_SetBaseURI_ExpectsError_ERC721NotTheCreator() public {
        string memory newBaseURI = "https://idk";

        bytes4 selector = ERC721.ERC721NotTheCreator.selector;
        vm.expectRevert(
            abi.encodeWithSelector(selector, address(this), address(1))
        );
        vm.prank(address(1));
        nft.setBaseURI(newBaseURI);
    }

    // ERC721 -- function tokenURI(uint256 tokenId) -- Tests

    function test_TokenURI_ExpectText() public view {
        assertEq(
            nft.tokenURI(0),
            "ipfs://bafybeigelcb33rltlwswd4g5mulbbvuj4rfwofbzstm522hbx4l3wiqnfm/0.json"
        );
        assertEq(
            nft.tokenURI(1),
            "ipfs://bafybeigelcb33rltlwswd4g5mulbbvuj4rfwofbzstm522hbx4l3wiqnfm/1.json"
        );
        assertEq(
            nft.tokenURI(2),
            "ipfs://bafybeigelcb33rltlwswd4g5mulbbvuj4rfwofbzstm522hbx4l3wiqnfm/2.json"
        );
    }

    // ERC721 -- function mint(address to, uint256 id) -- Tests

    function test_ExposedMint_ExpectError_ERC721InvalidReceiver() public {
        address receiver = address(0);
        uint256 tokenId = 0;

        bytes4 selector = IERC721Errors.ERC721InvalidReceiver.selector;
        vm.expectRevert(abi.encodeWithSelector(selector, receiver));
        nft.mint(receiver, tokenId);
    }

    function test_ExposedMint_ExpectEvent_Transfer() public {
        address receiver = address(1);
        uint256 tokenId = 3;

        vm.expectEmit(true, true, true, false);
        emit Transfer(address(0), receiver, tokenId);
        nft.mint(receiver, tokenId);
    }

    function test_ExposedMint_ExpectError_ERC721AlreadyMinted() public {
        address receiver = address(1);
        uint256 tokenId = 3;

        nft.mint(receiver, tokenId);

        bytes4 selector = ERC721.ERC721AlreadyMinted.selector;
        vm.expectRevert(abi.encodeWithSelector(selector, tokenId, receiver));
        nft.mint(receiver, tokenId);
    }

    // ERC721 -- function burn(address to, uint256 id) -- Tests

    function test_ExposedBurn_ExpectError_ERC721NonexistentToken() public {
        uint256 tokenId = 3;

        bytes4 selector = IERC721Errors.ERC721NonexistentToken.selector;
        vm.expectRevert(abi.encodeWithSelector(selector, tokenId));
        nft.burn(tokenId);
    }

    function test_ExposedBurn_ExpectEvent_Transfer() public {
        address receiver = address(1);
        uint256 tokenId = 3;

        nft.mint(receiver, tokenId);

        vm.expectEmit(true, true, true, false);
        emit Transfer(receiver, address(0), tokenId);
        nft.burn(tokenId);
    }

    // ERC721 -- function ownerOf(uint256 id) -- Tests

    function test_OwnerOf_ExpectError_ERC721NonexistentToken() public {
        uint256 tokenId = 3;

        bytes4 selector = IERC721Errors.ERC721NonexistentToken.selector;
        vm.expectRevert(abi.encodeWithSelector(selector, tokenId));
        nft.ownerOf(tokenId);
    }

    function test_OwnerOf_ExpectAddress_1() public {
        uint256 tokenId = 3;
        address owner = address(1);

        nft.mint(owner, tokenId);
        assertEq(nft.ownerOf(tokenId), owner);
    }

    // ERC721 -- function balanceOf(address owner) -- Tests

    function test_BalanceOf_ExpectError_ERC721InvalidOwner() public {
        address owner = address(0);

        bytes4 selector = IERC721Errors.ERC721InvalidOwner.selector;
        vm.expectRevert(abi.encodeWithSelector(selector, owner));
        nft.balanceOf(owner);
    }

    function test_BalanceOf_ExpectValue_1() public {
        uint256 tokenId = 3;
        address owner = address(1);

        nft.mint(owner, tokenId);
        assertEq(nft.balanceOf(owner), 1);
    }

    function test_BalanceOf_ExpectValue_3() public {
        address owner = address(1);

        for (uint256 tokenId = 3; tokenId < 6; tokenId++)
            nft.mint(owner, tokenId);

        assertEq(nft.balanceOf(owner), 3);
    }

    // ERC721 -- function approve(address spender, uint256 id) -- Tests

    function test_Approve_ExpectError_ERC721InvalidApprover() public {
        address owner = address(1);
        uint256 tokenId = 3;

        nft.mint(owner, tokenId);
        address spender = address(2);

        bytes4 selector = IERC721Errors.ERC721InvalidApprover.selector;
        vm.expectRevert(abi.encodeWithSelector(selector, spender));
        vm.prank(address(3));
        nft.approve(spender, tokenId);
    }

    function test_Approve_ExpectEvent_Approval() public {
        address owner = address(1);
        uint256 tokenId = 3;

        nft.mint(owner, tokenId);
        address spender = address(2);

        vm.expectEmit(true, true, true, false);
        emit Approval(owner, spender, tokenId);
        vm.prank(owner);
        nft.approve(spender, tokenId);
    }

    // ERC721 -- function setApprovalForAll(address operator, bool approved) -- Tests

    function test_SetApprovalForAll_ExpectEvent_ApprovalForAll() public {
        address owner = address(1);
        address operator = address(2);
        bool approved = true;

        vm.expectEmit(true, true, true, false);
        emit ApprovalForAll(owner, operator, approved);
        vm.prank(owner);
        nft.setApprovalForAll(operator, approved);
    }

    // ERC721 -- function transferFrom(address from, address to, uint256 id) -- Tests

    function test_Approve_ExpectError_ERC721InvalidOwner() public {
        address owner = address(1);
        address from = address(2);
        address to = address(3);
        uint256 tokenId = 3;

        nft.mint(owner, tokenId);

        bytes4 selector = IERC721Errors.ERC721InvalidOwner.selector;
        vm.expectRevert(abi.encodeWithSelector(selector, owner));
        nft.transferFrom(from, to, tokenId);
    }

    function test_Approve_ExpectError_ERC721InvalidReceiver() public {
        address owner = address(1);
        address from = address(1);
        address to = address(0);
        uint256 tokenId = 3;

        nft.mint(owner, tokenId);

        bytes4 selector = IERC721Errors.ERC721InvalidReceiver.selector;
        vm.expectRevert(abi.encodeWithSelector(selector, to));
        nft.transferFrom(from, to, tokenId);
    }

    function test_Approve_ExpectError_ERC721InsufficientApproval() public {
        address owner = address(1);
        address from = address(1);
        address to = address(2);
        uint256 tokenId = 3;

        nft.mint(owner, tokenId);

        bytes4 selector = IERC721Errors.ERC721InsufficientApproval.selector;
        vm.expectRevert(abi.encodeWithSelector(selector, from, tokenId));
        vm.prank(address(3));
        nft.transferFrom(from, to, tokenId);
    }

    function test_SetApprovalForAll_ExpectEvent_Transfer() public {
        address owner = address(1);
        address from = address(1);
        address to = address(2);
        uint256 tokenId = 3;

        nft.mint(owner, tokenId);

        vm.expectEmit(true, true, true, false);
        emit Transfer(from, to, tokenId);
        vm.prank(from);
        nft.transferFrom(from, to, tokenId);
    }
}
