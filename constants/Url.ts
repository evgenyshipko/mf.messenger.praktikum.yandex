
export enum ApiPath{
    AUTH_SIGNUP= '/auth/signup',
    AUTH_SIGNIN='/auth/signin',
    AUTH_USER='/auth/user',
    AUTH_LOGOUT='/auth/logout',
    USER_PROFILE='/user/profile',
    USER_AVATAR='/user/profile/avatar',
    USER_PASSWORD='/user/password',
    CHATS='/chats',
    CHATS_USERS='/chats/users'
}

class Url {
    static getHostUrl() {
        return 'https://ya-praktikum.tech'
    }

    static generate(path: ApiPath) {
        return Url.getHostUrl() + '/api/v2' + path
    }
}

export default Url