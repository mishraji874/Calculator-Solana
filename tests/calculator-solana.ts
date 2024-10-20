import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CalculatorSolana } from "../target/types/calculator_solana";
import { expect } from "chai";

describe("calculator-solana", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.CalculatorSolana as Program<CalculatorSolana>;

  // Keypair for our Calculator account
  const calculator = anchor.web3.Keypair.generate();
  
  it("Creates a calculator", async () => {
    const greeting = "Hello, Solana!";

    // Call the 'create' function of the calculator program
    const tx = await program.methods
      .create(greeting)
      .accounts({
        calculator: calculator.publicKey,
        user: (program.provider as anchor.AnchorProvider).wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([calculator])
      .rpc();
    
    console.log("Transaction signature:", tx);

    // Fetch the account and verify it
    const account = await program.account.calculator.fetch(calculator.publicKey);
    expect(account.greeting).to.equal(greeting);
  });

  it("Adds two numbers", async () => {
    const num1 = new anchor.BN(5);
    const num2 = new anchor.BN(7);

    // Call the 'add' function of the calculator program
    const tx = await program.methods
      .add(num1, num2)
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    console.log("Transaction signature:", tx);

    // Fetch the account and verify the result
    const account = await program.account.calculator.fetch(calculator.publicKey);
    expect(account.result.toNumber()).to.equal(12);
  });

  it("Subtracts two numbers", async () => {
    const num1 = new anchor.BN(10);
    const num2 = new anchor.BN(4);

    // Call the 'subtract' function
    const tx = await program.methods
      .subtract(num1, num2)
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    console.log("Transaction signature:", tx);

    // Fetch the account and verify the result
    const account = await program.account.calculator.fetch(calculator.publicKey);
    expect(account.result.toNumber()).to.equal(6);
  });

  it("Multiplies two numbers", async () => {
    const num1 = new anchor.BN(3);
    const num2 = new anchor.BN(8);

    // Call the 'multiply' function
    const tx = await program.methods
      .multiply(num1, num2)
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    console.log("Transaction signature:", tx);

    // Fetch the account and verify the result
    const account = await program.account.calculator.fetch(calculator.publicKey);
    expect(account.result.toNumber()).to.equal(24);
  });

  it("Divides two numbers and checks remainder", async () => {
    const num1 = new anchor.BN(20);
    const num2 = new anchor.BN(6);

    // Call the 'divide' function
    const tx = await program.methods
      .divide(num1, num2)
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    console.log("Transaction signature:", tx);

    // Fetch the account and verify the result
    const account = await program.account.calculator.fetch(calculator.publicKey);
    expect(account.result.toNumber()).to.equal(3); // 20 / 6 = 3
    expect(account.remainder.toNumber()).to.equal(2); // 20 % 6 = 2
  });
});
