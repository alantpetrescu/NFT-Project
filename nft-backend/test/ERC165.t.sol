// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.2;

import {Test, console} from "forge-std/Test.sol";
import {ERC165} from "../src/ERC165.sol";

contract ERC165Test is Test {
    ERC165 public instance;

    function setUp() public {
        instance = new ERC165();
    }
}
