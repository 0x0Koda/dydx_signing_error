import { DirectSecp256k1HdWallet, OfflineDirectSigner } from "@cosmjs/proto-signing"
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate"


const rpc = "http://3.16.182.9:26657"

const getAliceSignerFromMnemonic = async (): Promise<OfflineDirectSigner> => {
    return DirectSecp256k1HdWallet.fromMnemonic("your key with dydx usdc funds", {
        prefix: "dydx",
    })
}

const runAll = async (): Promise<void> => {
    const client = await StargateClient.connect(rpc)
    console.log("With client, chain id:", await client.getChainId(), ", height:", await client.getHeight())
    console.log(
        "balances:",
        await client.getAllBalances("dydx1zqnudqmjrgh9m3ec9yztkrn4ttx7ys64qa96wl")
    )

    const account2Signer: OfflineDirectSigner = await DirectSecp256k1HdWallet.fromMnemonic("review urge wish dry tiny ticket frown convince jewel dragon dignity bar", {
        prefix: "dydx",
    })

    const account2 = (await account2Signer.getAccounts())[0].address




    const accountSigner: OfflineDirectSigner = await getAliceSignerFromMnemonic()
    const account = (await accountSigner.getAccounts())[0].address
    console.log("address from signer", account)
    const signingClient = await SigningStargateClient.connectWithSigner(rpc, accountSigner)
    console.log(
        "With signing client, chain id:",
        await signingClient.getChainId(),
        ", height:",
        await signingClient.getHeight()
    )


    const result = await signingClient.sendTokens(account, account2, [{ denom: "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5", amount: "111111" }], {
        amount: [{ denom: "udydx", amount: "0" }],
        gas: "200000",
    })
    console.log("Transfer result:", result)

}

runAll()