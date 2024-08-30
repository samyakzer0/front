// app.js

// Replace these with your contract addresses
const donationContractAddress = '0x9FaB9e3B8e32D824bb2A2e0Dd51F26e346267c70';
const sageTokenAddress = '0x9f78bba528411d4afa80f25808e7b8b0088b92f8';

// ABI for your contracts (use Remix or etherscan to get ABI)
const donationContractABI = [ /* Your DonationContract ABI here */ ];
const sageTokenABI = [ /* Your SAGEToken ABI here */ ];

let web3;
let donationContract;
let sageTokenContract;

async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable(); // Request account access
            donationContract = new web3.eth.Contract(donationContractABI, donationContractAddress);
            sageTokenContract = new web3.eth.Contract(sageTokenABI, sageTokenAddress);
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        console.error("No Ethereum browser detected. Please install MetaMask.");
    }
}

async function donate() {
    const recipient = document.getElementById('recipient').value;
    const amount = document.getElementById('amount').value;
    const accounts = await web3.eth.getAccounts();

    if (!web3.utils.isAddress(recipient)) {
        alert("Invalid recipient address");
        return;
    }

    try {
        // Approve tokens first
        await sageTokenContract.methods.approve(donationContractAddress, web3.utils.toWei(amount, 'ether')).send({ from: accounts[0] });

        // Donate tokens
        await donationContract.methods.donate(recipient, web3.utils.toWei(amount, 'ether')).send({ from: accounts[0] });

        alert('Donation successful!');
    } catch (error) {
        console.error("Error during donation:", error);
    }
}

// Initialize web3 and contracts
init();
