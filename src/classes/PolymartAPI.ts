import axios, { AxiosResponse } from 'axios'
import cryptoRandomString from 'crypto-random-string'
import consola from 'consola'

export default class PolymartAPI {

    private static BASE_URL = 'https://api.polymart.org'
    static NONCE = cryptoRandomString({ length: 10 })

    public static async generateUserVerifyURL(): Promise<string> {
        const response = await axios.get<GenerateUserVerifyURL>(this.BASE_URL + '/v1/generateUserVerifyURL', {
            params: {
                service: 'PolymartDiscordBot',
                nonce: this.NONCE,
            },
        })
        if (response.data.response.success)
            return response.data.response.result.url

        PolymartAPI.checkErrors(response)

        return null
    }

    public static async verifyUser(token: string): Promise<string> {
        const response = await axios.get<VerifyUser>(this.BASE_URL + '/v1/verifyUser', {
            params: {
                service: 'PolymartDiscordBot',
                nonce: this.NONCE,
                token,
            },
        })

        if (response.data.response.success)
            return response.data.response.result.user.id

        PolymartAPI.checkErrors(response)

        return null
    }

    public static async getResourceUserData(resource_id: string | number, user_id: number, api_key: string): Promise<ResourceUserData> {
        const response = await axios.post<getResourceUserData>(this.BASE_URL + '/v1/getResourceUserData', {
            api_key,
            resource_id,
            user_id,
        })

        if (response.data.response.success)
            return response.data.response.resource

        PolymartAPI.checkErrors(response)

        return null
    }

    public static async getUserData(user_id: string, api_key: string): Promise<getUserDataResponse> {
        const response = await axios.post<getUserData>(this.BASE_URL + '/v1/getUserData', {
            api_key,
            user_id,
        })

        if (response.data.response.success)
            return response.data.response

        PolymartAPI.checkErrors(response)

        return null
    }

    public static async getResourceInfo(resource_id: number, api_key: string): Promise<ResourceInfo> {
        const response = await axios.post<getResourceInfo>(this.BASE_URL + '/v1/getResourceInfo', {
            api_key,
            resource_id,
        })

        if (response.data.response.success)
            return response.data.response.resource

        PolymartAPI.checkErrors(response)

        return null
    }

    public static async search(params: SearchParams): Promise<SearchResponse> {
        const response = await axios.get<Search>(this.BASE_URL + '/v1/search', {
            params: {
                query: params.query,
                sort: params.sort,
                premium: params.premium,
                start: params.start,
                limit: params.limit,
                referrer: params.referrer
            },
        })

        if (response.data.response.total > 0)
            return response.data.response

        PolymartAPI.checkErrors(response)

        return null
    }

    private static checkErrors(response: AxiosResponse) {
        if (response.data.response.errors && response.data.response.errors.global)
            consola.error(response.data.response.errors.global)

        consola.debug(response.data)
    }
}
