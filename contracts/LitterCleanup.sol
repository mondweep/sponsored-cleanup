//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LitterCleanup {
    address payable public owner;
    uint public cleanupCount;

    struct Bid {
        address payable bidder;
        uint cleanupScale;
        uint payment;
        bool accepted;
        bool cleanedUp;
    }

    mapping(uint => Bid) public bids;

    event BidPlaced(uint bidId, address bidder, uint cleanupScale, uint payment);
    event BidAccepted(uint bidId);
    event BidCleanedUp(uint bidId);

    constructor() {
        owner = payable(msg.sender);
        cleanupCount = 0;
    }

    function placeBid(uint cleanupScale, uint payment) public payable {
        require(msg.value >= payment, "Insufficient payment");
        cleanupCount++;
        bids[cleanupCount] = Bid(payable(msg.sender), cleanupScale, payment, false, false);
        emit BidPlaced(cleanupCount, msg.sender, cleanupScale, payment);
    }

    function acceptBid(uint bidId) public {
        require(msg.sender == owner, "Only the owner can accept bids");
        require(!bids[bidId].accepted, "Bid has already been accepted");
        bids[bidId].accepted = true;
        emit BidAccepted(bidId);
    }

    function cleanUp(uint bidId) public {
        require(bids[bidId].accepted, "Bid has not been accepted");
        require(!bids[bidId].cleanedUp, "Bid has already been cleaned up");
        bids[bidId].cleanedUp = true;
        bids[bidId].bidder.transfer(bids[bidId].payment);
        emit BidCleanedUp(bidId);
    }
    function getCleanupCount() public view returns (uint) {
    return cleanupCount;
}
}