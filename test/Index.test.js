const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const { interface, bytecode } = require('../compile')

const initialString = 'Hello :)'
const newString = 'Bye'

let accounts
let inbox

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts()

    // Use one of the accounts to deploy a contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode,
            arguments: [initialString]
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        })
})

describe('Inbox Smart Contract', () => {
    it('deploys a contract', () => {  
        assert.ok(inbox.options.address)
    })

    it('initializes correctly', async() => {
        const message = await inbox.methods.message().call()
        assert.equal(message, initialString)
    })

    it('can send new message', async() => {
        await inbox.methods.setMessage(newString).send({
            from: accounts[0]
        })
        const message = await inbox.methods.message().call()
        assert.equal(message, newString)
    })
})