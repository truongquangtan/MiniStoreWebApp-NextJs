const base64Image = (file) => {
    return new Promise(
        (resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result)
            }
            reader.readAsDataURL(file)
        }
    )
}

export { base64Image };

