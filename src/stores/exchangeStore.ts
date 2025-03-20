import { makeAutoObservable, runInAction } from 'mobx'
import axios from 'axios'

const API_URL = 'https://namig.pro/api'

interface Coin {
  id: number
  name: string
  symbol: string
}

interface ConversionResult {
  rate: number
  estimatedAmount: number
}

class ExchangeStore {
    sourceCurrency: number = 1
    targetCurrency: number = 2
    sourceAmount: string = ''
    targetAmount: string = ''
    coins: Coin[] = []
    exchangeRate: number = 0
    isLoadingCoins: boolean = false
    isLoadingSource: boolean = false
    isLoadingTarget: boolean = false
    isLoadingRate: boolean = false
  
    constructor() {
      makeAutoObservable(this)
      this.loadCoins()
      this.getConversionRate('fromAmount', true)
    }

  async loadCoins() {
    this.isLoadingCoins = true
    try {
      const response = await axios.get(`${API_URL}/coins`)
      runInAction(() => {
        this.coins = response.data
        this.isLoadingCoins = false
      })
    } catch (error) {
      console.error('Error loading coins:', error)
      runInAction(() => {
        this.isLoadingCoins = false
      })
    }
  }

  async getConversionRate(source: 'fromAmount' | 'toAmount', isNewPair: boolean = false) {
    const isFromSource = source === 'fromAmount'
    const emptyFields = !this.sourceAmount && !this.targetAmount
    if(isNewPair){
        this.isLoadingRate = true
    }
    try {
        let params = {
            from: this.sourceCurrency,
            to: this.targetCurrency,
        }
        if(!emptyFields){
            params = {
                ...params,
                [source]: isFromSource
                    ? parseFloat(this.sourceAmount) 
                    : parseFloat(this.targetAmount)
            }
        }
      const response = await axios.get(`${API_URL}/conversion`, {
        params: params
      })
      
      runInAction(() => {
        const result: ConversionResult = response.data
        this.exchangeRate = result.rate
        this.isLoadingRate = false
        this.isLoadingTarget = false
        this.isLoadingSource = false
        if (emptyFields){
            return
        }

        if (isFromSource) {
          this.targetAmount = result.estimatedAmount.toString()
        } else {
          this.sourceAmount = result.estimatedAmount.toString()
        }
      })
    } catch (error) {
      console.error('Conversion error:', error)
      runInAction(() => {
        isFromSource ? this.targetAmount = '' : this.sourceAmount = ''
      })
    }
  }


  resetAmounts = () => {
    this.sourceAmount = ''
    this.targetAmount = ''
    this.isLoadingSource = false
    this.isLoadingTarget = false
  }

  setSourceAmount = (amount: string) => {
    this.isLoadingTarget = true
    if(amount === ''){
        this.resetAmounts();
        return
    }
    this.sourceAmount = amount
    this.getConversionRate('fromAmount')
  }

  setTargetAmount = (amount: string) => {
    this.isLoadingSource = true
    if(amount === ''){
        this.resetAmounts();
        return
    }
    this.targetAmount = amount
    this.getConversionRate('toAmount')
  }

  setSourceCurrency = (currencyId: number) => {
    this.isLoadingTarget = true
    this.sourceCurrency = currencyId
    this.getConversionRate('fromAmount', true)
  }

  setTargetCurrency = (currencyId: number) => {
    this.isLoadingSource = true
    this.targetCurrency = currencyId
    this.getConversionRate('toAmount', true)
  }

  swapCurrencies = () => {
    this.isLoadingTarget = true
    const temp = this.sourceCurrency
    this.sourceCurrency = this.targetCurrency
    this.targetCurrency = temp
    this.getConversionRate('fromAmount', true)
  }
}

export const exchangeStore = new ExchangeStore()
