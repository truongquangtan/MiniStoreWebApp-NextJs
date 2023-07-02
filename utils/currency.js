export const formatCurrencyVND = (number) => {
    const formattedNumber = number.toLocaleString(
        'vi-VN',
        {
            style: 'currency',
            currency: 'VND'
        }
    )

    return formattedNumber;
}

