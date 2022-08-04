import { Button, Divider, Text } from "@chakra-ui/react";
import Moralis from "moralis";
import { useMoralisWeb3Api, useERC20Balances } from "react-moralis"; //import morali api library

import CustomContainer from "./CustomContainer"; // use a container which works as a format template
import React from "react";                       // next.js framework is using react UI library

//aim : get your erc20( & etherum) balance from metamask wallet (after logged in)
export default function Balance({ user }) {  // this componentis called in index.js
    const [ethBalance, setEthBalance] = React.useState(0) //create a react state to store EthBalance insteadof balance (a hugh number fetched using morali api)---easily saying: convert a number in a way undersatanble as ETH
    const Web3Api = useMoralisWeb3Api() // construct a hook

    const { fetchERC20Balances, data } = useERC20Balances() // construct another hook 

    const fetchBalance = async () => {
        const result = await Web3Api.account.getNativeBalance({
            chain: "rinkeby",
            address: user.get('ethAddress') // we passed user as a Prop object(a react term) into this Balance component as a parameter, here we use it to fetch user's ethAddress by using propertyDescriptor:".get():"
        }).catch(e => console.log(e))         
           //Above Web3Api. will fetch account data, token data.etc. here using account data 
           // and further the getNativeBalance method with parameters availble to choose
        if (result.balance) {
            setEthBalance(Moralis.Units.FromWei(result.balance))
        }
    }

    React.useEffect(() => {  //useful link:
        //https://devtrium.com/posts/async-functions-useeffect 
        //plain explanation: useEffect is used to fetch data. we write async function(fetchBalance) outside and 
        // use it as a callback function inside useEffect. 
        fetchBalance()    // grabbed ETH balance
        fetchERC20Balances({  // grabbed erc20 token 
            params: {
                chain: "rinkeby",
                address: user.get('ethAddress')
            }
        })
    }, []) // [] is a dependecy(react term) inside useEffect()

    return (
        <CustomContainer>
            <Text mb="6" fontSize="xl" fontWeight="bold" textAlign="left">My ERC20 Cryptos</Text>
            {ethBalance && <Text>💰&nbsp; {ethBalance} <b>ETH</b></Text>}
            <Divider />
            {data && data.map(token => (
                <div key={token.symbol}>
                    <Text>💰&nbsp; {Moralis.Units.FromWei(token.balance)} <b>{token.symbol}</b></Text>
                    <Divider />    
                </div>
            ))}    

            <Button mt="4" colorScheme="purple" onClick={() => {fetchBalance();  fetchERC20Balances({
            params: {
                chain: "rinkeby",
                address: user.get('ethAddress')
            }      
        }) }}>✅&nbsp; Refresh balance</Button>
        </CustomContainer>
    )
}