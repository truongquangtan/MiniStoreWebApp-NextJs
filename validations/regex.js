const REGEX = {
    phone: /^[0-9]/,
    noBlank: /\S+/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,255}$/,
    username: /^[a-zA-Z0-9]{4,}$/,
    email: /^[^@]+@[^@]+$/,
    planDateExpire: /^(\d{4})-(\d{2})-(\d{2})$/,
    ipOrDomain: /^(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}|(?:\d{1,3}\.){3}\d{1,3})$/i,
    domain: /^(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/,
    ip: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
    code: /^\S{6}$/,
    slug: /[A-Z]{1,}/,
    keyObject: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/,
    displayName: /\S{5,}/
}

export {
    REGEX
}

