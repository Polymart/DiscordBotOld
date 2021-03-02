interface PolymartRequest {
    time: number;
    action: string;
    timeElapsed: string;
}

interface getDownloadURL {
    request: PolymartRequest;
    response: getDownloadURLResponse;
}

interface getDownloadURLResponse {
    success: boolean;
    message: string;
    result: getDownloadURLResult;
}

interface getDownloadURLResult {
    url: string;
    version: string;
    expires: number;
}

interface getUserData {
    request: PolymartRequest;
    response: getUserDataResponse;
}

interface getUserDataResponse {
    success: string;
    resources: ResourceElement[];
    user: User;
    errors: any[];
}

interface ResourceElement {
    id: string;
    title: string;
    price: string;
    currency: string;
    url: string;
    subtitle: string;
    purchaseValid: boolean;
    purchaseStatus: string;
    downloaded: boolean;
}

interface User {
    id: string;
    username: string;
    profilePictureURL: string;
}

interface InvalidateAuthToken {
    request: PolymartRequest;
    response: InvalidateAuthTokenResponse;
}

interface InvalidateAuthTokenResponse {
    success: boolean;
    result: {
        message: string;
    }
}

interface VerifyAuthToken {
    request: PolymartRequest;
    response: VerifyAuthTokenResponse;
}

interface VerifyAuthTokenResponse {
    success: boolean;
    result: {
        success: boolean;
        message: string;
        user: {
            id: string;
        };
        expires: number;
    }
}

interface AuthorizeUser {
    request: PolymartRequest;
    response: AuthorizeUserResponse;
}

interface AuthorizeUserResponse {
    success: boolean;
    result: AuthorizeUserResult;
}

interface AuthorizeUserResult {
    url: string;
    token: string;
}

interface VerifyUser {
    request: PolymartRequest;
    response: VerifyUserResponse;
}

interface VerifyUserResponse {
    success: boolean;
    result: VerifyUserResult;
}

interface VerifyUserResult {
    user: {
        id: string;
    };
}

interface GenerateUserVerifyURL {
    request: PolymartRequest;
    response: GenerateUserVerifyURLResponse;
}

interface GenerateUserVerifyURLResponse {
    success: boolean;
    result: {
        url: string;
    }
}

interface getResourceUserData {
    request: PolymartRequest;
    response: getResourceUserDataResponse;
}

interface getResourceUserDataResponse {
    success: boolean;
    resource: ResourceUserData;
    user: {
        id: string;
    };
}

interface ResourceUserData {
    id: string;
    purchaseValid: boolean;
    purchaseStatus: string;
}

interface PostUpdate {
    request: PolymartRequest;
    response: PostUpdateResponse;
}

interface PostUpdateResponse {
    success: boolean;
    errors: any[];
    update: Update;
    resource: {
        id: number;
    };
}

interface Update {
    id: number;
    version: string;
    beta: boolean;
    snapshot: boolean;
}

interface getResourceInfo {
    request: PolymartRequest;
    response: getResourceInfoResponse;
}

interface getResourceInfoResponse {
    success: boolean;
    resource: ResourceInfo;
}

interface ResourceInfo {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    currency: string;
    updates: {
        latest: Latest;
    },
    owner: ResourceOwner,
    themeColorLight: string,
    themeColorDark: string
}

interface Latest {
    id: string;
    version: string;
    title: string;
    description: string;
    time: string;
    snapshot: string;
    beta: string;
}

interface RequestUpdateURL {
    request: PolymartRequest;
    response: RequestUpdateURLResponse;
}

interface RequestUpdateURLResponse {
    success: boolean;
    result: getDownloadURLResult;
}

interface VerifyPurchase {
    request: PolymartRequest;
    response: {
        success: boolean;
    }
}

interface SearchParams {
    query?: string,
    sort?: string,
    premium?: boolean,
    start?: number,
    limit?: number,
    referrer?: string
}

interface Search {
    request: PolymartRequest;
    response: SearchResponse;
}

interface SearchResponse {
    success: boolean;
    result_count: number;
    more: boolean;
    next_start: number;
    total: number;
    remaining: number;
    result: ResultElement[];
}

interface ResourceOwner {
    type: string,
    id: number,
    name: string,
    url: string
}

interface ResultElement {
    id: string;
    url: string;
    owner: ResourceOwner;
    team: null;
    price: string;
    currency: string;
    title: string;
    subtitle: string;
    version: string;
    creationTime: string;
    lastUpdateTime: string;
    supportedServerSoftware: null;
    supportedLanguages: string;
    supportedMinecraftVersions: string;
    donationLink: null;
    sourceCodeLink: null;
    thumbnailURL: string;
    headerURL: string;
    themeColorLight: string,
    themeColorDark: string,
    canDownload: boolean;
}
