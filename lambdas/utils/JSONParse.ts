export const JSONParse = <A>(str: string | null): A => {
    if (str && str !== '') {
        try {
            return JSON.parse(str) as A;
        } catch (error) {
            throw new Error(`Could not parse ${str}`)
        }
    } else {
        throw new Error(`Could not parse empty string`)
    }
};
