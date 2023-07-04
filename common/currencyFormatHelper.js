export const formatCurrency = (input) => {
    return Number(input).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
}