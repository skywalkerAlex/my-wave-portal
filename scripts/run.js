const main=async () => {
    const [owner, randomPerson]=await hre.ethers.getSigners();
    const waveContractFactory=await hre.ethers.getContractFactory("WavePortal");
    const waveContract=await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
    });
    await waveContract.deployed();

    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address);

    /*
    * Get Contract balance
    */
    let contractBalance=await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    let waveCount=await waveContract.getTotalWaves();
    console.log("WaveCount: "+waveCount.toNumber());


    const firstWaveTxn=await waveContract.wave("First wave");
    await firstWaveTxn.wait(); // Wait for the transaction to be mined

    waveCount=await waveContract.getTotalWaves();
    console.log("WaveCount: "+waveCount.toNumber());

    /*
    * Get Contract balance to see what happened!
    */
    contractBalance=await hre.ethers.provider.getBalance(waveContract.address);
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    const secondWaveTxn=await waveContract.connect(randomPerson).wave("Second wave!");
    await secondWaveTxn.wait();

    waveCount=await waveContract.getTotalWaves();
    console.log("WaveCount: "+waveCount.toNumber());

    console.log("remove wave");
    waveContract.unWave();

    waveCount=await waveContract.getTotalWaves();
    console.log("WaveCount: "+waveCount.toNumber());

    /*
    * Get Contract balance to see what happened!
    */
    contractBalance=await hre.ethers.provider.getBalance(waveContract.address);
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    let allWaves=await waveContract.getAllWaves();
    console.log("AllWaves: "+allWaves);
};

const runMain=async () => {
    try {
        await main();
        process.exit(0);
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();